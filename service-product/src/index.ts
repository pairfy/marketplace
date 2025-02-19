import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieSession from "cookie-session";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { catcher, logger } from './utils/index.js';
import { database } from './database/client.js';
import { typeDefs } from './graphql/types.js';
import { products } from './graphql/resolvers.js';
import { sellerMiddleware } from './middleware/seller.js';
import { requireAuth } from './middleware/required.js';

const app = express();

const httpServer = http.createServer(app);

const resolvers = {
    Query: {
        ...products.Query
    },
    Mutation: {
        ...products.Mutation
    }
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
            code: 'INTERNAL_SERVER_ERROR',
        }
    }
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

        if (!process.env.SELLER_JWT_KEY) {
            throw new Error("SELLER_JWT_KEY error");
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

        const sessionOptions: object = {
            maxAge: 168 * 60 * 60 * 1000,
            signed: false,
            secure: true,
            httpOnly: true,
            sameSite: "strict",
        };

        const corsOrigin = process.env.CORS_DOMAINS;

        const corsOptions = {
            origin: corsOrigin.split(",") || "*",
            credentials: true,
            maxAge: 86400,
            preflightContinue: false,
            exposedHeaders: ["Set-Cookie", "Cookie"],
            optionsSuccessStatus: 204,
        };

        const errorEvents: string[] = [
            "exit",
            "SIGINT",
            "SIGTERM",
            "SIGQUIT",
            "uncaughtException",
            "unhandledRejection",
            "SIGHUP",
            "SIGCONT"
        ];

        errorEvents.forEach((e: string) => process.on(e, (err) => catcher(err)));

        app.options('*', cors(corsOptions));

        database.connect({
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT) || 3306,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        });

        app.use(cookieSession(sessionOptions));

        app.use(sellerMiddleware);

        app.use(requireAuth);

        await server.start();

        app.use(
            "/api/product/graphql",
            cors<cors.CorsRequest>(corsOptions),
            express.json(),
            expressMiddleware(server, {
                context: async ({ req }) => ({ sellerData: req.sellerData }),
            })
        );

        await new Promise<void>((resolve) =>
            httpServer.listen({ port: 4000 }, resolve)
        );

        logger.info("ONLINE");

    } catch (err) {
        catcher(err)
    }

};

main();




