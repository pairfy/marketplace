import { SellerToken, UserToken } from "../middleware/agent.js";
import { database } from "../db/client.js";

const getNotifications = async (_: any, args: any, context: any) => {
  const USER: UserToken | null = context.userData;

  const SELLER: SellerToken | null = context.sellerData;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const query = `
     SELECT *
     FROM notifications
     WHERE owner = ?
     ORDER BY created_at ASC LIMIT ?
     `;

    let owner = null;

    if (USER) {
      owner = USER.pubkeyhash;
    }

    if (SELLER) {
      owner = SELLER.id;
    }

    const [notifications] = await connection.query(query, [owner, 50]);

    console.log(notifications);

    return notifications || [];
  } catch (err: any) {
    if (connection) {
      await connection.rollback();
    }

    throw new Error(err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

////////////////////////////////////////////////////////////////

const updateNotification = async (_: any, args: any, context: any) => {
  const USER: UserToken | null = context.userData;

  const SELLER: SellerToken | null = context.sellerData;

  const params = args.updateNotificationInput;

  console.log(params);

  let connection = null;

  try {
    connection = await database.client.getConnection();

    ///////////////////////////////////////////////////////////

    await connection.beginTransaction();

    const query = `
        UPDATE notifications
        SET seen = ?
        WHERE id = ? AND owner = ?
       `;

    let owner = null;

    if (USER) {
      owner = USER.pubkeyhash;
    }

    if (SELLER) {
      owner = SELLER.id;
    }

    const [result] = await connection.execute(query, [true, params.notification_id, owner]);

    if (result.affectedRows !== 1) {
      throw new Error("INTERNAL_ERROR");
    }

    await connection.commit();

    ///////////////////////////////////////////////////////////

    return { success: true };
  } catch (err: any) {
    if (connection) {
      await connection.rollback();
    }

    throw new Error(err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

////////////////////////////////////////////////////////////////

const notifications = {
  Query: {
    getNotifications,
  },
  Mutation: {
    updateNotification,
  },
};

export { notifications };
