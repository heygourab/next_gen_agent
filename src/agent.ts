// import {
//   pushMessageToDB,
//   fetchMessagesFromDB,
//   saveToolCallResponse,
// } from '../db/index.test.ts';
import { logMessage, showLoader } from "./ui.ts";
import { runLLM } from "./llm.ts";
import { toolRunner } from "./toolRunner.ts";

// ai agent === tools + history
export const runAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string;
  tools?: any[];
}) => {
  await pushMessageToDB({
    message: {
      role: "user",
      content: userMessage,
    },
  });

  while (true) {
    const history = await fetchMessagesFromDB();

    const loader = showLoader("Thinking...💭");
    const response = await runLLM({
      messages: history,
      tools: tools || [],
    });

    await pushMessageToDB({ message: response.message });
    logMessage(response.message);

    if (response.message.content) {
      loader.succeed("Done");
      return await fetchMessagesFromDB();
    }

    // check is there any tool_calls
    if (response.message.tool_calls) {
      const toolCall = response.message.tool_calls[0];
      loader.update(`Running tool: ${toolCall.function.name}...🛠️`);
      const functionResponse = await toolRunner({
        toolCallFunction: toolCall.function,
        userMessage: userMessage,
      });

      await saveToolCallResponse({
        tool_call_id: toolCall.id,
        toolCallResponse: functionResponse ?? "No response",
      });

      loader.succeed("Execution complete");
    }
  }
};
