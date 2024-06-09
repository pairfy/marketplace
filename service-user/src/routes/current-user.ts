import { Request, Response } from "express";
import { userMiddleware } from "../utils/user";

const currentUserMiddlewares: any = [userMiddleware];

const currentUserHandler = async (req: Request, res: Response) => {
  res.send({ userData: req.userData || null });
};

export { currentUserMiddlewares, currentUserHandler };
