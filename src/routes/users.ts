import { registerUser, loginUser, renewToken } from "../controllers/auth";
import Router from "express";
import { verifyRefreshJWT } from "../middlewares/auth";

const userRouter = Router();

userRouter.route("/signup").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(verifyRefreshJWT, renewToken);

export default userRouter;
