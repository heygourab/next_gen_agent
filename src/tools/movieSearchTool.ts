import { z } from "zod";
import { movieQuery } from "../rag/query.ts";

export const movieSearchDescription = {
  name: "movieSearch",
  description:
    "This tool is used to searching for movies from the user input. For example, the user might want to search for a movie with a title 'The Dark Knight' or a movie with a genre 'horror'.",
  parameters: z.object({
    data: z
      .string()
      .describe(
        "Query string for the query the movie that going to be search."
      ),
    filters: z.object({
      title: z.string().describe("Title of the movie."),
      genre: z
        .string()
        .optional()
        .describe("Genre of the movie, for example: horror, comedy."),
      description: z
        .string()
        .optional()
        .describe(
          "Description of the movie for example user might want to search for a movie with a description that contains the word 'love'."
        ),
      actors: z
        .string()
        .array()
        .optional()
        .describe("name of the movie actors, for example: ['Tom Cruise']."),
      director: z
        .string()
        .optional()
        .describe(
          "Name of the movie director, for example: 'Steven Spielberg'."
        ),
      year: z
        .number()
        .optional()
        .describe("Movie release year. for example: 2000."),
      runtime: z
        .number()
        .optional()
        .describe(
          "Movie runtime in minutes, for example: 60mins means 1 hour."
        ),
      revenue: z
        .number()
        .optional()
        .describe(
          "Movie revenue in million, for example: 100 means 100 million."
        ),
      metascore: z
        .number()
        .optional()
        .describe(
          "A Metascore is a score (0-100) from Metacritic that aggregates professional reviews for movies."
        ),
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
      topK: 5,
      filters,
    });

    const movies = result.map((movie) => {
      return {
        id: movie.id,
        score: movie.score,
        metadata: movie.metadata,
      };
    });

    return movies;
  } catch (error) {
    console.error("Error occurred during movie search:", error);
  }
};
