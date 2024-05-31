import jwt from "jsonwebtoken";

const createToken = (params: object) => {
  return jwt.sign(params, process.env.SELLER_JWT_KEY!, {
    expiresIn: process.env.TOKEN_EXPIRATION!,
  });
};

export { createToken };
