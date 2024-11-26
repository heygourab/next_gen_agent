import OpenAI from "openai";
import process from "node:process";

export const aiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_COLLEGE,
});
