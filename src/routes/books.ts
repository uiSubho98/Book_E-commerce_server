import Router from "express";
import { registerBooks } from "../controllers/books";
import { verifyAccessJWT, verifyAccessJWT_And_Role } from "../middlewares/auth";
const booksRouter = Router();
const checkSeller = verifyAccessJWT_And_Role("Seller");
booksRouter.route("/").post(checkSeller, registerBooks);

export default booksRouter;
