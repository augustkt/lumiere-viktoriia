import { MovieDetails, TvDetails } from "@/types/tmdb/detail";
import { Search, TMDBResponse } from "@/types/tmdb";
import { Movies, TvShows } from "@/types/tmdb/popular";

export const BASE_URL = "https://api.themoviedb.org/3";

export const DISCOVER_MOVIES_ENDPOINT = `/discover/movie`;
export const DISCOVER_TV_ENDPOINT = `/discover/tv`;

export const GENERATE_MOVIE_ENDPOINT = (movieId: number) => `/movie/${movieId}`;
export const GENERATE_TV_ENDPOINT = (tvId: number) => `/tv/${tvId}`;
export const GENERATE_PERSON_ENDPOINT = (personId: number) =>
  `/person/${personId}`;

export const TRENDING_MOVIES_ENPOINT = `/trending/movie/week`;
export const TRENDING_TV_ENDPOINT = `/trending/tv/week`;
export const POPULAR_MOVIES_ENDPOINT = `/movie/popular`;
export const POPULAR_TV_ENDPOINT = `/tv/popular`;
export const TOP_RATED_MOVIES_ENDPOINT = `/movie/top_rated`;
export const TOP_RATED_TV_ENDPOINT = `/tv/top_rated`;
export const NOW_PLAYING_MOVIES_ENDPOINT = `/movie/now_playing`;
export const UPCOMING_MOVIES_ENDPOINT = `/movie/upcoming`;
export const ON_THE_AIR_TV_ENDPOINT = `/tv/on_the_air`;
export const AIRING_TODAY_TV_ENDPOINT = `/tv/airing_today`;

export const SEARCH_MOVIE_ENDPOINT = `/search/movie`;
export const SEARCH_TV_ENDPOINT = `/search/tv`;
export const SEARCH_MULTI_ENDPOINT = `/search/multi`;

export const DEFAULT_POSTER_IMAGE_URI = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='grey'%3e%3cpath fill-rule='evenodd' d='M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z' clip-rule='evenodd'/%3e%3c/svg%3e`;
export const DEFAULT_PROFILE_IMAGE_URI = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='grey'%3e%3cpath fill-rule='evenodd' d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z' clip-rule='evenodd'/%3e%3c/svg%3e`;

export const getBackdropImageAbsoluteUrl = (relativePath: string) =>
  `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${relativePath}`;
export const getPosterImageAbsoluteUrl = (relativePath: string) =>
  `https://image.tmdb.org/t/p/w300_and_h450_bestv2${relativePath}`;
export const getProfileImageAbsoluteUrl = (relativePath: string) =>
  `https://image.tmdb.org/t/p/w150_and_h150_face${relativePath}`;

export const tmdbLanguageFromLocale = (locale?: string): string => {
  switch (locale) {
    case "uk":
      return "uk-UA";
    case "en":
    default:
      return "en-US";
  }
};

export const apiFetch = async (
  endPoint: string,
  additionalParams?: Record<string, any>,
  language?: string
) => {
  const url = new URL(`${BASE_URL}${endPoint}`);
  const params = new URLSearchParams(additionalParams);
  params.append("api_key", process.env.TMDB_APIKEY!);
  if (language) params.append("language", language);
  url.search = params.toString();

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    if (
      data.status_code !== undefined &&
      (data.status_code === 6 || data.status_code === 34)
    ) {
      throw new TMDBIdNotFound();
    } else {
      throw new TMDBError(data.status_message, data.status_code);
    }
  }

  return data;
};

const lang = tmdbLanguageFromLocale;

