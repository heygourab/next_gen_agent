import process from "node:process";
import { tools } from "./src/tools/index.ts";
import { runMovieAgent } from "./src/movieAgent.ts";

const userMessage = process.argv[2];

if (!userMessage) {
  console.error("Please provide a message to send to the AI.");
  process.exit(1);
}


await runMovieAgent({ userMessage: userMessage, tools: [] });
