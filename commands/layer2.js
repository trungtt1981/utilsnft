import {
  deployNFTCollection,
  createAccount,
  mintNft,
} from "../service/layer2/index.js";

export async function deployNftCollectionL2(privateKey, name, symbol, baseURI) {
  await deployNFTCollection({ privateKey, name, symbol, baseURI });
}

export async function createAccountL2() {
  await createAccount();
}

export async function mintNftL2(privateKey, contractAddress) {
  await mintNft({ privateKey, contractAddress });
}
