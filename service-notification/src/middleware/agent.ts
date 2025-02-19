import jwt from "jsonwebtoken";
import { logger } from "../utils/index.js";
import { Request, Response, NextFunction } from "express";

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

const agentMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const sessionData = jwt.verify(
      req.session.jwt,
      process.env.AGENT_JWT_KEY!
    ) as any;

    if (sessionData.role === "SELLER") {
      req.sellerData = {
        ...sessionData,
        token: req.session.jwt,
      };

      return next();
    }

    if (sessionData.role === "USER") {
      req.userData = {
        ...sessionData,
        token: req.session.jwt,
      };
      return next();
    }
  } catch (err) {
    logger.error(err);
  }

  next();
};

export { agentMiddleware, SellerToken, UserToken };
