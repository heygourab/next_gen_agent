import process from "node:process";
import { movieSearchAgent } from "./src/agents/search/movieSearchAgent.ts";

const userMessage = process.argv[2];

if (!userMessage) {
  console.error("Please provide a message to send to the AI.");
  process.exit(1);
}

await movieSearchAgent(userMessage);

// await movieSearchAgent(userMessage);
