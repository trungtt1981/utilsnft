#! /usr/bin/env node
import { Command } from "commander";
import { DESCRIPTION, VERSION } from "../config/index.js";
import {
  deployNftCollectionL2,
  createAccountL2,
  mintNftL2,
} from "../commands/layer2.js";
import { swapNftL2L1 } from "../commands/swap.js";

const program = new Command();

program
  .name("utilsnft")
  .description(`${DESCRIPTION}. v${VERSION}`)
  .version(VERSION)
  .showHelpAfterError("(add --help for additional information)");

program
  .command("createAccountL2")
  .description(
    "Create an account with address and private key on L2 (i.e. ShimmerEVM testnet)"
  )
  .action(createAccountL2);

program
  .command("deployL2")
  .argument(
    "<privateKey>",
    "Private key of the wallet address (on L2) to be the NFT collection owner. This private key pays for the transaction fee."
  )
  .argument("<name>", "NFT collection name")
  .argument("<symbol>", "NFT collection symbol")
  .argument("<baseURI>", "NFT collection base URI for the token image")
  .description(
    "Deploy NFT collection with the specified name, symbol and base URI on L2 (i.e. ShimmerEVM testnet)"
  )
  .action(deployNftCollectionL2);

program
  .command("mintL2")
  .description(
    "Mint NFT token of the specified collection contract address on L2 (i.e. ShimmerEVM testnet)"
  )
  .argument(
    "<privateKey>",
    "Private key of any wallet address (on L2) to receive the minted NFT token. This private key pays for the transaction fee."
  )
  .argument(
    "<contractAddress>",
    "Contract address (on L2) of the NFT collection of the NFT token to be minted"
  )
  .action(mintNftL2);

program
  .command("swapL2L1")
  .description(
    "Swap NFT token on L2 (i.e. ShimmerEVM testnet) to an equivalent one on L1 (Shimmer testnet)"
  )
  .argument(
    "<privateKey>",
    "Private key of the wallet address (on L2) owning the NFT token to be swapped. This private key pays for the transaction fee."
  )
  .argument(
    "<contractAddress>",
    "Contract address (on L2) of the NFT collection of the NFT token to be swapped"
  )
  .argument("<tokenId>", "ID the NFT token (on L2) to be swapped")
  .argument("<receivingAddressL1>", "Receiving address of any account on L1")
  .action(swapNftL2L1);

program.parse();
