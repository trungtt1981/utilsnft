import { swapNftTokenL2L1 } from "../service/swap.js";

export async function swapNftL2L1(privateKey, contractAddress, tokenId, receivingAddressL1) {
  await swapNftTokenL2L1({ privateKey, contractAddress, tokenId, receivingAddressL1 });
}
