import { Request, Response, NextFunction } from "express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const isAgent = (req.sellerData || req.userData);

  if (!isAgent) {
    return res.status(401).json({ errors: ["AUTH_ERROR"] });
  }

  next();
};
