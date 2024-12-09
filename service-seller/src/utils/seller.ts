import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { _ } from "./pino";


interface SellerToken {
  id: string;
  role: string;
  email: string;
  avatar: string;
  address: string;
  country: string;
  username: string;
  pubkeyhash: string;
}

declare global {
  namespace Express {
    interface Request {
      sellerData: SellerToken;
    }
  }
}

const sellerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const sessionData = jwt.verify(
      req.session.jwt,
      process.env.AGENT_JWT_KEY!
    ) as SellerToken;

    if (sessionData.role !== "SELLER") {
      return next();
    }

    const scheme =  {
      ...sessionData,
      token: req.session.jwt
    }

    req.sellerData = scheme;
  } catch (err) {
    _.error(err);
  }

  next();
};

export { sellerMiddleware, SellerToken };
