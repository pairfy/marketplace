import DB from "../db";
import kafka from "./client";
import { _ } from "../utils/pino";
import { stringToTimestamp } from "../utils/other";

const TOPIC_NAME = "fullfillment.service_gate.slots";
const CONSUMER_GROUP = "service-session-group";

const listenSlots = async () => {
  const consumer = kafka.consumer({ groupId: CONSUMER_GROUP });

  await consumer
    .connect()
    .then(async () => {
      await consumer.subscribe({
        topic: TOPIC_NAME,
        fromBeginning: true,
      });

      _.info("TOPIC " + TOPIC_NAME);
    })
    .then(() =>
      consumer.run({
        eachMessage: async ({ topic, partition, message }: any) => {
          if (!message.value) return;

          const payload = JSON.parse(message.value.toString()).payload;

          console.log(payload);

          if (payload.op === "c") {
            await handleCreate(payload, consumer, {
              topic,
              partition,
              message,
            });
          }

          if (payload.op === "u") {
            await handleUpdate(payload, consumer, {
              topic,
              partition,
              message,
            });
          }

          if (payload.op === "d") {
            await handleDelete(payload, consumer, {
              topic,
              partition,
              message,
            });
          }
        },
      })
    )
    .catch((err: any) => _.error(err));
};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

const handleCreate = async (
  data: any,
  consumer: any,
  { topic, partition, message }: any
) => {
  const payload = data.after;

  payload.created_at = stringToTimestamp(payload.created_at);
  payload.schema_t = stringToTimestamp(payload.schema_t);

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const schemeData = `
    INSERT INTO slots (
      id,
      mode,
      status,
      actived,
      seller_id,
      seller_pubkeyhash,
      buyer_id,
      buyer_pubkeyhash,
      contract_id,
      contract_wid, 
      contract_units, 
      contract_price,
      contract_collateral,
      contract_discount, 
      contract_stage, 
      contract_0_utx, 
      contract_1_utx, 
      contract_2_utx, 
      contract_3_utx,
      contract_0_tx, 
      contract_1_tx, 
      contract_2_tx, 
      contract_3_tx,   
      product_id,
      created_at, 
      schema_t, 
      schema_v
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const schemeValue = Object.values(payload);

    const [rows] = await connection.execute(
      "SELECT * FROM slots WHERE id = ?",
      [payload.id]
    );

    if (rows.length !== 0) {
      throw new Error("DUPLICATION");
    }

    const [created] = await connection.execute(schemeData, schemeValue);

    if (created.affectedRows === 0) {
      throw new Error("NO_AFFECTED");
    }

    await connection.commit();

    await consumer.commitOffsets([
      { topic, partition, offset: message.offset + 1 },
    ]);
  } catch (err) {
    await connection.rollback();
    _.error(err);
  } finally {
    connection.release();
  }
};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

const handleUpdate = async (
  data: any,
  consumer: any,
  { topic, partition, message }: any
) => {
  const payload = data.after;

  payload.created_at = stringToTimestamp(payload.created_at);
  payload.schema_t = stringToTimestamp(payload.schema_t);

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const schemeData = `
    UPDATE slots
    SET id = ?,
        mode = ?,
        status = ?,
        actived = ?,
        seller_id = ?,
        seller_pubkeyhash = ?,
        buyer_id = ?,
        buyer_pubkeyhash = ?,
        contract_id = ?,
        contract_wid = ?, 
        contract_units = ?, 
        contract_price = ?,
        contract_collateral = ?,
        contract_discount = ?, 
        contract_stage = ?, 
        contract_0_utx = ?, 
        contract_1_utx = ?, 
        contract_2_utx = ?, 
        contract_3_utx = ?,
        contract_0_tx = ?, 
        contract_1_tx = ?, 
        contract_2_tx = ?, 
        contract_3_tx = ?,   
        product_id = ?,
        created_at = ?, 
        schema_t = ?, 
        schema_v = ?
    WHERE id = ? AND schema_v = ?`;

    const schemeValue = [
      ...Object.values(payload),
      payload.id,
      payload.schema_v - 1,
    ];

    const [updated] = await connection.execute(schemeData, schemeValue);

    if (updated.affectedRows === 0) {
      throw new Error("NO_AFFECTED");
    }

    await connection.commit();

    await consumer.commitOffsets([
      { topic, partition, offset: message.offset + 1 },
    ]);
  } catch (err) {
    await connection.rollback();

    _.error(err);
  } finally {
    connection.release();
  }
};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

const handleDelete = async (
  data: any,
  consumer: any,
  { topic, partition, message }: any
) => {
  const payload = data.before;

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    await connection.beginTransaction();

    const [deleted] = await connection.execute(
      "DELETE FROM slots WHERE id = ? AND schema_v = ?",
      [payload.id, payload.schema_v]
    );

    if (deleted.affectedRows === 0) {
      throw new Error("NO_AFFECTED");
    }

    await connection.commit();

    await consumer.commitOffsets([
      { topic, partition, offset: message.offset + 1 },
    ]);
  } catch (err) {
    await connection.rollback();
    _.error(err);
  } finally {
    connection.release();
  }
};

export default listenSlots;
