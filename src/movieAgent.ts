import { pushMessageToDB, fetchMessagesFromDB } from "../db/index.ts";
import { runLLM } from "./llm.ts";
import { logMessage, showLoader } from "./ui.ts";
import { systemPrompt } from "./movieSystemPrompt.ts";

export const runMovieAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string;
  tools: any[];
}) => {
  await pushMessageToDB({
    message: {
      role: "user",
      content: userMessage,
    },
  });
  const loader = showLoader("Thinking...🤔");
  while (true) {
    const history = await fetchMessagesFromDB();
    const response = await runLLM({
      messages: history,
      tools: tools,
      systemPrompt: systemPrompt,
    });

    if (response.message.content) {
      loader.stop();
      pushMessageToDB(response);
      logMessage(response.message);
      loader.succeed("Done...💫");
      return await fetchMessagesFromDB();
    }

    if (response.message.tool_calls && !response.message.content) {
      console.log(`tool call`);
    }
  }
};
