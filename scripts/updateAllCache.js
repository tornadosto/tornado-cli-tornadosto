const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const config = require('../config');

function getCurrentNetworkName(networkID) {
  switch (networkID) {
    case 1:
      return 'Ethereum';
    case 56:
      return 'BinanceSmartChain';
    case 100:
      return 'GnosisChain';
    case 137:
      return 'Polygon';
    case 42161:
      return 'Arbitrum';
    case 43114:
      return 'Avalanche';
    case 5:
      return 'Goerli';
    case 42:
      return 'Kovan';
    case 10:
      return 'Optimism';
    default:
      return 'testRPC';
  }
}

function syncDeposits(currency, amount, rpc) {
  return childProcess.spawnSync('node', ['cli.js', 'checkCacheValidity', currency, amount, '--rpc', rpc]);
}

function syncWithdrawals(currency, amount, rpc) {
  return childProcess.spawnSync('node', ['cli.js', 'syncEvents', 'withdrawal', currency, amount, '--rpc', rpc]);
}

function checkSyncResult(resultData, networkName, currency, amount, eventType) {
  const resultOutput = resultData.output.toString();

  if (resultData.error || resultOutput.includes('Error:')) {
    console.log(resultOutput);
    console.error(`Error while updating cache for ${currency.toUpperCase()} ${amount} ${eventType}s on ${networkName}`);
  } else {
    console.log(`Successfully updated cache for ${currency.toUpperCase()} ${amount} ${eventType}s on ${networkName}`);
  }
}

function main() {
  for (const [networkIDInfo, network] of Object.entries(config.deployments)) {
    const networkID = Number(networkIDInfo.match(/\d+/)[0]);
    const networkName = getCurrentNetworkName(networkID);
    const defaultRpc = network.defaultRpc;

    for (const [currency, _data] of Object.entries(network.tokens)) {
      for (const amount of Object.keys(_data.instanceAddress)) {
        console.log(`\nStart updating cache for ${currency.toUpperCase()} ${amount} deposits on ${networkName}`);
        const depositsFile = path.join('cache', networkName.toLowerCase(), `deposits_${currency.toUpperCase()}_${amount}.json`);
        let depositSyncResult = syncDeposits(currency, amount, defaultRpc);

        // If deposit events tree has invalid root, need to reload it all from deployment block
        if (depositSyncResult.output.includes('invalid root')) {
          console.log(
            `Events tree for ${currency.toUpperCase()} ${amount} ${eventType}s on ${networkName} has invalid root. Start full reloading.`
          );
          fs.rmSync(depositsFile);
          depositSyncgResult = syncDeposits(currency, amount, defaultRpc);
        }
        checkSyncResult(depositSyncResult, networkName, currency, amount, 'deposit');

        console.log(`\nStart updating cache for ${currency.toUpperCase()} ${amount} withdrawals on ${networkName}`);
        const withdrawalSyncResult = syncWithdrawals(currency, amount, defaultRpc);
        checkSyncResult(withdrawalSyncResult, networkName, currency, amount, 'withdrawal');
      }
    }
  }

  console.log('\nAll event trees cache updated!\n');
}

main();
