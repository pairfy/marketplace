import { socketServer, sockets } from "..";
import DB from "../db";
import { sessionRedis } from "../db/session";

export const joinRoomHandler = async (payload: string, AGENT: any) => {
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
        sockets[AGENT.id].join(data.room);

        console.log("USER JOINED TO ROOM " + data.room);

        const messages = await sessionRedis.client.lRange(data.room, 0, -1);

        socketServer.to(data.room).emit(AGENT.id, messages);
      }
    } catch (err) {
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
        sockets[AGENT.id].join(data.room);

        console.log("BUYER JOINED TO ROOM " + data.room);

        const messages = await sessionRedis.client.lRange(data.room, 0, -1);

        socketServer.to(data.room).emit(AGENT.id, messages);
      }
    } catch (err) {
      await connection.rollback();
    } finally {
      connection.release();
    }
  }
};
