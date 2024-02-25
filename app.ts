import express, { Application, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { BASE_URL } from "./src/constant";
import authRouter from "./src/routes/auth";
import userRouter from "./src/routes/users";
import booksRouter from "./src/routes/books";
import ordersRouter from "./src/routes/orders";

const app: Application = express();
const port = 3000;
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(`${BASE_URL}/auth`, authRouter);
app.use(`${BASE_URL}/users`, userRouter);
app.use(`${BASE_URL}/books`, booksRouter);
app.use(`${BASE_URL}/orders`, ordersRouter);

export default app;
