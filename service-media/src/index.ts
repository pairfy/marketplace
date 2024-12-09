import compression from "compression";
import DB from "./db";
import * as route from "./routes";
import { catcher, check, checkpoint } from "./pod/index";
import { NotFoundError, errorMiddleware } from "./errors";
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
      database: "service_media",
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
      "/api/media/create-image",

      route.createImageMiddlewares,

      route.createImageHandler
    );

    app.get(
      "/api/media/get-image/:mediaId",

      route.getImageMiddlewares,

      route.getImageHandler
    );

    app.post(
      "/api/media/delete-image",

      route.deleteImageMiddlewares,

      route.deleteImageHandler
    );

    app.get('/api/media/healthcheck', (req, res) => {
      res.status(200).json({ status: 'UP', message: 'Test OK' });
    });

    app.all("*", (_req, _res) => {
      throw new NotFoundError();
    });

    app.use(errorMiddleware as any);

    app.use(compression());
  } catch (e) {
    catcher(e);
  }
  check();
};

main();
