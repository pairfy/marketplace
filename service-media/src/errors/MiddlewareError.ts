import { Request, Response, NextFunction } from "express";
import { CustomError } from "./CustomError";
import { _ } from "../utils/pino";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    _.error(err);
    
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
};

export { errorMiddleware };
