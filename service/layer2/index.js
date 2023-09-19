import fs from "fs/promises";
import {
  getWeb3,
  privKeyToAccountAddress,
  sendTransaction,
  waitForTxConfirmation,
  EXPLORER_URL_L2,
  generateAccount,
  ADMIN_WALLET_PRIV_KEY_L2,
} from "./common.js";

export const deployNFTCollection = async (data) => {
  try {
    const { privateKey, name, symbol, baseURI } = data;

    const contractArgs = [name, symbol, baseURI, ""];

    const { abi, bytecode } = JSON.parse(
      await fs.readFile(new URL("../../contract.abi/NFT.json", import.meta.url))
    );

    const myWeb3 = getWeb3();
    const from = privKeyToAccountAddress(privateKey);
    const contract = new myWeb3.eth.Contract(abi);
    const transaction = contract.deploy({
      data: bytecode,
      arguments: contractArgs,
    });

    // Send tx
    const receipt = await sendTransaction(
      transaction,
      from,
      privateKey,
      null,
      myWeb3
    );

    if (receipt.error) {
      return { error: receipt.error };
    }

    // Wait for tx confirmation
    await waitForTxConfirmation(receipt.transactionHash, myWeb3);

    console.log(
      "Deployed contract address of the NFT collection: ",
      receipt?.contractAddress
    );
    console.log(
      `Transaction link: ${EXPLORER_URL_L2}/tx/${receipt?.transactionHash}`
    );
  } catch (err) {
    console.log("deployNFTCollection - Error:", err?.message);
  }
};

export const createAccount = async () => {
  try {
    const myWeb3 = getWeb3();
    const { address, privateKey } = await generateAccount(myWeb3);

    console.log(
      `Created account with address: ${address} and privateKey: ${privateKey}`
    );
  } catch (err) {
    console.log("createAccount - Error:", err?.message);
    return { error: err?.message };
  }
};

export const mintNft = async (data) => {
  try {
    const { contractAddress, privateKey } = data;
    const myWeb3 = getWeb3();
    const from = privKeyToAccountAddress(privateKey);

    const { abi } = JSON.parse(
      await fs.readFile(new URL("../../contract.abi/NFT.json", import.meta.url))
    );

    const nftTokenContract = new myWeb3.eth.Contract(abi, contractAddress);

    const transaction = nftTokenContract.methods.mint(1);

    // Send tx
    const receipt = await sendTransaction(
      transaction,
      from,
      privateKey,
      0,
      myWeb3
    );

    if (receipt.error) {
      return { error: receipt.error };
    }

    // Wait for tx confirmation
    await waitForTxConfirmation(receipt.transactionHash, myWeb3);

    const tokenIdList = [];

    const logs = receipt.logs;
    for (const log of logs) {
      if (log.data === "0x" && log.topics.length === 4) {
        tokenIdList.push(+log.topics[3].toString());
      }
    }

    console.log("Minted NFT tokenId: ", tokenIdList[0]);
    console.log(
      `Transaction link: ${EXPLORER_URL_L2}/tx/${receipt?.transactionHash}`
    );
  } catch (err) {
    console.log("mintNft - Error:", err?.message);
    return { error: err?.message };
  }
};

export const checkNftTokenOwner = async (data) => {
  try {
    const { privateKey, contractAddress, tokenId } = data;
    const myWeb3 = getWeb3();

    const { abi } = JSON.parse(
      await fs.readFile(new URL("../../contract.abi/NFT.json", import.meta.url))
    );

    const nftTokenContract = new myWeb3.eth.Contract(abi, contractAddress);

    const from = privKeyToAccountAddress(privateKey);

    const tokenOwner = await nftTokenContract.methods.ownerOf(tokenId).call();
    return tokenOwner?.toLowerCase() === from.toLowerCase()
      ? tokenOwner.toLowerCase()
      : null;
  } catch (err) {
    return { error: err?.message };
  }
};

export const transferNftTokenToAdmin = async (data) => {
  try {
    const { privateKey, contractAddress, tokenId } = data;
    const myWeb3 = getWeb3();

    const { abi } = JSON.parse(
      await fs.readFile(new URL("../../contract.abi/NFT.json", import.meta.url))
    );

    const nftTokenContract = new myWeb3.eth.Contract(abi, contractAddress);

    const from = privKeyToAccountAddress(privateKey);
    const adminWalletAddress = privKeyToAccountAddress(
      ADMIN_WALLET_PRIV_KEY_L2
    );

    const transaction = nftTokenContract.methods.safeTransferFrom(
      from,
      adminWalletAddress,
      tokenId
    );

    // Send tx
    const receipt = await sendTransaction(
      transaction,
      from,
      privateKey,
      null,
      myWeb3
    );

    if (receipt.error) {
      return { error: receipt.error };
    }

    // Wait for tx confirmation
    await waitForTxConfirmation(receipt.transactionHash, myWeb3);

    console.log("transferNftTokenToAdmin success");
    console.log(
      `Transaction link: ${EXPLORER_URL_L2}/tx/${receipt?.transactionHash}`
    );
  } catch (err) {
    console.log("transferNftTokenToAdmin - Error:", err?.message);
    return { error: err?.message };
  }
};

export const getNftTokenLink = async (data) => {
  try {
    const { contractAddress, tokenId } = data;
    const myWeb3 = getWeb3();

    const { abi } = JSON.parse(
      await fs.readFile(new URL("../../contract.abi/NFT.json", import.meta.url))
    );

    const nftTokenContract = new myWeb3.eth.Contract(abi, contractAddress);

    const tokenLink = await nftTokenContract.methods.tokenURI(tokenId).call();
    console.log("NFT token link:", tokenLink);
    return tokenLink;
  } catch (err) {
    return { error: err?.message };
  }
};

export const preSwapNftTokenL2L1 = async (data) => {
  const { privateKey, contractAddress, tokenId } = data;
  const checkNftTokenOwnerRes = await checkNftTokenOwner({
    privateKey,
    contractAddress,
    tokenId,
  });

  let errMsg = "";

  // Check NFT token on L2
  if (checkNftTokenOwnerRes?.error) {
    errMsg = "preSwapNftTokenL2L1 - Error: NFT token does not exist";
    console.log(errMsg);
    return { error: errMsg };
  } else if (!checkNftTokenOwnerRes) {
    errMsg =
      "preSwapNftTokenL2L1 - Error: Not the rightful owner of the NFT token";
    console.log(errMsg);
    return { error: errMsg };
  }

  // Get NFT token link
  const nftTokenLink = await getNftTokenLink({
    contractAddress,
    tokenId,
  });
  if (nftTokenLink?.error) {
    return { error: nftTokenLink?.error };
  }

  // Transfer NFT token to an admin wallet address that will keep the NFT token
  // and will also transfer back upon the reverse swap (i.e. from L1 to L2)
  const transferNftRes = await transferNftTokenToAdmin({
    privateKey,
    contractAddress,
    tokenId,
  });
  if (transferNftRes?.error) {
    return { error: transferNftRes?.error };
  }

  return { nftTokenLink, nftTokenOwner: checkNftTokenOwnerRes };
};
