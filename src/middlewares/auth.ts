import jwt, { Secret, GetPublicKeyOrSecret } from "jsonwebtoken";
import { RequestHandler } from "express";
import { ApiError } from "../utils/ApiError";

const verifyAccessJWT: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers["bearer"] as string;
    if (!token) {
      throw new ApiError(403, "Access Denied");
    }
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret | GetPublicKeyOrSecret
    ) as any;
    if (decoded) {
      req.body = { user: decoded, payload: req.body };
      next();
    }
  } catch (error) {
    throw new ApiError(403, "Invalid Token");
  }
};

const verifyRefreshJWT: RequestHandler = (req, res, next) => {
  try {
    const token = req.cookies.refreshToken as string;
    if (!token) {
      throw new ApiError(403, "Access Denied");
    }
    console.log({ token });
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as Secret | GetPublicKeyOrSecret
    ) as any;
    console.log({ decoded });
    if (decoded) {
      next();
    }
  } catch (error) {
    throw new ApiError(403, "Invalid Token");
  }
};

export { verifyAccessJWT, verifyRefreshJWT };
