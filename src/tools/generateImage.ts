import { z } from "zod";
import process from "node:process";
import fs from "node:fs/promises";
import { Buffer } from "node:buffer";

export const generateImageDescription = {
  name: "generate_image",
  description: `Creates an image based on a user-provided prompt utilizing advanced diffusion model image generators such like DALL-E, VQ-VAE-2, or CLIP guided diffusion. For instance, a user might request, "Generate an image of a flower.`,
  parameters: z.object({
    prompt: z
      .string()
      .describe(
        "The input text data (sometimes called “prompt”) to generate the image with."
      ),
    guidanceScale: z
      .number()
      .optional()
      .describe(
        "The guidance scale to use for the model.A higher guidance scale value encourages the model to generate images closely linked to the text prompt, but values too high may cause saturation and other artifacts."
      ),
    numInferenceSteps: z
      .number()
      .optional()
      .describe(
        "The number of inference steps to use for the model. A higher number of inference steps may result in more detailed images, but may also take longer to generate."
      ),
    targetSize: z.object({
      height: z
        .number()
        .default(1024)
        .optional()
        .describe("The height of the generated image."),
      width: z
        .number()
        .default(1024)
        .optional()
        .describe("The width of the generated image."),
    }),
    seed: z
      .number()
      .optional()
      .describe(
        "The seed to use for the model. The seed is a random number that the model uses to generate the image. Using the same seed will produce the same image."
      ),
    reasoning: z
      .string()
      .optional()
      .describe("Provide the proper reasoning for selecting this tool."),
  }),
};

type Args = z.infer<typeof generateImageDescription.parameters>;

export const generateImage = async (toolArg: Args) => {
  try {
    const body = JSON.stringify({
      inputs: toolArg.prompt,
      parameters: {
        guidance_scale: toolArg.guidanceScale,
        num_inference_steps: toolArg.numInferenceSteps,
        target_size: {
          height: toolArg.targetSize.height,
          width: toolArg.targetSize.width,
        },
        seed: toolArg.seed,
      },
    });

    const response = await fetch(
      "https://api-inference.huggingface.co/models/Jovie/Midjourney",
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
