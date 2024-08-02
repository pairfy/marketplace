import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { _ } from "./pino";

interface SellerToken {
  id: string;
  role: string;
  email: string;
  avatar: string;
  country: string;
  username: string;
}

interface UserToken {
  id: string;
  role: string;
  address: string;
  pubkeyhash: string;
  country: string;
  username: string;
}


declare global {
  namespace Express {
    interface Request {
      sellerData: SellerToken;
    }
  }
}

const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const role = socket.handshake.query.role as string;
  const token = socket.handshake.query.token as string;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  if (role === "SELLER") {
    jwt.verify(token, process.env.SELLER_JWT_KEY!, (err: any, decoded: any) => {
      if (err) {
        return next(new Error("Authentication error"));
      }

      if (decoded.role !== "SELLER") {
        return next(new Error("Authentication error"));
      }

      (socket as any).agent = decoded as SellerToken;

      next();
    });
  }

  if (role === "USER") {
    jwt.verify(token, process.env.USER_JWT_KEY!, (err: any, decoded: any) => {
      if (err) {
        return next(new Error("Authentication error"));
      }

      if (decoded.role !== "USER") {
        return next(new Error("Authentication error"));
      }

      (socket as any).agent = decoded as UserToken;

      next();
    });
  }

  if (role === "MEDIATOR") {
    next();
  }
};

export { authMiddleware, SellerToken };
