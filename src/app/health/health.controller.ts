import { Request, Response, Router } from "express";
import { resSuccess } from "../../utils/response";

const healthController: Router = Router();

healthController.get("/", (_: Request, res: Response) => {
  const health = {
    status: "online",
    uptime: process.uptime(),
  };

  return resSuccess(res, 200, "Site is online", health);
});

export default healthController;
