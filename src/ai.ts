import OpenAI from "openai";
import process from "node:process";

export const aiClient = new OpenAI({
  project: process.env.COLLEGE_PROJECT_ID,
  apiKey: process.env.OPENAI_API_KEY_COLLEGE,
});
