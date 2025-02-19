import crypto from "crypto";
import { AGENT, SellerToken, UserToken } from "../middleware/agent.js";
import { getMessageId } from "../utils/index.js";

const getMessages = async (_: any, args: any, context: any) => {
  try {
    const params = args.getMessagesInput;

    const SESSION = params.session.split(":");

    const seenKey = `chat:seen:${SESSION[0]}`;

    let chatKey = "";

    let ownerId = "";

    if (context.userData) {
      chatKey = `chat:${SESSION[0]}:${context.userData.pubkeyhash}:${SESSION[2]}`;
      ownerId = context.userData.pubkeyhash;
    }

    if (context.sellerData) {
      chatKey = `chat:${SESSION[0]}:${SESSION[1]}:${context.sellerData.id}`;
      ownerId = context.sellerData.id;
    }

    const getMessages = await context.redisClient.zRange(chatKey, 0, -1);

    const messages = getMessages.map(JSON.parse);

    const partyMessages = messages.filter(
      (message: any) => message.agent !== ownerId
    );

    for (const item of partyMessages) {
      await context.redisClient.HSETNX(seenKey, item.id, "true");
    }

    const seen = await context.redisClient.HGETALL(seenKey);

    return {
      messages,
      seen: JSON.stringify({ ...seen }),
    };
  } catch (err: any) {
    throw new Error(err.message);
  }
};
const updateMessage = async (_: any, args: any, context: any) => {
  try {
    console.log("body");

    return crypto.randomBytes(16).toString("hex");
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const createMessage = async (_: any, args: any, context: any) => {
  try {
    const params = args.createMessageInput;

    const SESSION = params.session.split(":");

    let chatKey = "";

    let channelKey = "";

    let message = {
      id: getMessageId(),
      agent: "",
      role: "",
      content: params.content,
      seen: false,
      created_at: Date.now(),
    };

    if (context.userData) {
      message.agent = context.userData.pubkeyhash;
      message.role = "buyer";
      chatKey = `chat:${SESSION[0]}:${message.agent}:${SESSION[2]}`;
      channelKey = `chat:channel:${SESSION[0]}:${message.agent}:${SESSION[2]}`;
    }

    if (context.sellerData) {
      message.agent = context.sellerData.id;
      message.role = "seller";
      chatKey = `chat:${SESSION[0]}:${SESSION[1]}:${message.agent}`;
      channelKey = `chat:channel:${SESSION[0]}:${SESSION[1]}:${message.agent}`;
    }

    await context.redisClient.zAdd(chatKey, {
      score: Date.now(),
      value: JSON.stringify(message),
    });

    console.log(message);

    await context.pubsub.publish(channelKey, { newMessages: message });

    return {
      success: true,
    };
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const newMessages = {
  subscribe: (_: any, args: any, context: any) => {
    try {
      const SESSION = args.session.split(":");

      const AGENT = context.agentData as AGENT;

      let channel = "";

      if (AGENT.role === "USER") {
        channel = `chat:channel:${SESSION[0]}:${AGENT.userData?.pubkeyhash}:${SESSION[2]}`;
      }

      if (AGENT.role === "SELLER") {
        channel = `chat:channel:${SESSION[0]}:${SESSION[1]}:${AGENT.sellerData?.id}`;
      }

      return context.pubsub.asyncIterator(channel);
    } catch (error) {
      console.error("Subscription error", error);
      throw new Error("Subscription error");
    }
  },
};

const messages = {
  Query: {
    getMessages,
  },
  Mutation: {
    createMessage,
    updateMessage,
  },
  Subscription: {
    newMessages,
  },
};

export { messages };
