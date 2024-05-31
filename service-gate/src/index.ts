import * as route from "./routes";
import DB from "./db";
import { app } from "./app";
import { catcher, check, checkpoint } from "./pod/index";
import { NotFoundError, errorMiddleware } from "./errors";
import serviceProductListener from "./kafka/service-product";
import compression from "compression";

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

    if (!process.env.TOKEN_EXPIRATION) {
      throw new Error("TOKEN_EXPIRATION error");
    }

    DB.connect({
      host: "mysql",
      port: 3306,
      user: "marketplace",
      password: "password",
      database: "service_gate",
    });

    serviceProductListener();

    checkpoint("ready");

    const errorEvents: string[] = [
      "exit",
      "SIGINT",
      "SIGTERM",
      "SIGQUIT",
      "uncaughtException",
      "unhandledRejection",
    ];

    errorEvents.forEach((e: string) => process.on(e, (err) => catcher(err)));

    app.post(
      "/api/gate/create-slot",

      route.createSlotMiddlewares,

      route.createSlotHandler
    );

    app.post(
      "/api/gate/start-endpoint",

      route.startEndpointMiddlewares,

      route.startEndpointHandler
    );

    app.post(
      "/api/gate/locking-endpoint",

      route.lockingEndpointMiddlewares,

      route.lockingEndpointHandler
    );

    app.get(
      "/api/gate/get-slots",

      route.getSlotsMiddlewares,

      route.getSlotsHandler
    );

    app.get(
      "/api/gate/get-events",

      route.getEventsMiddlewares,

      route.getEventsHandler
    );

    app.all("*", (_req, _res) => {
      throw new NotFoundError();
    });

    app.use(errorMiddleware);

    app.use(compression());
  } catch (e) {
    catcher(e);
  }
  check();
};

main();
