import { socketServer } from "..";
import DB from "../db";
import { sessionRedis } from "../db/session";
import { _ } from "../utils/pino";

export const messageHandler = async (payload: string, AGENT: any) => {
  const data = JSON.parse(payload);

  if (AGENT.role === "SELLER") {
    let connection = null;

    try {
      connection = await DB.client.getConnection();

      const [orders] = await connection.execute(
        "SELECT seller_id FROM orders WHERE id = ?",
        [data.room]
      );

      if (orders.length === 0) {
        return;
      }

      const ORDER = orders[0];

      if (ORDER.seller_id === AGENT.id) {
        const scheme = {
          id: AGENT.id,
          role: AGENT.role,
          content: data.content,
          date: new Date()
        };

        const message = JSON.stringify(scheme);

        await sessionRedis.client.rPush(data.room, message);

        socketServer.to(data.room).emit("message", message);
      }
    } catch (err) {
      _.error(err);
      await connection.rollback();
    } finally {
      connection.release();
    }
  }

  if (AGENT.role === "USER") {
    let connection = null;

    try {
      connection = await DB.client.getConnection();

      const [orders] = await connection.execute(
        "SELECT buyer_pubkeyhash FROM orders WHERE id = ?",
        [data.room]
      );

      if (orders.length === 0) {
        return;
      }

      const ORDER = orders[0];

      if (ORDER.buyer_pubkeyhash === AGENT.pubkeyhash) {
        const scheme = {
          id: AGENT.id,
          role: AGENT.role,
          content: data.content,
          date: new Date()
        };

        const message = JSON.stringify(scheme);

        await sessionRedis.client.rPush(data.room, message);

        socketServer.to(data.room).emit("message", message);
      }
    } catch (err) {
      _.error(err);
      await connection.rollback();
    } finally {
      connection.release();
    }
  }
};
