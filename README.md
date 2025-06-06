# Tornado-CLI

Command line tool to interact with [Tornado Cash](https://tornadocash.eth.limo/).

### How to install tornado cli

Download and install [node.js](https://nodejs.org/en/download/).

You also need to install C++ build tools in order to do 'npm install', for more information please checkout https://github.com/nodejs/node-gyp#on-unix.

- For Windows: https://stackoverflow.com/a/64224475

- For MacOS: Install XCode Command Line Tools

- For Linux: Install make & gcc, for ubuntu `$ sudo apt-get install -y build-essentials`

If you have git installed on your system, clone the master branch.

```bash
$ git clone https://github.com/tornadosto/tornado-cli-tornadosto
```

Or, download the archive file from git: https://github.com/tornadosto/tornado-cli-tornadosto/archive/refs/heads/main.zip

After downloading or cloning the repository, you must install necessary libraries using the following command.

```bash
$ cd tornado-cli
$ npm install
```

If you want to use Tor connection to conceal ip address, install [Tor Browser](https://www.torproject.org/download/) and add `--tor 9150` for `cli.js` if you connect tor with browser. (For non tor-browser tor service you can use the default 9050 port).

Note that you should reset your tor connection by restarting the browser every time when you deposit & withdraw otherwise you will have the same exit node used for connection.

### Goerli, Mainnet, Binance Smart Chain, Gnosis Chain, Polygon Network, Arbitrum, Avalanche

1. `node cli.js --help`
2. If you want to use secure, anonymous tor connection add `--tor <torPort>` behind the command.
3. Add `PRIVATE_KEY` to `.env` file (optional, only if you want to use it for many operations) - open `.env.example` file, add private key after `PRIVATE_KEY=` and rename file to `.env`.

#### To deposit:

```bash
$ node cli.js deposit <currency> <amount> --rpc <rpc url> --tor <torPort> --private-key <private key>
```

Note that `--tor <torPort>` is optional, and use `--private-key <private key>` only if you didn't add it to `.env` file.

For RPC nodes please refer to the list of public RPC nodes below.

##### Example:

```bash
$ node cli.js deposit ETH 0.1 --rpc https://mainnet.chainnodes.org/d692ae63-0a7e-43e0-9da9-fe4f4cc6c607 --tor 9150

Your note: tornado-eth-0.1-5-0xf73dd6833ccbcc046c44228c8e2aa312bf49e08389dadc7c65e6a73239867b7ef49c705c4db227e2fadd8489a494b6880bdcb6016047e019d1abec1c7652
Tornado ETH balance is 8.9
Sender account ETH balance is 1004873.470619891361352542
Submitting deposit transaction
Tornado ETH balance is 9
Sender account ETH balance is 1004873.361652048361352542
```

#### To withdraw:

```bash
$ node cli.js withdraw <note> <recipient> --rpc <rpc url> --relayer <relayer url> --tor <torPort> --private-key <private key>
```

Note that `--relayer <relayer url>`, `--tor <torPort>` and `--rpc <rpc url>` are optional parameters, and use `--private-key <private key>` only if you withdraw without relayer.
You can don't provide RPC link and withdrawal will be made via default RPC for the chain to which note belongs.

If you want to use Tornado Cash relayer for your first withdrawal to your new ethereum account, please refer to the list of relayers below.

If you don't need relayer while doing withdrawals, you must provide your withdrawal account's private key - either as parameter, or by adding it to `.env` file.

##### Example:

```bash
$ node cli.js withdraw tornado-eth-0.1-5-0xf73dd6833ccbcc046c44228c8e2aa312bf49e08389dadc7c65e6a73239867b7ef49c705c4db227e2fadd8489a494b6880bdcb6016047e019d1abec1c7652 0x8589427373D6D84E98730D7795D8f6f8731FDA16 --rpc https://mainnet.chainnodes.org/d692ae63-0a7e-43e0-9da9-fe4f4cc6c607 --relayer https://goerli-relay.example.org --tor 9150

Relay address:  0x6A31736e7490AbE5D5676be059DFf064AB4aC754
Getting current state from tornado contract
Generating SNARK proof
Proof time: 9117.051ms
Sending withdraw transaction through relay
Transaction submitted through the relay. View transaction on etherscan https://goerli.etherscan.io/tx/0xcb21ae8cad723818c6bc7273e83e00c8393fcdbe74802ce5d562acad691a2a7b
Transaction mined in block 17036120
Done
```

### (Optional) Creating Deposit Notes & Invoices offline

One of the main features of tornado-cli is that it supports creating deposit notes & invoices inside the offline computing environment.

After the private-key like notes are backed up somewhere safe, you can copy the created deposit invoices and use them to create new deposit transaction on online environment.

#### To create deposit notes with `createNote` command.

```bash
$ node cli.js createNote <currency> <amount> <chainId>
```

To find out chainId value for your network, refer to https://chainlist.org/.

##### Example:

```bash
$ node cli.js createNote ETH 0.1 5
Your note: tornado-eth-0.1-5-0x1d9771a7b9f8b6c03d33116208ce8db1aa559d33e65d22dd2ff78375fc6b635f930536d2432b4bde0178c72cfc79d6b27023c5d9de60985f186b34c18c00
Your invoice for deposit: tornadoInvoice-eth-0.1-5-0x1b680c7dda0c2dd1b85f0fe126d49b16ed594b3cd6d5114db5f4593877a6b84f
Backed up deposit note as ./backup-tornado-eth-0.1-5-0x1d9771a7.txt
Backed up invoice as ./backup-tornadoInvoice-eth-0.1-5-0x1b680c7d.txt
```

#### To create corresponding deposit transaction with `depositInvoice` command.

Creating deposit transaction with `depositInvoice` only requires valid deposit note created by `createNote` command, so that the deposit note could be stored without exposed anywhere.

```bash
$ node cli.js depositInvoice <invoice> --rpc <rpc url> --tor <tor port>
```

Parameter `--rpc <rpc url>` is optional, if you don't provide it, default RPC (corresponding to note chain) will be used.

##### Example:

```bash
node cli.js depositInvoice tornadoInvoice-eth-0.1-5-0x1b680c7dda0c2dd1b85f0fe126d49b16ed594b3cd6d5114db5f4593877a6b84f --rpc https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161 --tor 9150
Using tor network
Your remote IP address is xx.xx.xx.xx from xx.
Creating ETH 0.1 deposit for Goerli network.
Using supplied invoice for deposit
Tornado contract balance is xxx.x ETH
Sender account balance is x.xxxxxxx ETH
Submitting deposit transaction
Submitting transaction to the remote node
View transaction on block explorer https://goerli.etherscan.io/tx/0x6ded443caed8d6f2666841149532c64bee149a9a8e1070ed4c91a12dd1837747
Tornado contract balance is xxx.x ETH
Sender account balance is x.xxxxxxx ETH
```

### List of rpc & relayers for withdrawal

```json
{
  "netId1": {
    "rpcUrls": {
      "publicRpc1": {
        "name": "1RPC",
        "url": "https://1rpc.io/eth"
      },
      "Chainnodes": {
        "name": "Chainnodes",
        "url": "https://mainnet.chainnodes.org/d692ae63-0a7e-43e0-9da9-fe4f4cc6c607"
      }
    },
    "relayers": {
      "0xproxy.eth": {
        "url": "0xproxy.eth",
        "name": "0xproxy.eth",
        "cachedUrl": "http://mainnet.0x0relayer.xyz/"
      },
      "0xtornadocash.eth": {
        "url": "0xtornadocash.eth",
        "name": "0xtornadocash.eth",
        "cachedUrl": "http://mainnet-tornado-0xtornadocash-eth.crypto-bot.exchange/"
      },
      "available-reliable-relayer.eth": {
        "url": "available-reliable-relayer.eth",
        "name": "available-reliable-relayer.eth",
        "cachedUrl": "http://mainnet-tornado-arr-eth.crypto-bot.exchange/"
      },
      "bitah.eth": {
        "url": "bitah.eth",
        "name": "bitah.eth",
        "cachedUrl": "http://tornado.bitah.link/"
      },
      "cheap-relayer.eth": {
        "url": "cheap-relayer.eth",
        "name": "cheap-relayer.eth",
        "cachedUrl": "http://mainnet-tornado.cheap-relayer.xyz/"
      },
      "em3tornado.eth": {
        "url": "em3tornado.eth",
        "name": "em3tornado.eth",
        "cachedUrl": "http://em3torn.com/"
      },
      "lowcost.eth": {
        "url": "lowcost.eth",
        "name": "lowcost.eth",
        "cachedUrl": "http://mainnet-tornado.low-fee.xyz/"
      },
      "relayer007.eth": {
        "url": "relayer007.eth",
        "name": "relayer007.eth",
        "cachedUrl": "http://torn.relayersdao.finance/"
      },
      "reltor.eth": {
        "url": "reltor.eth",
        "name": "reltor.eth",
        "cachedUrl": "http://reltor.su/"
      },
      "shadow-out.eth": {
        "url": "shadow-out.eth",
        "name": "shadow-out.eth",
        "cachedUrl": "http://torn-relayer.shadowninjas.xyz/"
      },
      "thornadope.eth": {
        "url": "thornadope.eth",
        "name": "thornadope.eth",
        "cachedUrl": "http://thornadope.xyz/"
      },
      "torn-eth.eth": {
        "url": "torn-eth.eth",
        "name": "torn-eth.eth",
        "cachedUrl": "http://mainnet-tornado.50swap.com/"
      },
      "torn-relayers.eth": {
        "url": "torn-relayers.eth",
        "name": "torn-relayers.eth",
        "cachedUrl": "http://mainnet.tornrelayers.com/"
      },
      "torn-secure.eth": {
        "url": "torn-secure.eth",
        "name": "torn-secure.eth",
        "cachedUrl": "http://mainnet-tornado.secure-relays.site/"
      },
      "torn69.eth": {
        "url": "torn69.eth",
        "name": "torn69.eth",
        "cachedUrl": "http://m2.torn69.gq/"
      },
      "tornado-crypto-bot-exchange.eth": {
        "url": "tornado-crypto-bot-exchange.eth",
        "name": "tornado-crypto-bot-exchange.eth",
        "cachedUrl": "http://tornado.crypto-bot.exchange/"
      },
      "torndao.eth": {
        "url": "torndao.eth",
        "name": "torndao.eth",
        "cachedUrl": "http://eth-tornado.zkany.com/"
      },
      "tornrelayers.eth": {
        "url": "tornrelayers.eth",
        "name": "tornrelayers.eth",
        "cachedUrl": "http://mainnet-tornado-tornrelayer-eth.crypto-bot.exchange/"
      }
    }
  },
  "netId56": {
    "rpcUrls": {
      "publicRpc1": {
        "name": "BSC Public RPC 1",
        "url": "https://1rpc.io/bnb"
      },
      "publicRpc2": {
        "name": "BSC Public RPC 2",
        "url": "https://bsc-dataseed1.defibit.io"
      },
      "publicRpc3": {
        "name": "BSC Public RPC 3",
        "url": "https://bsc-dataseed1.ninicoin.io"
      }
    },
    "relayers": {
      "0xproxy.eth": {
        "url": "0xproxy.eth",
        "name": "0xproxy.eth",
        "cachedUrl": "http://bsc.0x0relayer.xyz/"
      },
      "bitah.eth": {
        "url": "bitah.eth",
        "name": "bitah.eth",
        "cachedUrl": "http://bsc-tornado.bitah.link/"
      },
      "cheap-relayer.eth": {
        "url": "cheap-relayer.eth",
        "name": "cheap-relayer.eth",
        "cachedUrl": "http://bsc-tornado.cheap-relayer.xyz/"
      },
      "em3tornado.eth": {
        "url": "em3tornado.eth",
        "name": "em3tornado.eth",
        "cachedUrl": "http://bsc.em3torn.com/"
      },
      "lowcost.eth": {
        "url": "lowcost.eth",
        "name": "lowcost.eth",
        "cachedUrl": "http://bsc-tornado.low-fee.xyz/"
      },
      "relayer007.eth": {
        "url": "relayer007.eth",
        "name": "relayer007.eth",
        "cachedUrl": "http://bsc.relayersdao.finance/"
      },
      "reltor.eth": {
        "url": "reltor.eth",
        "name": "reltor.eth",
        "cachedUrl": "http://bsc.reltor.su/"
      },
      "thornadope.eth": {
        "url": "thornadope.eth",
        "name": "thornadope.eth",
        "cachedUrl": "http://tornado-bsc.thornadope.xyz/"
      },
      "torn-relay.eth": {
        "url": "torn-relay.eth",
        "name": "torn-relay.eth",
        "cachedUrl": "http://bsc.torn-relay.com/"
      },
      "torn-relayers.eth": {
        "url": "torn-relayers.eth",
        "name": "torn-relayers.eth",
        "cachedUrl": "http://bsc.tornrelayers.com/"
      },
      "torn-secure.eth": {
        "url": "torn-secure.eth",
        "name": "torn-secure.eth",
        "cachedUrl": "http://bsc-v0.secure-relays.site/"
      },
      "torn69.eth": {
        "url": "torn69.eth",
        "name": "torn69.eth",
        "cachedUrl": "http://bsc.0x111111.xyz/"
      },
      "tornado-crypto-bot-exchange.eth": {
        "url": "tornado-crypto-bot-exchange.eth",
        "name": "tornado-crypto-bot-exchange.eth",
        "cachedUrl": "http://tornado-bsc.crypto-bot.exchange/"
      },
      "torndao.eth": {
        "url": "torndao.eth",
        "name": "torndao.eth",
        "cachedUrl": "http://bsc-tornado.zkany.com/"
      }
    }
  },
  "netId100": {
    "rpcUrls": {
      "publicRpc": {
        "name": "Gnosis Chain RPC",
        "url": "https://rpc.gnosischain.com"
      }
    },
    "relayers": {
      "torndao.eth": {
        "url": "torndao.eth",
        "name": "torndao.eth",
        "cachedUrl": "http://gnosis-tornado.zkany.com/"
      }
    }
  },
  "netId137": {
    "rpcUrls": {
      "publicRpc1": {
        "name": "1RPC",
        "url": "https://1rpc.io/matic"
      },
      "Chainnodes": {
        "name": "Chainnodes",
        "url": "https://polygon-mainnet.chainnodes.org/d692ae63-0a7e-43e0-9da9-fe4f4cc6c607"
      }
    },
    "relayers": {
      "cheap-relayer.eth": {
        "url": "cheap-relayer.eth",
        "name": "cheap-relayer.eth",
        "cachedUrl": "http://polygon-tornado.cheap-relayer.xyz/"
      },
      "lowcost.eth": {
        "url": "lowcost.eth",
        "name": "lowcost.eth",
        "cachedUrl": "http://polygon-tornado.low-fee.xyz/"
      },
      "relayer007.eth": {
        "url": "relayer007.eth",
        "name": "relayer007.eth",
        "cachedUrl": "http://matic.relayersdao.finance/"
      },
      "reltor.eth": {
        "url": "reltor.eth",
        "name": "reltor.eth",
        "cachedUrl": "http://polygon.reltor.su/"
      },
      "thornadope.eth": {
        "url": "thornadope.eth",
        "name": "thornadope.eth",
        "cachedUrl": "http://tornado-polygon.thornadope.xyz/"
      },
      "torn-secure.eth": {
        "url": "torn-secure.eth",
        "name": "torn-secure.eth",
        "cachedUrl": "http://poly-v0.secure-relays.site/"
      },
      "tornado-crypto-bot-exchange.eth": {
        "url": "tornado-crypto-bot-exchange.eth",
        "name": "tornado-crypto-bot-exchange.eth",
        "cachedUrl": "http://tornado-polygon.crypto-bot.exchange/"
      },
      "torndao.eth": {
        "url": "torndao.eth",
        "name": "torndao.eth",
        "cachedUrl": "http://polygon-tornado.zkany.com/"
      }
    }
  },
  "netId42161": {
    "rpcUrls": {
      "publicRpc1": {
        "name": "Arbitrum Public RPC",
        "url": "https://arb1.arbitrum.io/rpc"
      },
      "publicRpc2": {
        "name": "ChainnodesRPC",
        "url": "https://arbitrum-one.chainnodes.org/d692ae63-0a7e-43e0-9da9-fe4f4cc6c607"
      }
    },
    "relayers": {
      "tornado-crypto-bot-exchange.eth": {
        "url": "tornado-crypto-bot-exchange.eth",
        "name": "tornado-crypto-bot-exchange.eth",
        "cachedUrl": "http://tornado-arbitrum.crypto-bot.exchange/"
      },
      "torndao.eth": {
        "url": "torndao.eth",
        "name": "torndao.eth",
        "cachedUrl": "http://arbitrum-tornado.zkany.com/"
      }
    }
  },
  "netId43114": {
    "rpcUrls": {
      "publicRpc": {
        "name": "1RPC",
        "url": "https://1rpc.io/avax/c"
      }
    },
    "relayers": {
      "cheap-relayer.eth": {
        "url": "cheap-relayer.eth",
        "name": "cheap-relayer.eth",
        "cachedUrl": "http://avalanche-tornado.cheap-relayer.xyz/"
      },
      "lowcost.eth": {
        "url": "lowcost.eth",
        "name": "lowcost.eth",
        "cachedUrl": "http://avalanche-tornado.low-fee.xyz/"
      },
      "thornadope.eth": {
        "url": "thornadope.eth",
        "name": "thornadope.eth",
        "cachedUrl": "http://tornado-avalanche.thornadope.xyz/"
      },
      "tornado-crypto-bot-exchange.eth": {
        "url": "tornado-crypto-bot-exchange.eth",
        "name": "tornado-crypto-bot-exchange.eth",
        "cachedUrl": "http://tornado-avalanche.crypto-bot.exchange/"
      }
    }
  },
  "netId10": {
    "rpcUrls": {
      "publicRpc1": {
        "name": "1RPC",
        "url": "https://1rpc.io/op"
      },
      "Chainnodes": {
        "name": "Chainnodes",
        "url": "https://optimism-mainnet.chainnodes.org/d692ae63-0a7e-43e0-9da9-fe4f4cc6c607"
      }
    },
    "relayers": {
      "tornado-crypto-bot-exchange.eth": {
        "url": "tornado-crypto-bot-exchange.eth",
        "name": "tornado-crypto-bot-exchange.eth",
        "cachedUrl": "http://tornado-optimism.crypto-bot.exchange/"
      }
    }
  },
  "netId5": {
    "rpcUrls": {
      "Chainnodes": {
        "name": "Chainnodes RPC",
        "url": "https://goerli.chainnodes.org/d692ae63-0a7e-43e0-9da9-fe4f4cc6c607"
      }
    },
    "relayers": {}
  }
}
```
