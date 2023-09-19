import { preSwapNftTokenL2L1 } from "./layer2/index.js";
import { mintNftL1 } from "./layer1.js";

// Swap token on L2 to L1
export const swapNftTokenL2L1 = async (data) => {
  const { privateKey, contractAddress, tokenId, receivingAddressL1 } = data;
  const preSwapRes = await preSwapNftTokenL2L1({
    privateKey,
    contractAddress,
    tokenId,
  });
  if (preSwapRes?.error) {
    return;
  }

  const { nftTokenLink, nftTokenOwner } = preSwapRes;

  await mintNftL1(
    receivingAddressL1,
    nftTokenLink,
    nftTokenOwner,
    tokenId,
    contractAddress
  );
};
