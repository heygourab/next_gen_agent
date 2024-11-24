import { generateImageDescription } from "./generateImage.ts";
import {
  fetchRedditPopularPageDescription,
  fetchSubredditDescription,
} from "./fetchReddit.ts";
export const tools = [
  generateImageDescription,
  fetchRedditPopularPageDescription,
  fetchSubredditDescription,
];
