import { Request, Response, NextFunction } from "express";
import { CustomError } from "./CustomError";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
};

export { errorMiddleware };
