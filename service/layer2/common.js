import Web3 from "web3";
import {
  NODE_URL_L2,
  CHAIN_ID_L2,
  EXPLORER_URL_L2,
  FAUCET_URL_L2,
  ADMIN_WALLET_PRIV_KEY_L2,
} from "../../config/index.js";

const web3_ShimmerEvmTestnet = new Web3(
  new Web3.providers.HttpProvider(NODE_URL_L2)
);

const INTERFACE_ID_ERC1155 = "0xd9b67a26";

export const generateAccount = async (web3) => {
  if (!web3) throw new Error("generateAccount - missing web3 input");
  const createdAccount = await web3.eth.accounts.create();
  return {
    address: createdAccount?.address,
    privateKey: createdAccount?.privateKey,
  };
};

export const signTransaction = async (options, privateKey, web3) => {
  if (!web3) throw new Error("signTransaction - missing web3 input");
  const signed = await web3.eth.accounts.signTransaction(options, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  return receipt;
};

export const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const waitForTxConfirmation = async (txHash, web3) => {
  if (!web3) throw new Error("waitForTxConfirmation - missing web3 input");
  let receipt = null;
  try {
    while (!receipt) {
      receipt = await web3.eth.getTransactionReceipt(txHash);
      if (receipt && receipt.status === true) {
        return true;
      }
      await sleep(1000);
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const sendTransaction = async (
  transaction,
  from,
  privateKey,
  value = null,
  web3
) => {
  if (!web3) throw new Error("sendTransaction - missing web3 input");
  let gas = null;
  try {
    gas = await transaction.estimateGas(value ? { from, value } : { from });
  } catch (err) {
    const bal = await web3.eth.getBalance(from);
    if (Number(bal) === 0) {
      console.log(
        "sendTransaction failed. Please fund the account on this Faucet: ",
        FAUCET_URL_L2
      );
    } else {
      console.log("Error:", err?.message);
    }

    return { error: err.message };
  }

  try {
    let options = {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas,
      gasPrice: await web3.eth.getGasPrice(),
    };

    if (value !== null) {
      options = {
        ...options,
        value,
      };
    }

    const receipt = await signTransaction(options, privateKey, web3);

    return receipt;
  } catch (err) {
    console.log("sendTransaction - Error:", err.message);
    return { error: err.message };
  }
};

export const privKeyToAccountAddress = (privateKey) => {
  const accountAddress =
    web3_ShimmerEvmTestnet.eth.accounts.privateKeyToAccount(
      privateKey.trim()
    ).address;
  // console.log("privKeyToAccountAddress:", accountAddress);
  return accountAddress;
};

export const getNftTokenContract = (nftTokenContractAddress, web3) => {
  if (!web3) throw new Error("getNftTokenContract - missing web3 input");
  return new web3.eth.Contract(generalNftABI, nftTokenContractAddress.trim());
};

export const isErc1155Token = async (nftTokenContract) => {
  return nftTokenContract.methods
    .supportsInterface(INTERFACE_ID_ERC1155)
    .call();
};

export const getWeb3 = (chainId = CHAIN_ID_L2) => {
  if (Number(chainId) === CHAIN_ID_L2) {
    return web3_ShimmerEvmTestnet;
  } else {
    throw new Error("Unsupported EVM chain");
  }
};
