import express from "express";
import morgan from "morgan";
import { movieSearchAgent } from "./agents/search/movieSearchAgent.ts";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.get("/search", async (req: express.Request, res: express.Response) => {
  const response = await movieSearchAgent(req.body.search);
  let jsonRes;
  try {
    jsonRes = JSON.parse(response.replace("```", ""));
    console.log("JSON response:", jsonRes);
  } catch (error) {
    console.error("Error parsing JSON response:", error);
  }
  return res.json(jsonRes);
});
