import z from "zod";
import {
  movieSearchDescription,
  movieSearch,
} from "./tools/movieSearchTool.ts";
const toolCallFunction = z.object({
  name: z.string(),
  arguments: z.string(),
});

type ToolCallFn = z.infer<typeof toolCallFunction>;

export const toolRunner = async ({
  toolCallFunction,
  userMessage,
}: {
  toolCallFunction: ToolCallFn;
  userMessage: string;
}) => {
  const fnInput = {
    args: JSON.parse(toolCallFunction.arguments),
    userMessage: userMessage,
  };

  switch (toolCallFunction.name) {
    case movieSearchDescription.name:
      return await movieSearch(fnInput.args);
    default:
      throw new Error(`Tool ${toolCallFunction.name} not found`);
  }
};
