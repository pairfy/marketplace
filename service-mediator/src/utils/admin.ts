import { Request, Response, NextFunction } from "express";
import { _ } from "./pino";
import jwt from "jsonwebtoken";

interface AdminToken {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      adminData: AdminToken;
    }
  }
}

const adminMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const sessionData = jwt.verify(
      req.session.jwt,
      process.env.ADMIN_JWT_KEY!
    ) as AdminToken;

    if (sessionData.role !== "ADMIN") {
      return next();
    }

    const scheme =  {
      ...sessionData,
      token: req.session.jwt
    }

    req.adminData = scheme;
  } catch (err) {
    _.error(err);
  }

  next();
};

export { adminMiddleWare, AdminToken };
