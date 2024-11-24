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

export const fetchSubredditDescription = {
  name: "fetchSubreddit",
  description: `Fetch the posts of a specific subreddit, for example user might prompt, "what's going on in r/cats".`,
  parameters: z.object({
    subreddit: z
      .string()
      .min(1)
      .transform((val) => val.replace(/^r\//, "").toLowerCase())
      .describe(
        "The name of the subreddit, for example user might prompt, 'what's going on in r/cats'."
      ),
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

type SubredditArgs = z.infer<typeof fetchSubredditDescription.parameters>;
export const fetchSubreddit = async (toolArg: SubredditArgs) => {
  try {
    const subreddit = toolArg.subreddit;
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch subreddit ${subreddit}`);
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
      message: `Subreddit ${subreddit} fetched successfully`,
      data: relevantData,
    });
  } catch (error) {
    console.log(error);
  }
};
