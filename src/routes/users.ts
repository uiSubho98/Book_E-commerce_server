import { getUser, getAllUsers, deleteUser } from "../controllers/users";
import Router from "express";
import { verifyAccessJWT_And_Role } from "../middlewares/auth";

const userRouter = Router();
const checkAdmin = verifyAccessJWT_And_Role("Admin");

userRouter.route("/:id").get(checkAdmin, getUser);
userRouter.route("/").get(checkAdmin, getAllUsers);
userRouter.route("/:id").post(checkAdmin, deleteUser);

export default userRouter;
