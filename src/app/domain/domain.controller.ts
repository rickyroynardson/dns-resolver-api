import { Response, Router } from "express";
import { resFailed, resSuccess } from "../../utils/response";
import { getDomains } from "./domain.service";

const domainController: Router = Router();

domainController.get("/", async (_, res: Response) => {
  try {
    const domains = await getDomains();
    return resSuccess(res, 200, "Fetching all domains", domains);
  } catch (error: any) {
    return resFailed(res, 400, error.message);
  }
});

export default domainController;
