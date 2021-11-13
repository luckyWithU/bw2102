import * as t from "@onflow/types";
import * as fcl from "@onflow/fcl";
import { FlowService } from "./flow";
import * as fs from "fs";
import * as path from "path";

const nonFungibleTokenPath = '"../../contracts/NonFungibleToken.cdc"';
const bwItemsPath = '"../../contracts/BWItems.cdc"';

class BWItemsService {
  constructor(
    private readonly flowService: FlowService,
    private readonly nonFungibleTokenAddress: string,
    private readonly bwItemsAddress: string
  ) {}

  setupAccount = async () => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/bwItems/setup_account.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(bwItemsPath, fcl.withPrefix(this.bwItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  mint = async (recipient: string, typeID: number, name: string, color: string, imageUrl: string, info: string, quantity: string, series: string) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/bwItems/mint_bw_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(bwItemsPath, fcl.withPrefix(this.bwItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(recipient, t.Address), fcl.arg(typeID, t.UInt64), fcl.arg(name, t.String), fcl.arg(color, t.String), fcl.arg(imageUrl, t.String), fcl.arg(info, t.String), fcl.arg(quantity, t.String), fcl.arg(series, t.String)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  transfer = async (recipient: string, itemID: number) => {
    const authorization = this.flowService.authorizeMinter();

    const transaction = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/transactions/bwItems/transfer_bw_item.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(bwItemsPath, fcl.withPrefix(this.bwItemsAddress));

    return this.flowService.sendTx({
      transaction,
      args: [fcl.arg(recipient, t.Address), fcl.arg(itemID, t.UInt64)],
      authorizations: [authorization],
      payer: authorization,
      proposer: authorization,
    });
  };

  getCollectionIds = async (account: string): Promise<number[]> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/bwItems/get_collection_ids.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(bwItemsPath, fcl.withPrefix(this.bwItemsAddress));

    return this.flowService.executeScript<number[]>({
      script,
      args: [fcl.arg(account, t.Address)],
    });
  };

  getBWItemType = async (itemID: number): Promise<number> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/bwItems/get_bw_item_type_id.cdc`
        ),
        "utf8"
      )
      .replace(
        nonFungibleTokenPath,
        fcl.withPrefix(this.nonFungibleTokenAddress)
      )
      .replace(bwItemsPath, fcl.withPrefix(this.bwItemsAddress));

    return this.flowService.executeScript<number>({
      script,
      args: [fcl.arg(itemID, t.UInt64)],
    });
  };

  getSupply = async (): Promise<number> => {
    const script = fs
      .readFileSync(
        path.join(
          __dirname,
          `../../../cadence/scripts/bwItems/get_bw_items_supply.cdc`
        ),
        "utf8"
      )
      .replace(bwItemsPath, fcl.withPrefix(this.bwItemsAddress));

    return this.flowService.executeScript<number>({ script, args: [] });
  };
}

export { BWItemsService };
