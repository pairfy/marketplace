import { Request, Response, NextFunction } from "express";
import { _ } from "./pino";
import jwt from "jsonwebtoken";

interface MediatorToken {
  id: string;
  role: string;
  email: string;
  country: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      mediatorData: MediatorToken;
    }
  }
}

const mediatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const sessionData = jwt.verify(
      req.session.jwt,
      process.env.MEDIATOR_JWT_KEY!
    ) as MediatorToken;

    if (sessionData.role !== "MEDIATOR") {
      return next();
    }

    const scheme =  {
      ...sessionData,
      token: req.session.jwt
    }

    req.mediatorData = scheme;
  } catch (err) {
    _.error(err);
  }

  next();
};

export { mediatorMiddleware, MediatorToken };
