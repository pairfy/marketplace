import * as route from "./routes";
import compression from "compression";
import DB from "./db";
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
      database: "service_product",
    });

    const { Kafka } = require("kafkajs");

    const kafka = new Kafka({
      clientId: "service-product",
      ssl: false,
      enforceRequestTimeout: false,
      brokers: [
        "streaming-kafka-bootstrap:9092",
        "streaming-kafka-bootstrap:9092",
        "streaming-kafka-bootstrap:9092",
      ],
    });

    const serviceUserListener = async () => {
      try {
        const consumer = kafka.consumer({ groupId: "service-product-group" });

        await consumer.connect();

        await consumer.subscribe({
          topic: "fullfillment.service_seller.seller",
          fromBeginning: true,
        });

        await consumer.run({
          eachMessage: async ({ topic, partition, message }: any) => {
            console.log({
              topic,
              partition,
              value: message.value.toString(),
            });
          },
        });
        
      } catch (err) {
        console.error(err);
      }
    };

    serviceUserListener();

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
      "/api/product/create-product",

      route.createProductMiddlewares,

      route.createProductHandler
    );

    app.get(
      "/api/product/get-events",

      route.getEventsMiddlewares,

      route.getEventsHandler
    );

    app.post(
      "/api/product/update-product",

      route.updateProductMiddlewares,

      route.updateProductHandler
    );

    app.get(
      "/api/product/get-products",

      route.getProductsMiddlewares,

      route.getProductsHandler
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
