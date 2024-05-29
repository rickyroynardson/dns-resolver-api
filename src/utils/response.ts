import { Response } from "express";

export const resSuccess = (
  res: Response,
  status: number,
  message: string,
  data?: any
): Response => {
  return res.status(status).json({ success: true, message, data });
};

export const resFailed = (
  res: Response,
  status: number,
  message: string,
  error?: any
) => {
  return res.status(status).json({ success: false, message, error });
};
