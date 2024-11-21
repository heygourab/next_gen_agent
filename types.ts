import OpenAI from "openai";

export type AImessage =
  | OpenAI.Chat.ChatCompletionMessageParam
  | {
      role: "user" | "assistant";
      content: string;
    }
  | {
      role: "tool";
      content: string;
      tool_call_id: string;
    };
