import express, { Application, Request, Response } from "express";
import cors from "cors";
import { resFailed } from "./utils/response";
import healthController from "./app/health/health.controller";
import domainController from "./app/domain/domain.controller";

const init = (): Application => {
  const app: Application = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use("/api/health", healthController);
  app.use("/api/domains", domainController);

  app.use((_, res: Response) => resFailed(res, 404, "Not found, go /api"));

  return app;
};

export default init;
