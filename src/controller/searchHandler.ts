import express from "express";
import { movieSearchAgent } from "../agents/search/movieSearchAgent.ts";

export const handelRequest = async (
  req: express.Request,
  res: express.Response
) => {
  let response = await movieSearchAgent(req.body.search);

  if (response.includes("```")) {
    response = response.replace("```", "");
  }

  if (response.toLowerCase() === "no direct match found") {
    res.json({ title: null });
  }

  res.json({ title: response });
};
