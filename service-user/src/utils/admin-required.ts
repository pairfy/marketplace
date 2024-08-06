import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/NotAuthorizedError";

export const adminRequired = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.adminData) {
    throw new NotAuthorizedError();
  }

  next();
};