import z from "zod";
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
    default:
      throw new Error(`Tool ${toolCallFunction.name} not found`);
  }
};
