// insert data to db

import fs from "node:fs";
import { index } from "./index.ts";
import ora from "ora";
import path from "node:path";
import { parse } from "csv-parse/sync";

const indexMovieData = async () => {
  const spinner = ora("Start reading the raw data...").start();
  const csvPath = path.join(process.cwd(), "/src/rag/imdb_movie_dataset.csv");
  const csv = fs.readFileSync(csvPath, "utf-8");
  const record = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  });
  spinner.succeed("Done.");

  spinner.start("Start indexing movies...");
  const indexPromises = record.map(async (movie: any) => {
    const chunk = `${movie.Title}, ${movie.Description}, ${movie.Genre}`;

    await index.upsert({
      id: movie.Title,
      data: chunk,
      metadata: {
        title: movie.Title,
        genre: movie.Genre,
        description: movie.Description,
        actors: movie.Actors,
        director: movie.Director,
        year: movie.Year,
        runtime: movie.Runtime,
        rating: movie.Rating,
        revenue: movie.Revenue,
        metascore: movie.Metascore,
      },
    });
  });

  try {
    await Promise.all(indexPromises);
    spinner.succeed("Done");
  } catch (error) {
    spinner.fail("Failed to index movie data");
    console.error(error);
    process.exit(1);
  }
};

await indexMovieData();
