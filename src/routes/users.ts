import { registerUser, loginUser } from "../controllers/users";
import Router from "express";

const userRouter = Router();

userRouter.route("/signup").post(registerUser);
userRouter.route("/login").post(loginUser);

export default userRouter;
