import { Request, Response, NextFunction } from "express";
import { _ } from "./pino";
import jwt from "jsonwebtoken";

interface SellerToken {
  id: string;
  role: string;
  email: string;
  avatar: string;
  country: string;
  username: string;
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
      process.env.SELLER_JWT_KEY!
    ) as SellerToken;

    if (sessionData.role !== "SELLER") {
      return next();
    }

    req.sellerData = sessionData;
  } catch (err) {
    _.error(err);
  }

  next();
};

export { sellerMiddleware, SellerToken };
