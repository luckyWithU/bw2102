import express, { Request, Response, Router } from "express";
import { BWTokensService } from "../services/bwtokens";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

function initBWTokensRouter(bwtokensService: BWTokensService): Router {
  const router = express.Router();

  router.post(
    "/bwtokens/mint",
    [body("recipient").exists(), body("amount").isDecimal()],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;

      const transaction = await bwtokensService.mint(recipient, amount);
      return res.send({
        transaction,
      });
    }
  );

  router.post("/bwtokens/setup", async (req: Request, res: Response) => {
    const transaction = await bwtokensService.setupAccount();
    return res.send({
      transaction,
    });
  });

  router.post(
    "/bwtokens/burn",
    [
      body("amount").isInt({
        gt: 0,
      }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { amount } = req.body;
      const transaction = await bwtokensService.burn(amount);
      return res.send({
        transaction,
      });
    }
  );

  router.post(
    "/bwtokens/transfer",
    [
      body("recipient").exists(),
      body("amount").isInt({
        gt: 0,
      }),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { recipient, amount } = req.body;
      const transaction = await bwtokensService.transfer(recipient, amount);
      return res.send({
        transaction,
      });
    }
  );

  router.get(
    "/bwtokens/balance/:account",
    async (req: Request, res: Response) => {
      const balance = await bwtokensService.getBalance(req.params.account);
      return res.send({
        balance,
      });
    }
  );

  router.get("/bwtokens/supply", async (req: Request, res: Response) => {
    const supply = await bwtokensService.getSupply();
    return res.send({
      supply,
    });
  });

  return router;
}

export default initBWTokensRouter;
