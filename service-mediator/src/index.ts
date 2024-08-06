import compression from "compression";
import DB from "./db";
import * as route from "./routes";
import { catcher, check, checkpoint } from "./pod/index";
import { errorMiddleware, NotFoundError } from "./errors";
import { app } from "./app";

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

    if (!process.env.MEDIATOR_JWT_KEY) {
      throw new Error("MEDIATOR_JWT_KEY error");
    }

    if (!process.env.ADMIN_JWT_KEY) {
      throw new Error("ADMIN_JWT_KEY error");
    }

    if (!process.env.TOKEN_EXPIRATION) {
      throw new Error("TOKEN_EXPIRATION error");
    }

    DB.connect({
      host: "mysql",
      port: 3306,
      user: "marketplace",
      password: "password",
      database: "service_mediator",
    });

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
      "/api/mediator/create-mediator",
      route.createMediatorMiddlewares,
      route.createMediatorHandler,
    );

    app.post(
      "/api/mediator/delete-mediator",
      route.deleteMediatorMiddlewares,
      route.deleteMediatorHandler,
    );

    app.post(
      "/api/mediator/login-mediator",
      route.loginMediatorMiddlewares,
      route.loginMediatorHandler,
    );

    app.get(
      "/api/mediator/current-mediator",
      route.currentMediatorMiddlewares,
      route.currentMediatorHandler,
    );

    app.get(
      "/api/mediator/logout",
      route.logoutHandler,
    );

    app.get("/api/mediator/healthcheck", (req, res) => {
      res.status(200).send("Test OK");
    });

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
