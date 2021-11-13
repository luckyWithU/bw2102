import "express-async-errors";

import path from "path";

import express, { Request, Response } from "express";

import cors from "cors";

import { json, urlencoded } from "body-parser";

import initFUSDRouter from "./routes/fusd";
import initBWTokensRouter from "./routes/bwtokens";
import initBWItemsRouter from "./routes/bw-items";
import initStorefrontRouter from "./routes/storefront";
import { FUSDService } from "./services/fusd";
import { BWTokensService } from "./services/bwtokens";
import { BWItemsService } from "./services/bw-items";
import { StorefrontService } from "./services/storefront";

const V1 = "/v1/";

// Init all routes, setup middlewares and dependencies
const initApp = (
  fusdService: FUSDService,
  bwtokensService: BWTokensService,
  bwItemsService: BWItemsService,
  storefrontService: StorefrontService
) => {
  const app = express();

  // @ts-ignore
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(V1, initFUSDRouter(fusdService));
  app.use(V1, initBWTokensRouter(bwtokensService));
  app.use(V1, initBWItemsRouter(bwItemsService));
  app.use(V1, initStorefrontRouter(storefrontService));

  const serveReactApp = () => {
    app.use(express.static(path.resolve(__dirname, "../../web/build")));
    app.get("*", function (req, res) {
      res.sendFile(path.resolve(__dirname, "../../web/build/index.html"));
    });
  };

  if (process.env.IS_HEROKU) {
    // Serve React static site using Express when deployed to Heroku.
    serveReactApp();
  }

  app.all("*", async (req: Request, res: Response) => {
    return res.sendStatus(404);
  });

  return app;
};

export default initApp;
