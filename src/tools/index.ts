import { generateImageDescription } from "./generateImage.ts";
import {
  fetchRedditPopularPageDescription,
  fetchSubRedditDescription,
} from "./fetchReddit.ts";
export const tools = [
  generateImageDescription,
  fetchRedditPopularPageDescription,
  fetchSubRedditDescription,
];
