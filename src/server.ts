import express from "express";
import morgan from "morgan";
import { handelRequest } from "./controller/searchHandler.ts";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.get("/search", handelRequest);
