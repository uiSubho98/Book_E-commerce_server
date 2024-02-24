import Router from "express";
import {
  registerBooks,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
} from "../controllers/books";
import { verifyAccessJWT, verifyAccessJWT_And_Role } from "../middlewares/auth";
const booksRouter = Router();
const checkSeller = verifyAccessJWT_And_Role("Seller");
booksRouter.route("/").post(checkSeller, registerBooks);
booksRouter.route("/").get(verifyAccessJWT, getAllBooks);
booksRouter.route("/:id").get(verifyAccessJWT, getBook);
booksRouter.route("/:id").patch(checkSeller, updateBook);
booksRouter.route("/:id").delete(checkSeller, deleteBook);

export default booksRouter;
