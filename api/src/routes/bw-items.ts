import express, { Request, Response, Router } from "express";
import { BWItemsService } from "../services/bw-items";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initBWItemsRouter(bwItemsService: BWItemsService): Router {
  const router = express.Router();

  router.post(
    "/bw-items/mint",
    [body("recipient").exists(), body("typeID").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, typeID, name, color, imageUrl, info, quantity, series } = req.body;
      const tx = await bwItemsService.mint(recipient, typeID, name, color, imageUrl, info, quantity, series);
      return res.send({
        transaction: tx,
      });
    }
  );

  router.post("/bw-items/setup", async (req: Request, res: Response) => {
    const transaction = await bwItemsService.setupAccount();
    return res.send({
      transaction,
    });
  });

  router.post(
    "/bw-items/transfer",
    [body("recipient").exists(), body("itemID").isInt()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, itemID } = req.body;
      const tx = await bwItemsService.transfer(recipient, itemID);
      return res.send({
        transaction: tx,
      });
    }
  );

  router.get(
    "/bw-items/collection/:account",
    async (req: Request, res: Response) => {
      const collection = await bwItemsService.getCollectionIds(
        req.params.account
      );
      return res.send({
        collection,
      });
    }
  );

  router.get(
    "/bw-items/item/:itemID",
    async (req: Request, res: Response) => {
      const item = await bwItemsService.getBWItemType(
        parseInt(req.params.itemID)
      );
      return res.send({
        item,
      });
    }
  );

  router.get("/bw-items/supply", async (req: Request, res: Response) => {
    const supply = await bwItemsService.getSupply();
    return res.send({
      supply,
    });
  });

  return router;
}

export default initBWItemsRouter;
