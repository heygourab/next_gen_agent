import express from "express";
import morgan from "morgan";
import { handelRequest } from "./controller/searchHandler.ts";
import cors from "cors";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.post("/search", handelRequest);
