import jwt, { Secret, GetPublicKeyOrSecret } from "jsonwebtoken";
import { RequestHandler } from "express";
import { ApiError } from "../utils/ApiError";
import { jwtDecode } from "jwt-decode";
interface IDecode {
  _id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

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

const verifyAccessJWT_And_Role: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers["bearer"] as string;
    if (!token) {
      throw new ApiError(403, "Access Denied");
    }

    // console.log({ token });

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret | GetPublicKeyOrSecret
    ) as any;

    // console.log({ decoded });

    if (decoded.role !== "Admin") {
      console.log("Access Denied");
      throw new ApiError(403, "Access Denied");
    }

    // If the control reaches here, it means the token is valid and the role is "Admin"
    req.body = { user: decoded, payload: req.body };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(403, "Invalid Token");
    } else {
      console.log("Unhandled error:", error);
      throw new ApiError(403, "Access Denied");
    }
  }
};

export { verifyAccessJWT, verifyRefreshJWT, verifyAccessJWT_And_Role };
