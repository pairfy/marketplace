import { Request, Response, NextFunction } from "express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.sellerData) {
    return res.status(401).json({ errors: ['AUTH_ERROR'] });
  }

  next();
};