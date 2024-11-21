import { z } from "zod";
import process from "node:process";
import fs from "node:fs/promises";
import { Buffer } from "node:buffer";

export const generateImageDescription = {
  name: "generate_image",
  description:
    "Generate an image using a prompt with a diffusion model image generator like DALL-E, VQ-VAE-2, or CLIP guided diffusion.",
  parameters: z.object({
    prompt: z.string().describe("The prompt to generate the image with."),
  }),
};

type Args = z.infer<typeof generateImageDescription.parameters>;

export const generateImage = async (toolArg: Args) => {
  try {
    const body = JSON.stringify({ inputs: toolArg.prompt });
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        method: "POST",
        body: body,
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
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
