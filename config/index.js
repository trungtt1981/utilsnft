import fs from "fs/promises";

const packageConfig = JSON.parse(
  await fs.readFile(new URL("../package.json", import.meta.url))
);

export const VERSION = packageConfig.version;
export const DESCRIPTION = packageConfig.description;
