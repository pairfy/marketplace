import { database } from "../../database/client.js";
import { logger } from "../../utils/index.js";

const CreateNotification = async (
  event: any,
  seq: number
): Promise<boolean> => {
  let response = null;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const [findProcessed] = await connection.execute(
      "SELECT id FROM processed WHERE id = ? AND processed = ?",
      [event.id, true]
    );

    if (findProcessed.length > 0) {
      return Promise.resolve(true);
    }

    const payload = JSON.parse(event.data);

    ////////////////////////////////////////////////////////

    await connection.beginTransaction();

    for (const item of payload) {
      const columns = Object.keys(item);

      const values = Object.values(item);

      const schemeData = `
        INSERT INTO notifications (${columns.join(", ")})
        VALUES (${columns.map(() => "?").join(", ")})
      `;

      await connection.execute(schemeData, values);
    }

    await connection.execute(
      "INSERT INTO processed (id, seq, type, processed) VALUES (?, ?, ?, ?)",
      [event.id, seq, event.type, true]
    );

    await connection.commit();
    
    ////////////////////////////////////////////////////////

    response = Promise.resolve(true);
  } catch (err: any) {
    logger.error(err);

    if (connection) {
      await connection.rollback();
    }

    response = Promise.resolve(false);
  } finally {
    if (connection) {
      await connection.release();
    }
  }

  return response;
};

const handlers: any = {
  CreateNotification,
};

export const processEvent = (message: any) => {
  const messageDecoded = new TextDecoder().decode(message.data);

  const event = JSON.parse(messageDecoded);

  console.log(message.seq, event.id, event.type);

  return handlers[event.type](event, message.seq);
};
