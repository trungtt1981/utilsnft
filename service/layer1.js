import "dotenv/config";
import { utf8ToHex, Wallet } from "@iota/sdk";

export const mintNftL1 = async (
  receivingAddressL1,
  tokenMetadataLinkL2,
  tokenOwnerL2,
  tokenIdL2,
  contractAddressL2
) => {
  try {
    const wallet = new Wallet({
      storagePath: process.env.WALLET_DB_PATH,
    });

    const account = await wallet.getAccount("Alice");

    // We send from the first address in the account.
    const senderAddress = (await account.addresses())[0].address;

    // We need to unlock stronghold.
    await wallet.setStrongholdPassword(process.env.STRONGHOLD_PASSWORD);

    const params = {
      address: receivingAddressL1,
      sender: senderAddress,
      metadata: utf8ToHex(tokenMetadataLinkL2),
      immutableMetadata: utf8ToHex(
        JSON.stringify({
          tokenOwnerL2,
          contractAddressL2,
          tokenIdL2,
        })
      ),
      tag: utf8ToHex(`${contractAddressL2}_${tokenIdL2}`),
      issuer: senderAddress,
    };
    const prepared = await account.prepareMintNfts([params]);
    const transaction = await prepared.send();

    console.log("NFT token minted on L1");

    // Wait for transaction to get included
    // Due to network error, this step can be failed
    try {
      const blockId = await account.retryTransactionUntilIncluded(
        transaction.transactionId
      );

      blockId;
    } catch (err) {}

    console.log(
      `Transaction link: ${process.env.EXPLORER_URL}/transaction/${transaction.transactionId}`
    );

    // Ensure the account is synced after minting.
    await account.sync();
  } catch (error) {
    console.error("Error: ", error);
  }
};
