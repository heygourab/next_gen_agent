import { z } from "zod";
import { movieQuery, type Metadata } from "../rag/queriy.ts";

export const movieSearchDescription = {
  name: "movieSearch",
  description: "this tool is used to search for movies from the user input",
  parameters: z.object({
    data: z.string().describe("query string for the query the movie "),
    filters: z.object({
      title: z.string().describe("title of the movie"),
      genre: z
        .string()
        .optional()
        .describe("genre of the movie, for example: horror, comedy"),
      description: z
        .string()
        .optional()
        .describe(
          "description of the movie for example user might want to search for a movie with a description that contains the word 'love'"
        ),
      actors: z
        .string()
        .array()
        .optional()
        .describe("name of the movie actors, for example: ['Tom Cruise']"),
      director: z
        .string()
        .optional()
        .describe(
          "name of the movie director, for example: 'Steven Spielberg'"
        ),
      year: z.number().optional().describe("movie release year"),
      runtime: z
        .number()
        .optional()
        .describe("movie runtime in minutes, for example: 60min means 1 hour"),
      revenue: z
        .number()
        .optional()
        .describe(
          "movie revenue in million, for example: 100 means 100 million"
        ),
      metascore: z.number().optional().describe("movie metascore"),
    }),
  }),
};

type ToolArgs = z.infer<typeof movieSearchDescription.parameters>;

export const movieSearch = async (toolArgs: ToolArgs) => {
  const data = toolArgs.data;

  const {
    title,
    genre,
    description,
    actors,
    director,
    year,
    runtime,
    revenue,
    metascore,
  } = toolArgs.filters || {};

  const filters = {
    ...(title && { title }),
    ...(genre && { genre }),
    ...(description && { description }),
    ...(actors && { actors }),
    ...(director && { director }),
    ...(year && { year }),
    ...(runtime && { runtime }),
    ...(revenue && { revenue }),
    ...(metascore && { metascore }),
  };

  try {
    const result = await movieQuery(data, {
      topK: 1,
      filters,
    });

    const movies = result.map((movie) => {
      return {
        id: movie.id,
        score: movie.score,
        metadata: movie.metadata,
      };
    });

    console.log(movies);
    return movies;
  } catch (error) {}
};
