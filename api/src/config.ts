const flowAccountErrorMessaage = `

No Flow account configured.

Did you export FLOW_ADDRESS and FLOW_PRIVATE_KEY?

`;

const defaultPort = 3000;
const defaultMigrationPath = "./src/migrations";

export function getConfig(env) {
  //env = env ?? process.env;
  env = {
    FLOW_ACCESS_API_URL : "https://access-testnet.onflow.org",
    MINTER_ADDRESS : "0x7ca1ce0beae436bc",
    MINTER_PRIVATE_KEY : "6cd42e512681cbd3316fdcf3fe41d7f0baa9a150cecb52037d9b4cfd2e44e2b4",
    MINTER_ACCOUNT_KEY_INDEX : 0,
    FUNGIBLE_TOKEN_ADDRESS : "0x9a0766d93b6608b7",
    NON_FUNGIBLE_TOKEN_ADDRESS : "0x631e88ae7f1d7c20",
    FUSD_TOKEN_ADDRESS : "0xe223d8a629e49c68",
    DATABASE_URL : "postgresql://bwuser:bwpassword@2102wb_phase-1_group1_db_1:5432/bwitems",
    MIGRATION_PATH : "src/migrations",
    BLOCK_WINDOW : 1
}
  const port = env.PORT || defaultPort;

  const accessApi = env.FLOW_ACCESS_API_URL;

  const minterAddress = env.MINTER_ADDRESS!;
  const minterPrivateKeyHex = env.MINTER_PRIVATE_KEY!;

  if (!env.MINTER_ADDRESS || !env.MINTER_PRIVATE_KEY) {
    throw flowAccountErrorMessaage;
  }

  const minterAccountKeyIndex = env.MINTER_ACCOUNT_KEY_INDEX || 0;

  const fungibleTokenAddress = env.FUNGIBLE_TOKEN_ADDRESS!;

  const nonFungibleTokenAddress = env.NON_FUNGIBLE_TOKEN_ADDRESS!;

  const fusdAddress = env.FUSD_TOKEN_ADDRESS!;

  const databaseUrl = env.DATABASE_URL!;

  const databaseMigrationPath =
    process.env.MIGRATION_PATH || defaultMigrationPath;

  return {
    port,
    accessApi,
    minterAddress,
    minterPrivateKeyHex,
    minterAccountKeyIndex,
    fungibleTokenAddress,
    nonFungibleTokenAddress,
    fusdAddress,
    databaseUrl,
    databaseMigrationPath
  };
}
