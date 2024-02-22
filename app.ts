import express, { Application, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.static("public"));

app.use(cookieParser());

export default app;
