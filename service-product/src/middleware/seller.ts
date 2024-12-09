import jwt from "jsonwebtoken";
import { logger } from "../utils/index.js";
import { Request, Response, NextFunction } from "express";


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

    logger.info(req.sellerData.id);

  } catch (err) {
    logger.error(err);
  }

  next();
};

export { sellerMiddleware, SellerToken };
