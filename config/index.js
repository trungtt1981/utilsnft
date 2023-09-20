import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config({
  path: new URL("../.env", import.meta.url),
});

const packageConfig = JSON.parse(
  await fs.readFile(new URL("../package.json", import.meta.url))
);

export const VERSION = packageConfig.version;
export const DESCRIPTION = packageConfig.description;

// export const WALLET_DB_PATH = process.env.WALLET_DB_PATH;
export const STRONGHOLD_PASSWORD = process.env.STRONGHOLD_PASSWORD;
export const EXPLORER_URL = process.env.EXPLORER_URL;
export const NODE_URL = process.env.NODE_URL;

export const NODE_URL_L2 = process.env.NODE_URL_L2;
export const CHAIN_ID_L2 = Number(process.env.CHAIN_ID_L2);
export const EXPLORER_URL_L2 = process.env.EXPLORER_URL_L2;
export const FAUCET_URL_L2 = process.env.FAUCET_URL_L2;
export const ADMIN_WALLET_PRIV_KEY_L2 = process.env.ADMIN_WALLET_PRIV_KEY_L2;
