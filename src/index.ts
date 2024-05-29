import { Application } from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import init from "./app";
import { logger } from "./utils/logger";
import { checkDomains } from "./app/domain/domain.helper";

dotenv.config();

const app: Application = init();
const PORT: number = Number(process.env.PORT) || 4000;

// run domains check at server start
checkDomains();

// cron job to check domains periodically (30 minutes)
cron.schedule("*/30 * * * *", () => {
  checkDomains();
});

app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
