import OpenAI from "openai";
import { aiClient } from "./ai.ts";
import type { AImessage } from "../types.ts";
import { zodFunction } from "openai/helpers/zod";
import { defaultSystemPrompt } from "./systemPrompt.ts";

interface runLLM {
  messages: AImessage[];
  temperature?: number;
  model?: OpenAI.Chat.ChatModel;
  tools: any[];
  isParallel_tool_calls?: boolean;
  systemPrompt?: string;
}

export const runLLM = async ({
  messages,
  temperature = 0.1,
  tools,
  model = "gpt-4o-mini-2024-07-18",
  isParallel_tool_calls,
  systemPrompt,
}: runLLM) => {
  const formattedTools = tools.map(zodFunction);
  const response = await aiClient.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: systemPrompt ?? defaultSystemPrompt,
      },
      ...messages,
    ],
    temperature: temperature,
    ...(formattedTools.length > 0 && {
      tools: formattedTools,
      tool_choice: "auto",
      parallel_tool_calls: isParallel_tool_calls,
    }),
  });

  return response.choices[0];
};
