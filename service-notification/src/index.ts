import express from "express";
import http from "http";
import cors from "cors";
import cookieSession from "cookie-session";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { catcher, errorEvents, logger } from "./utils/index.js";
import { database } from "./db/client.js";
import { typeDefs } from "./graphql/types.js";
import { agentMiddleware } from "./middleware/agent.js";
import { requireAuth } from "./middleware/required.js";
import { redisClient } from "./db/redis.js";
import { notifications } from "./graphql/resolvers.js";

const app = express();

const httpServer = http.createServer(app);

const resolvers = {
  Query: {
    ...notifications.Query,
  },
  Mutation: {
    ...notifications.Mutation,
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

    if (!process.env.MAIL_API_KEY) {
      throw new Error("MAIL_API_KEY error");
    }

    if (!process.env.TELEGRAM_API_KEY) {
      throw new Error("TELEGRAM_API_KEY error");
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
    }, 60_000);

    ////////////////////////////////////////////////////////////////////

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
      "/api/notification/graphql",
      cors<cors.CorsRequest>(corsOptions),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({
          sellerData: req.sellerData || null,
          userData: req.userData || null,
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
