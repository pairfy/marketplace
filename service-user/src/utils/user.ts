import { Request, Response, NextFunction } from "express";
import { _ } from "./pino";
import jwt from "jsonwebtoken";

interface UserToken {
  pubkeyhash: string;
  role: string;
  address: string;
  country: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      userData: UserToken;
    }
  }
}

const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const sessionData = jwt.verify(
      req.session.jwt,
      process.env.AGENT_JWT_KEY!
    ) as UserToken;

    if (sessionData.role !== "USER") {
      return next();
    }

    const scheme =  {
      ...sessionData,
      token: req.session.jwt
    }

    req.userData = scheme;
  } catch (err) {
    _.error(err);
  }

  next();
};

export { userMiddleware, UserToken };
