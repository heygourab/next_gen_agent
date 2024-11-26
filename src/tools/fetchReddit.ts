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

export const fetchSubRedditDescription = {
  name: "fetchSubReddit",
  description: `Fetch the subreddit details, for example user might prompt, "what going on cat's subreddit or fetch latest post from a specific subreddit".`,
  parameters: z.object({
    subreddit: z
      .string()
      .transform((val) => {
        val.replace("/r", "");
      })
      .describe("The subreddit name to fetch the details."),
    reasoning: z
      .string()
      .optional()
      .describe("Provide the proper reasoning for selecting this tool."),
  }),
  require: ["subreddit"],
};

type RedditArgs = z.infer<typeof fetchRedditPopularPageDescription.parameters>;

export const fetchRedditPopularPage = async (toolArg: RedditArgs) => {
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

type SubRedditArgs = z.infer<typeof fetchSubRedditDescription.parameters>;

export const fetchSubReddit = async (toolArg: SubRedditArgs) => {
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${toolArg.subreddit}/.json`
    );
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
