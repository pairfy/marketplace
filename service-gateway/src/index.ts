import express from "express";
import http from "http";
import cors from "cors";
import cookieSession from "cookie-session";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { catcher, errorEvents, logger } from "./utils/index.js";
import { database } from "./database/client.js";
import { typeDefs } from "./graphql/types.js";
import { books, orders } from "./graphql/resolvers.js";
import { agentMiddleware } from "./middleware/agent.js";
import { requireAuth } from "./middleware/required.js";
import { redisClient } from "./database/redis.js";

const app = express();

const httpServer = http.createServer(app);

const resolvers = {
  Query: {
    ...books.Query,
    ...orders.Query
  },
  Mutation: {
    ...books.Mutation,
    ...orders.Mutation,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  formatError: (error) => {
    logger.error(error);

    return {
      message: error.message,
      details: error.message,
      code: "INTERNAL_SERVER_ERROR",
    };
  },
});

const main = async () => {
  try {
    if (!process.env.POD_TIMEOUT) {
      throw new Error("POD_TIMEOUT error");
    }

    if (!process.env.EXPRESS_PORT) {
      throw new Error("EXPRESS_PORT error");
    }

    if (!process.env.EXPRESS_TIMEOUT) {
      throw new Error("EXPRESS_TIMEOUT error");
    }

    if (!process.env.CORS_DOMAINS) {
      throw new Error("CORS_DOMAINS error");
    }

    if (!process.env.AGENT_JWT_KEY) {
      throw new Error("AGENT_JWT_KEY error");
    }

    if (!process.env.DATABASE_HOST) {
      throw new Error("DATABASE_HOST error");
    }

    if (!process.env.DATABASE_PORT) {
      throw new Error("DATABASE_PORT error");
    }

    if (!process.env.DATABASE_USER) {
      throw new Error("DATABASE_USER error");
    }

    if (!process.env.DATABASE_PASSWORD) {
      throw new Error("DATABASE_PASSWORD error");
    }

    if (!process.env.DATABASE_NAME) {
      throw new Error("DATABASE_NAME error");
    }

    if (!process.env.REDIS_HOST) {
      throw new Error("REDIS_HOST error");
    }

    if (!process.env.TX_VALID_TIME) {
      throw new Error("TX_VALID_TIME error");
    }

    if (!process.env.TX_WATCH_WINDOW) {
      throw new Error("TX_WATCH_WINDOW error");
    }

    if (!process.env.PENDING_RANGE) {
      throw new Error("PENDING_RANGE error");
    }

    if (!process.env.SHIPPING_RANGE) {
      throw new Error("SHIPPING_RANGE error");
    }

    if (!process.env.APPEAL_RANGE) {
      throw new Error("APPEAL_RANGE error");
    }

    if(!process.env.EXPIRING_RANGE){
      throw new Error("EXPIRING_RANGE error");
    }
    
    if(!process.env.DELIVERY_RANGE){
      throw new Error("DELIVERY_RANGE error");
    }

    if (!process.env.PROJECT_ID) {
      throw new Error("PROJECT_ID error");
    }

    if (!process.env.KUPO_KEY) {
      throw new Error("KUPO_KEY error");
    }
    
    if (!process.env.OGMIOS_KEY) {
      throw new Error("OGMIOS_KEY error");
    }

    if (!process.env.RSA_PRIVATE_KEY) {
      throw new Error("RSA_PRIVATE_KEY error");
    }

    if (!process.env.RSA_PUBLIC_KEY) {
      throw new Error("RSA_PUBLIC_KEY error");
    }

    if (!process.env.AES_PASSPHRASE) {
      throw new Error("AES_PASSPHRASE error");
    }

    if (!process.env.RSA_PASSPHRASE) {
      throw new Error("RSA_PASSPHRASE error");
    }

    if (!process.env.FEE_PERCENT) {
      throw new Error("FEE_PERCENT error");
    }

    if (!process.env.NETWORK_ENV) {
      throw new Error("NETWORK_ENV error");
    }

    if (!process.env.ELASTIC_NODE) {
      throw new Error("ELASTIC_NODE error");
    }

    if (!process.env.ELASTIC_KEY) {
      throw new Error("ELASTIC_KEY error");
    }
    
    const sessionOptions: object = {
      maxAge: 168 * 60 * 60 * 1000,
      signed: false,
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    };

    const corsOptions = {
      origin: process.env.CORS_DOMAINS.split(",") || "*",
      credentials: true,
      maxAge: 86400,
      preflightContinue: false,
      exposedHeaders: ["Set-Cookie", "Cookie"],
      optionsSuccessStatus: 204,
    };


    errorEvents.forEach((e: string) => process.on(e, (err) => catcher(err)));

    ////////////////////////////////////////////////////////////////////

    await redisClient
      .connect({
        url: process.env.REDIS_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("redisClient connected"))
      .catch((err: any) => catcher(err));

    const redisCheck = setInterval(async () => {
      try {
        await redisClient.client.ping();
        console.log("Redis Online");
      } catch (err) {
        console.error("REDIS_CONNECTION", err);
        clearInterval(redisCheck);
      }
    }, 10_000);

    database.connect({
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT) || 3306,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    /////////////////////////////////////////////////////////////////////

    app.options("*", cors(corsOptions));

    app.use(cookieSession(sessionOptions));

    app.use(agentMiddleware);

    app.use(requireAuth);

    await server.start();

    app.use(
      "/api/gateway/graphql",
      cors<cors.CorsRequest>(corsOptions),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({
          sellerData: req.sellerData || null,
          userData: req.userData || null
        }),
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );

    logger.info("ONLINE");
  } catch (err) {
    catcher(err);
  }
};

main();
