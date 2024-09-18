import * as route from "./routes";
import DB from "./db";
import { app } from "./app";
import { catcher, check, checkpoint } from "./pod/index";
import { errorMiddleware, NotFoundError } from "./errors";
import { redisDB } from "./db/redis";
import listenProducts from "./kafka/products";
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

    if (!process.env.USER_JWT_KEY) {
      throw new Error("USER_JWT_KEY error");
    }

    if (!process.env.TOKEN_EXPIRATION) {
      throw new Error("TOKEN_EXPIRATION error");
    }

    if (!process.env.REDIS_URI) {
      throw new Error("REDIS_URI error");
    }

    if (!process.env.SHIPPING_TIME) {
      throw new Error("SHIPPING_TIME error");
    }

    if (!process.env.LOCKING_TX_MS) {
      throw new Error("LOCKING_TX_MS error");
    }


    DB.connect({
      host: "mysql",
      port: 3306,
      user: "marketplace",
      password: "password",
      database: "service_gateway",
    });

    await redisDB
      .connect({
        url: process.env.REDIS_URI,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("redisDB connected"))
      .catch((err: any) => catcher(err));

    listenProducts();

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
      "/api/gateway/create-order",
      route.createOrderMiddlewares,
      route.createOrderHandler,
    );

    app.post(
      "/api/gateway/cancel",
      route.cancelMiddlewares,
      route.cancelHandler,
    );

    app.post(
      "/api/gateway/cancel-tx",
      route.cancelTxMiddlewares,
      route.cancelTxHandler,
    );

    app.post(
      "/api/gateway/deploy",
      route.deployMiddlewares,
      route.deployHandler,
    );

    app.post(
      "/api/gateway/deploy-tx",
      route.deployTxMiddlewares,
      route.deployTxHandler,
    );

    app.post(
      "/api/gateway/locking",
      route.lockingMiddlewares,
      route.lockingHandler,
    );

    app.post(
      "/api/gateway/locking-tx",
      route.lockingTxMiddlewares,
      route.lockingTxHandler,
    );

    app.post(
      "/api/gateway/return",
      route.returnMiddlewares,
      route.returnHandler,
    );

    app.post(
      "/api/gateway/return-tx",
      route.returnTxMiddlewares,
      route.returnTxHandler,
    );

    app.post(
      "/api/gateway/shipping",
      route.shippingMiddlewares,
      route.shippingHandler,
    );

    app.post(
      "/api/gateway/shipping-tx",
      route.shippingTxMiddlewares,
      route.shippingTxHandler,
    );

    app.get(
      "/api/gateway/get-orders",
      route.getOrdersMiddlewares,
      route.getOrdersHandler,
    );

    app.get(
      "/api/gateway/get-order/:id",
      route.getOrderMiddlewares,
      route.getOrderHandler,
    );

    app.get(
      "/api/gateway/buy-options/:id",
      route.buyOptionsMiddlewares,
      route.buyOptionsHandler,
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
