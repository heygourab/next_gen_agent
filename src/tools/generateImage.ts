import { z } from "zod";
import process from "node:process";
import fs from "node:fs/promises";
import { Buffer } from "node:buffer";

export const generateImageDescription = {
  name: "generate_image",
  description: `Creates an image based on a user-provided prompt utilizing advanced diffusion model image generators such like DALL-E, VQ-VAE-2, or CLIP guided diffusion. For instance, a user might request, "Generate an image of a flower.`,
  parameters: z.object({
    prompt: z.string().describe("The prompt to generate the image with."),
    reasoning: z
      .string()
      .optional()
      .describe("Provide the proper reasoning for selecting this tool."),
  }),
};

type Args = z.infer<typeof generateImageDescription.parameters>;

export const generateImage = async (toolArg: Args) => {
  try {
    const body = JSON.stringify({ inputs: toolArg.prompt });
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: body,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const imageBuffer = await response.arrayBuffer();
    const imagePath = `./generated_image_${crypto.randomUUID()}.png`;
    await fs.writeFile(imagePath, Buffer.from(imageBuffer));

    return JSON.stringify({
      success: true,
      message: "Image generated successfully",
      imagePath: imagePath,
    });
  } catch (error) {
    console.log(error);
  }
};
