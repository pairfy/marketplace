import { Request, Response } from "express";
import { sellerMiddleware } from "../utils/seller";

const currentSellerMiddlewares: any = [sellerMiddleware];

const currentSellerHandler = async (req: Request, res: Response) => {
  res.send({ sellerData: req.sellerData || null });
};

export { currentSellerMiddlewares, currentSellerHandler };
