import { Router } from "express";
import { placeOrder } from "../controllers/orders";
import { verifyAccessJWT_And_Role } from "../middlewares/auth";

const ordersRouter = Router();
const checkBuyer = verifyAccessJWT_And_Role("Buyer");
ordersRouter.route("/").post(checkBuyer, placeOrder);

export default ordersRouter;
