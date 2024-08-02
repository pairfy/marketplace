import { Request, Response } from "express";
import { mediatorMiddleware } from "../utils/mediator";

const currentMediatorMiddlewares: any = [mediatorMiddleware];

const currentMediatorHandler = async (req: Request, res: Response) => {
  res.send({ mediatorData: req.mediatorData || null });
};

export { currentMediatorMiddlewares, currentMediatorHandler };
