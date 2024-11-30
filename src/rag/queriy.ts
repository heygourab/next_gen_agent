import { object, type number } from "zod";
import { index } from "./index.ts";

// filter by the movie metaData;

type Metadata = {
  title: string;
  genre: string;
  description: string;
  actors: string[];
  director: string;
  year: number;
  runtime: number;
  rating: number;
  revenue: number;
  metascore: number;
};

export const movieQuery = async (
  data: string,
  {
    topK = 5,
    filters,
    includeData = true,
    includeVectors = true,
    includeMetadata = true,
  }: {
    topK: number;
    includeVectors: boolean;
    includeMetadata: boolean;
    includeData: boolean;
    filters: Partial<Metadata> | undefined;
  }
) => {
  let filterStr: string = "";
  if (filters) {
    const filterParts = Object.entries(filters)
      .filter(([_, value]) => value !== undefined)
      .map((key, value) => {
        `${key}='${value}'`;
      });

    filterStr = filterParts.join(" and ");
  }

  const result = await index.query({
    data: data,
    topK: topK,
    filter: filterStr && undefined,
    includeData: includeData,
    includeMetadata: includeMetadata,
    includeVectors: includeVectors,
  });

  return result;
};