export const discoverMovies = async (page = 1, locale?: string) =>
  apiFetch(DISCOVER_MOVIES_ENDPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<Movies>
  >;
export const discoverTvShows = async (page = 1, locale?: string) =>
  apiFetch(DISCOVER_TV_ENDPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<TvShows>
  >;
export const getTrendingMovies = async (page = 1, locale?: string) =>
  apiFetch(TRENDING_MOVIES_ENPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<Movies>
  >;
export const getTrendingTvShows = async (page = 1, locale?: string) =>
  apiFetch(TRENDING_TV_ENDPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<TvShows>
  >;
export const getPopularMovies = async (page = 1, locale?: string) =>
  apiFetch(POPULAR_MOVIES_ENDPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<Movies>
  >;
export const getPopularTvShows = async (page = 1, locale?: string) =>
  apiFetch(POPULAR_TV_ENDPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<TvShows>
  >;
export const getTopRatedMovies = async (page = 1, locale?: string) =>
  apiFetch(TOP_RATED_MOVIES_ENDPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<Movies>
  >;
export const getTopRatedTvShows = async (page = 1, locale?: string) =>
  apiFetch(TOP_RATED_TV_ENDPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<TvShows>
  >;
export const getNowPlayingMovies = async (page = 1, locale?: string) =>
  apiFetch(NOW_PLAYING_MOVIES_ENDPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<Movies>
  >;
export const getUpcomingMovies = async (page = 1, locale?: string) =>
  apiFetch(UPCOMING_MOVIES_ENDPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<Movies>
  >;
export const getOnTheAirTvShows = async (page = 1, locale?: string) =>
  apiFetch(ON_THE_AIR_TV_ENDPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<TvShows>
  >;
export const getAiringTodayTvShows = async (page = 1, locale?: string) =>
  apiFetch(AIRING_TODAY_TV_ENDPOINT, { page }, lang(locale)) as Promise<
    TMDBResponse<TvShows>
  >;

export const discoverMoviesByGenreId = async (
  genreId: number,
  page = 1,
  locale?: string,
  sortBy: string = "popularity.desc"
) =>
  apiFetch(
    DISCOVER_MOVIES_ENDPOINT,
    { with_genres: genreId, page, sort_by: sortBy },
    lang(locale)
  ) as Promise<TMDBResponse<Movies>>;

export const discoverTvShowsByGenreId = async (
  genreId: number,
  page = 1,
  locale?: string,
  sortBy: string = "popularity.desc"
) =>
  apiFetch(
    DISCOVER_TV_ENDPOINT,
    { with_genres: genreId, page, sort_by: sortBy },
    lang(locale)
  ) as Promise<TMDBResponse<TvShows>>;

export const getMovieDetailsById = async (movieId: number, locale?: string) =>
  apiFetch(
    GENERATE_MOVIE_ENDPOINT(movieId),
    { append_to_response: "credits,videos,watch/providers,recommendations,similar" },
    lang(locale)
  ) as Promise<TMDBResponse<MovieDetails>>;

export const getTvShowDetailsById = async (tvId: number, locale?: string) =>
  apiFetch(
    GENERATE_TV_ENDPOINT(tvId),
    { append_to_response: "credits,videos,watch/providers,recommendations,similar" },
    lang(locale)
  ) as Promise<TMDBResponse<TvDetails>>;

export const getPersonDetailsById = async (personId: number, locale?: string) =>
  apiFetch(
    GENERATE_PERSON_ENDPOINT(personId),
    { append_to_response: "movie_credits,tv_credits,combined_credits" },
    lang(locale)
  );

export const searchMovie = async (query: string, page = 1, locale?: string) =>
  apiFetch(SEARCH_MOVIE_ENDPOINT, { query, page }, lang(locale)) as Promise<
    TMDBResponse<Search<Movies>>
  >;
export const searchTvShows = async (query: string, page = 1, locale?: string) =>
  apiFetch(SEARCH_TV_ENDPOINT, { query, page }, lang(locale)) as Promise<
    TMDBResponse<Search<TvShows>>
  >;
export const searchMulti = async (query: string, page = 1, locale?: string) =>
  apiFetch(SEARCH_MULTI_ENDPOINT, { query, page }, lang(locale)) as Promise<
    TMDBResponse<Search<any>>
  >;

export class TMDBError extends Error {
  code?: number;
  constructor(statusMessage = "", statusCode?: number) {
    super(statusMessage);
    if (statusCode) this.code = statusCode;
    Object.setPrototypeOf(this, TMDBError.prototype);
  }
}

export class TMDBIdNotFound extends TMDBError {
  constructor() {
    super("Invalid id", 404);
    Object.setPrototypeOf(this, TMDBIdNotFound.prototype);
  }
}
