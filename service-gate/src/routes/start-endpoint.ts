import DB from "../db";
import API from "../api";
import assert from "assert";
import { Request, Response } from "express";
import { requireAuth } from "../utils/required";
import { sellerMiddleware } from "../utils/seller";
import { BadRequestError } from "../errors";
import { sendEvent } from "./get-events";
import { sleep } from "../utils/sleep";

const ADA_LOVELACE: number = 1000000;

interface instanceScheme {
  startDefault: {
    sWalletParam: string;
    pPriceParam: number;
    sCollateralParam: number;
  };
}

const startEndpointMiddlewares: any = [sellerMiddleware, requireAuth];

const startEndpointHandler = async (req: Request, res: Response) => {
  const params = req.body;

  const SELLER = req.sellerData;

  let connection: any = null;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const [slots] = await connection.execute(
      "SELECT * FROM slots WHERE id = ? AND seller_id = ?",
      [params.slot_id, SELLER.id]
    );

    if (slots.length === 0) {
      throw new Error("NOT_SLOT");
    }

    const SLOT = slots[0];

    if (SLOT.actived) {
      throw new Error("IS_ACTIVED");
    }

    ////////////////////////////////////////////////////

    const instanceScheme: instanceScheme = {
      startDefault: {
        sWalletParam: params.seller_pubkeyhash,
        pPriceParam: SLOT.contract_price * ADA_LOVELACE,
        sCollateralParam: SLOT.contract_collateral * ADA_LOVELACE,
      },
    };

    console.log(instanceScheme);

    await API.post(
      `/api/contract/instance/${SLOT.contract_id}/endpoint/Start`,
      instanceScheme
    )
      .then((res) => assert.ok(res.status === 200))
      .catch(() => {
        throw new Error("CID_FAILED");
      });

    await sleep(1000);

    const contractStatus = await API.get(
      `/api/contract/instance/${SLOT.contract_id}/status`
    )
      .then((res) => {
        console.log(res.data);

        assert.ok(res.data.cicYieldedExportTxs.length !== 0);

        assert.ok(
          res.data.cicYieldedExportTxs[0].hasOwnProperty("transaction")
        );

        assert.ok(res.data.cicYieldedExportTxs[0].transaction.length !== 0);

        return res.data;
      })
      .catch(() => {
        throw new Error("CID_FAILED");
      });

    //////////////////////////////////////////////

    const schemeData = `
      UPDATE slots 
      SET actived = ?,
          seller_pubkeyhash = ?,
          contract_stage = ?,
          contract_status_0 = ?,
          contract_utx_0 = ?
      WHERE id = ? AND seller_id = ?
      `;

    const schemeValue = [
      true,
      params.seller_pubkeyhash,
      "actived",
      contractStatus,
      contractStatus.cicYieldedExportTxs[0].transaction,
      params.slot_id,
      SELLER.id,
    ];

    await connection.execute(schemeData, schemeValue);

    //////////////////////////////////////////////

    await connection.commit();

    res.status(200).send({
      success: true,
      payload: {
        transaction: contractStatus.cicYieldedExportTxs[0].transaction,
      },
    });

    sendEvent(SELLER.id, "slot:created");
  } catch (err: any) {
    await connection.rollback();

    throw new BadRequestError(err.message);
  } finally {
    connection.release();
  }
};

export { startEndpointMiddlewares, startEndpointHandler };
