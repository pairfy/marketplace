import { Request, Response } from "express";
import DB from "../db";
import { adminMiddleWare } from "../utils/admin";
import { adminRequired } from "../utils/admin-required";
import { _ } from "../utils/pino";

const deleteMediatorMiddlewares: any = [adminMiddleWare, adminRequired];

const deleteMediatorHandler = async (req: Request, res: Response) => {
    let connection = null;
    let params = req.body;

    try {
        connection = await DB.client.getConnection();

        await connection.beginTransaction();

        const schemeData = 'DELETE FROM mediators WHERE id = ?';

        const schemeValue = [
            params.mediator_id,
        ];

        await connection.execute(schemeData, schemeValue);

        await connection.commit();

        res.status(200).send({ success: true });
    } catch (err) {
        await connection.rollback();

        _.error(err);

        res.status(404).send({ success: false });
    } finally {
        connection.release();
    }
};

export { deleteMediatorHandler, deleteMediatorMiddlewares };
