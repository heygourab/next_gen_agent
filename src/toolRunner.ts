import { z } from "zod";
import {
  generateImage,
  generateImageDescription,
} from "./tools/generateImage.ts";
import {
  fetchRedditPopularPage,
  fetchRedditPopularPageDescription,
} from "./tools/fetchReddit.ts";

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
    case generateImageDescription.name:
      return await generateImage(fnInput.args);

    case fetchRedditPopularPageDescription.name:
      return await fetchRedditPopularPage(fnInput.args);
    default:
      throw new Error(`Tool ${toolCallFunction.name} not found`);
  }
};
