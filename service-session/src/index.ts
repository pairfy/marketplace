import DB from "./db";
import listenSlots from "./kafka/slots";
import compression from "compression";
import express from "express";
import http from "http";
import { NotFoundError, errorMiddleware } from "./errors";
import { Server } from "socket.io";
import { authMiddleware } from "./utils/auth";
import { joinRoomHandler } from "./handlers/join-room";
import { _ } from "./utils/pino";
import { messageHandler } from "./handlers/message";
import { sessionRedis } from "./db/session";

const catcher = (message?: any, error?: any, bypass?: boolean) => {
  _.error(`EXIT=>${message}-${error}`);

  return bypass || process.exit(1);
};

const app = express();

app.set("trust proxy", 1);

const server = http.createServer(app);

export const socketServer = new Server(server, {
  cors: {
    origin: process.env.CORS_DOMAINS!.split(","),
    methods: ["GET", "POST"],
    credentials: true,
    maxAge: 86400,
    preflightContinue: false,
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 204,
  },
});

export const sockets: any = {};

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

    if (!process.env.SELLER_JWT_KEY) {
      throw new Error("SELLER_JWT_KEY error");
    }

    if (!process.env.USER_JWT_KEY) {
      throw new Error("USER_JWT_KEY error");
    }

    if (!process.env.TOKEN_EXPIRATION) {
      throw new Error("TOKEN_EXPIRATION error");
    }

    if (!process.env.SESSION_REDIS) {
      throw new Error("SESSION_REDIS error");
    }

    app.use(express.json());

    const errorEvents: string[] = [
      "exit",
      "SIGINT",
      "SIGTERM",
      "SIGQUIT",
      "uncaughtException",
      "unhandledRejection",
    ];

    errorEvents.forEach((e: string) => process.on(e, (err) => catcher(err)));

    DB.connect({
      host: "mysql",
      port: 3306,
      user: "marketplace",
      password: "password",
      database: "service_session",
    });

    await sessionRedis
      .connect({
        url: process.env.SESSION_REDIS,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("sessionRedis connected"))
      .catch((err: any) => catcher(err));

    listenSlots();

    socketServer.use(authMiddleware);

    //////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////
    const socketConnectionHandler = (socket: any) => {
      const AGENT: any = socket.agent;

      console.log("AGENT CONNECTED" + AGENT.id);

      sockets[AGENT.id] = socket;

      sockets[AGENT.id].on("joinRoom", (payload: string) =>
        joinRoomHandler(payload, AGENT)
      );

      sockets[AGENT.id].on("message", (payload: string) =>
        messageHandler(payload, AGENT)
      );

      sockets[AGENT.id].on("disconnect", () => {
        console.log("User disconnected");
      });
    };

    socketServer.on("connection", socketConnectionHandler);

    app.get("/api/session/healthcheck", (req, res) => {
      res.status(200).json({ status: "Test OK" });
    });

    app.all("*", (_req, _res) => {
      throw new NotFoundError();
    });

    app.use(errorMiddleware);

    app.use(compression());

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

main();
