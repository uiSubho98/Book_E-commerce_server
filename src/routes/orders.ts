import { Router } from "express";
import {
  placeOrder,
  getSingleOrder,
  getAllOrders,
} from "../controllers/orders";
import { verifyAccessJWT_And_Role } from "../middlewares/auth";

const ordersRouter = Router();
const checkBuyer = verifyAccessJWT_And_Role("Buyer");
ordersRouter.route("/").post(checkBuyer, placeOrder);
ordersRouter.route("/").get(checkBuyer, getAllOrders);
ordersRouter.route("/:id").get(checkBuyer, getSingleOrder);

export default ordersRouter;
