import { registerUser, loginUser, renewToken } from "../controllers/auth";
import Router from "express";
import {
  verifyRefreshJWT,
  verifyAccessJWT_And_Role,
} from "../middlewares/auth";

const authRouter = Router();

authRouter.route("/signup").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/refresh-token").post(verifyRefreshJWT, renewToken);

export default authRouter;
