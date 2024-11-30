import { Index } from "@upstash/vector";
import process from "node:process";

if (!process.env.UPSTASH_URL) {
  console.error(`Upstash url is undefined`);
  process.exit(1);
}

if (!process.env.UPSTASH_KEY) {
  console.error(`Upstash key (token) is undefined`);
  process.exit(1);
}

export const index = new Index({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_KEY,
});
