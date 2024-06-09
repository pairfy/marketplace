import jwt from "jsonwebtoken";

const createToken = (params: object) => {
  return jwt.sign(params, process.env.USER_JWT_KEY!, {
    expiresIn: process.env.TOKEN_EXPIRATION!,
  });
};

export { createToken };
