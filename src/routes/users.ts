import { getUser, getAllUsers, deleteUser } from "../controllers/users";
import Router from "express";
import { verifyAccessJWT_And_Role } from "../middlewares/auth";

const userRouter = Router();

userRouter.route("/:id").get(verifyAccessJWT_And_Role, getUser);
userRouter.route("/").get(verifyAccessJWT_And_Role, getAllUsers);
userRouter.route("/:id").post(verifyAccessJWT_And_Role, deleteUser);

export default userRouter;
