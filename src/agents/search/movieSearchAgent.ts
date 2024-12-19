import { runLLM } from "../../llm.ts";
import { toolRunner } from "../../toolRunner.ts";
import { movieSearchDescription } from "../../tools/movieSearchTool.ts";
import { searchSystemPrompt } from "./movieSearchSystemPrompt.ts";
import {
  clearDB,
  fetchMessagesFromDB,
  pushMessageToDB,
  saveToolCallResponse,
} from "../../../db/index.ts";
import { logMessage } from "../../ui.ts";


export const movieSearchAgent = async (userSearch: string) => {
  await pushMessageToDB({
    message: {
      role: "user",
      content: userSearch,
    },
  });

  const MAX_RETRIES = 5;
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    const history = await fetchMessagesFromDB();

    try {
      // Interact with the language model
      const response = await runLLM({
        messages: history,
        tools: [movieSearchDescription],
        model: "gpt-4o-mini-2024-07-18",
        systemPrompt: searchSystemPrompt,
        maxToken: 400,
        isParallel_tool_calls: false,
      });

      // Add the model's response to the history
      await pushMessageToDB(response);

      // If the model provides a direct answer, return it
      if (response.message.content) {
        logMessage(response.message);
        await clearDB();
        return response.message.content;
      }

      // If the model requests a tool call, process it
      if (
        Array.isArray(response.message.tool_calls) &&
        response.message.tool_calls.length > 0
      ) {
        const toolCall = response.message.tool_calls[0];
        logMessage(response.message);
        if (toolCall.function) {
          const functionResponse = await toolRunner({
            toolCallFunction: toolCall.function,
            userMessage: userSearch,
          });
          console.log(functionResponse);

          await saveToolCallResponse({
            tool_call_id: toolCall.id,
            toolCallResponse: functionResponse ?? "No response",
          });
        }
      }
    } catch (error) {
      console.error("Error occurred during agent execution:", error);
      await clearDB();
    } finally {
      // todo -
    }
    attempts++;
  }

  console.error("Max retries reached. Unable to fulfill the request.");
  return "Sorry, I couldn't process your request at this time.";
};
