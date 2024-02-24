import {
  registerUser,
  loginUser,
  renewToken,
  logOutUser,
} from "../controllers/auth";
import Router from "express";
import { verifyRefreshJWT, verifyAccessJWT } from "../middlewares/auth";

const authRouter = Router();

authRouter.route("/signup").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/refresh-token").post(verifyRefreshJWT, renewToken);
authRouter.route("/logout/:id").post(verifyAccessJWT, logOutUser);

export default authRouter;
