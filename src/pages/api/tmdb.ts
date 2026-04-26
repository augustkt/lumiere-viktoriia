import { NextApiRequest, NextApiResponse } from "next";
import * as TMDB from "@/lib/tmdb";
import { prepareMediaListData } from "@/lib/media-parser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const page = Number(req.query?.page ?? 1);
  const genreId = req.query?.genreId ?? null;
  const method = req.query?.method as string | undefined;
  const lang = (req.query?.lang as string) || undefined;

  if (!method || isNaN(page)) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  const generalMethods = [
    "discoverMovies",
    "discoverTvShows",
    "getTrendingMovies",
    "getTrendingTvShows",
    "getPopularMovies",
    "getPopularTvShows",
    "getTopRatedMovies",
    "getTopRatedTvShows",
    "getNowPlayingMovies",
    "getUpcomingMovies",
    "getOnTheAirTvShows",
    "getAiringTodayTvShows",
  ] as const;

  const genreMethods = [
    "discoverMoviesByGenreId",
    "discoverTvShowsByGenreId",
  ] as const;

  const rawData = generalMethods.includes(
    method as (typeof generalMethods)[number]
  )
    ? await (TMDB as any)[method](page, lang)
    : genreMethods.includes(method as (typeof genreMethods)[number]) && genreId
    ? await (TMDB as any)[method](Number(genreId), page, lang)
    : null;

  if (!rawData) {
    res.status(404).json({
      results: [],
      totalResults: null,
      page: null,
      totalPage: null,
    });
    return;
  }

  res.status(200).json(prepareMediaListData(rawData));
}
