import { z } from "zod";
import { movieQuery } from "../rag/query.ts";

export const movieSearchDescription = {
  name: "movieSearch",
  description:
    "A comprehensive movie search tool that allows users to find movies using various criteria. This tool helps users discover films by specific attributes like title, genre, cast, or other detailed parameters. Whether you're looking for a specific movie or exploring films based on multiple filters, this search function provides flexible and precise movie discovery.",
  parameters: z.object({
    query: z
      .string()
      .describe(
        "The primary search query string for finding movies. This could be a partial title, keyword, or general search term to match against multiple movie attributes."
      ),
    filters: z.object({
      title: z
        .string()
        .describe(
          "Exact or partial movie title to search for. For instance, searching for 'Inter' could return movies like 'Interstellar' or 'Interstella 5555'."
        ),
      genre: z
        .string()
        .optional()
        .describe(
          "Specific movie genre to filter results. Examples include 'sci-fi', 'drama', 'comedy', 'thriller', or 'documentary'. Helps narrow down movie selections to a particular style or type."
        ),
      description: z
        .string()
        .optional()
        .describe(
          "Search within movie descriptions to find films with specific themes or plot elements. For example, searching for 'space exploration', 'love story', or 'historical drama' can help find movies with particular narrative focuses."
        ),
      actors: z
        .string()
        .array()
        .optional()
        .describe(
          "List of actor names to filter movies. Useful for finding films featuring specific performers. For example, ['Leonardo DiCaprio', 'Tom Hanks'] would return movies starring either of these actors."
        ),
      director: z
        .string()
        .optional()
        .describe(
          "Name of the movie director to filter results. Helps users find films by their favorite or most respected filmmakers, like 'Christopher Nolan' or 'Quentin Tarantino'."
        ),
      year: z
        .number()
        .optional()
        .describe(
          "Release year of the movie. Allows searching for films from a specific year or era. For instance, '2010' would return movies released in that particular year."
        ),
      rating: z
        .number()
        .optional()
        .describe(
          "Movie rating on a scale of 1-10. Helps users find highly rated films or filter out lower-rated movies. For example, '8' would return movies with a rating of 8 or higher."
        ),
      runtime: z
        .number()
        .optional()
        .describe(
          "Movie duration in minutes. Helps users find movies of a specific length. For example, '120' would return movies around 2 hours long, while '90' might indicate shorter films."
        ),
      revenue: z
        .number()
        .optional()
        .describe(
          "Total movie revenue in millions of dollars. Can be used to find blockbuster hits or more niche productions. For example, '500' would return movies that grossed around 500 million dollars."
        ),
      metascore: z
        .number()
        .optional()
        .describe(
          "Critical rating from Metacritic, ranging from 0-100. Helps users find critically acclaimed movies. A score of 80+ typically indicates highly praised films, while lower scores might represent more mixed critical reception."
        ),
    }),
  }),
};

type ToolArgs = z.infer<typeof movieSearchDescription.parameters>;

export const movieSearch = async (toolArgs: ToolArgs) => {
  const data = toolArgs.query;

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
      topK: 10,
      filters,
    });

    const movies = result.map((movie) => {
      return {
        id: movie.id,
        score: movie.score,
        metadata: movie.metadata,
      };
    });

    return JSON.stringify(movies, null, 2);
  } catch (error) {
    console.error("Error occurred during movie search:", error);
  }
};
