import type { AImessage } from "../../../types.ts";
import { runLLM } from "../../llm.ts";
import { toolRunner } from "../../toolRunner.ts";
import { movieSearchDescription } from "../../tools/movieSearchTool.ts";
import { searchSystemPrompt } from "./movieSearchSystemPrompt.ts";

export const movieSearchAgent = async (userSearch: string) => {
  const history: AImessage[] = [{ role: "user", content: userSearch }];
  const MAX_RETRIES = 5; // Define a maximum retry count
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    console.log(history);
    try {
      // Interact with the language model
      const response = await runLLM({
        messages: history,
        tools: [movieSearchDescription],
        model: "gpt-4o-mini-2024-07-18",
        systemPrompt: searchSystemPrompt,
        maxToken: 400,
      });

      // Add the model's response to the history
      history.push(response.message);

      // If the model provides a direct answer, return it
      if (response.message.content) {
        console.log("Final Response:", response.message.content);
        return response.message.content;
      }

      // If the model requests a tool call, process it
      if (
        Array.isArray(response.message.tool_calls) &&
        response.message.tool_calls.length > 0
      ) {
        const toolCall = response.message.tool_calls[0];

        if (toolCall.function) {
          const result = await toolRunner({
            toolCallFunction: toolCall.function,
            userMessage: userSearch,
          });

          console.log("Tool Result:", result);

          // Add the tool's result to the history
          history.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: `${result}`,
          });
        }
      }
    } catch (error) {
      console.error("Error occurred during agent execution:", error);
    }

    attempts++;
  }

  console.error("Max retries reached. Unable to fulfill the request.");
  return "Sorry, I couldn't process your request at this time.";
};
