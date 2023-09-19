# utilsnft

Sample CLI NFT utils demo interaction with IOTA Shimmer Testnet [L2](https://explorer.evm.testnet.shimmer.network) and [L1](https://explorer.shimmer.network/testnet) using [iota-sdk](https://www.npmjs.com/package/@iota/sdk#getting-started) and [web3js](https://www.npmjs.com/package/web3)

## Install

```
npm i -g utilsnft
```

## Usage

```
utilsnft --help
```

```
Usage: utilsnft [options] [command]

Sample CLI NFT utils demo interaction with IOTA Shimmer Testnet L2 and L1. v1.0.0

Options:
  -V, --version                                                           output the version number
  -h, --help                                                              display help for command

Commands:
  createAccountL2                                                         Create an account with address and private key on L2 (i.e. ShimmerEVM testnet)
  deployL2 <privateKey> <name> <symbol> <baseURI>                         Deploy NFT collection with the specified name, symbol and base URI on L2 (i.e. ShimmerEVM testnet)
  mintL2 <privateKey> <contractAddress>                                   Mint NFT token of the specified collection contract address on L2 (i.e. ShimmerEVM testnet)
  swapL2L1 <privateKey> <contractAddress> <tokenId> <receivingAddressL1>  Swap NFT token on L2 (i.e. ShimmerEVM testnet) to an equivalent one on L1 (Shimmer testnet)
  help [command]                                                          display help for command
```

## Commands and outputs

### Create an account with address and private key on L2 (i.e. ShimmerEVM testnet)

Command:

```
utilsnft createAccountL2
```

Output:

```
Created account with address: 0x7Dd17F1C195864AA321F7680FbFdF23C85117DA3 and privateKey: 0x2dd8deca0b51423a324d46d7ee549d7abfd595cf602faeebfa6947b44aea795f
Done in 0.53s.
```

### Deploy NFT collection with the specified name, symbol and base URI on L2 (i.e. ShimmerEVM testnet)

Command:

```
utilsnft deployL2 <privateKey> <name> <symbol> <baseURI>
```

- privateKey: Private key of the wallet address (on L2) to be the NFT collection owner. This private key pays for the transaction fee.
- name: NFT collection name
- symbol: NFT collection symbol
- baseURI: NFT collection base URI for the token image

Example:

```
utilsnft deployL2 0x2dd8deca0b51423a324d46d7ee549d7abfd595cf602faeebfa6947b44aea795f name1 sym1 http://my-token-img-link/
```

Output:

```
sendTransaction failed. Please fund the account on this Faucet:  https://evm-toolkit.evm.testnet.shimmer.network
Done in 1.31s.
```

After having funded the newly-created account, run again the command.

Output:

```
Deployed contract address of the NFT collection:  0xdC37E536c45947DBddA1C35f1D11E84d1900d52A
Transaction link: https://explorer.evm.testnet.shimmer.network/tx/0x93abbbd0f0f46b8066d55f105c6402b5c850b33f975cecc2fb0c267b8b66da3d
Done in 2.25s.
```

### Mint NFT token of the specified collection contract address on L2 (i.e. ShimmerEVM testnet)

Here we mint the token of the above-deployed NFT collection.
The specified private key can be of any wallet address to receive the minted NFT token.

Command:

```
utilsnft mintL2 <privateKey> <contractAddress>
```

- privateKey: Private key of any wallet address (on L2) to receive the minted NFT token. This private key pays for the transaction fee.
- contractAddress: Contract address (on L2) of the NFT collection of the NFT token to be minted

Example:

```
utilsnft mintL2 0x2dd8deca0b51423a324d46d7ee549d7abfd595cf602faeebfa6947b44aea795f 0xdC37E536c45947DBddA1C35f1D11E84d1900d52A
```

Output:

```
Minted NFT tokenId:  1
Transaction link: https://explorer.evm.testnet.shimmer.network/tx/0xc9483470853ca6743298e3aab5fa6226130dde21646ef41eaebe311e53ec0781
Done in 2.31s.
```

### Swap NFT token on L2 (i.e. ShimmerEVM testnet) to an equivalent one on L1 (Shimmer testnet)

Command:

```
utilsnft swapL2L1 <privateKey> <contractAddress> <tokenId> <receivingAddressL1>
```

- privateKey: Private key of the wallet address (on L2) owning the NFT token to be swapped. This private key pays for the transaction fee on L2.
- contractAddress: Contract address (on L2) of the NFT collection of the NFT token to be swapped
- tokenId: ID the NFT token (on L2) to be swapped
- receivingAddressL1: Receiving address of any account on L1

Example:

```
utilsnft swapL2L1 0x2dd8deca0b51423a324d46d7ee549d7abfd595cf602faeebfa6947b44aea795f 0xdC37E536c45947DBddA1C35f1D11E84d1900d52A 5 rms1qrzauw6g0xpk77ww6kwa33lart0jwqt7fdvrrgzt3mcka7m2nd3f69hgqmy
```

Output:

```
NFT token link: http://my-token-img-link/5.json
transferNftTokenToAdmin success
Transaction link: https://explorer.evm.testnet.shimmer.network/tx/0xa3c0375d0494fe2fc2bcaa2a1af045ca792a5aaea845306f5cdb0aff4d14882b
NFT token minted on L1
Transaction link: https://explorer.shimmer.network/testnet/transaction/0xc848e673afa79b0d94d3b0f1e5c00365fbda4da19b3d0583845166b87b811db1
```

How it work:

```
For sake of simplicity, the token on L2 to be swapped to L1 will be transferred to an admin wallet on L2.
An NFT token on L1 with the same token metadata link will be minted.
```
