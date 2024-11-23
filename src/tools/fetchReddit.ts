import { z } from "zod";

export const fetchRedditPopularPageDescription = {
  name: "fetchRedditPopularPage",
  description: `Fetch the popular section of Reddit, for example user might prompt, "what's going on Reddit popular or what's fetch reddit popular section for me".`,
  parameters: z.object({
    reasoning: z
      .string()
      .optional()
      .describe("Provide the proper reasoning for selecting this tool."),
  }),
};

type Args = z.infer<typeof fetchRedditPopularPageDescription.parameters>;

export const fetchRedditPopularPage = async (toolArg: Args) => {
  try {
    const response = await fetch("https://www.reddit.com/r/popular/.json");
    if (!response.ok) {
      throw new Error("Failed to fetch Reddit popular page");
    }
    const { data } = (await response.json()) as { data: { children: any[] } };

    const relevantData = data.children.map((child: any) => {
      return {
        title: child.data.title,
        selftext: child.data.selftext,
        subreddit: child.data.subreddit,
        url: child.data.url,
        upvote_ratio: child.data.upvote_ratio,
        ups: child.data.ups,
        over_18: child.data.over_18,
      };
    });

    return JSON.stringify({
      success: true,
      message: "Reddit popular page fetched successfully",
      data: relevantData,
    });
  } catch (error) {
    console.log(error);
  }
};
