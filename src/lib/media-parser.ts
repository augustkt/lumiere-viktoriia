import * as TMDB from "@/lib/tmdb";
import { formatMinutes, slugify } from "@/utils/util";
import { MovieDetails, TvDetails } from "@/types/tmdb/detail";
import { Movies, MoviesResult, TvResult, TvShows } from "@/types/tmdb/popular";
import { MediaType } from "@/types/general";
import { movieGenres, tvGenres } from "@/data/genres";

export const detectMediaType = (
  data: MoviesResult | TvResult | MovieDetails | TvDetails
) => {
  return "media_type" in data
    ? ((data as any).media_type as `${MediaType}`)
    : "first_air_date" in data
    ? MediaType.TV
    : MediaType.Movie;
};

export const getRating = (voteAverage: number) => {
  const rating = Number(voteAverage.toFixed(1));
  return !isNaN(rating) || rating !== 0 ? rating : null;
};

export const getPath = (id: number, title: string, mediaType: string) =>
  `/${mediaType}/${id}-${slugify(title)}`;

const canonicalGenreName = (
  id: number,
  fallback: string,
  mediaType: `${MediaType}`
): string => {
  const list = mediaType === MediaType.Movie ? movieGenres : tvGenres;
  return list.find((g) => g.id === id)?.name ?? fallback;
};

export const parseMediaSingleItemData = (data: MoviesResult | TvResult) => {
  const mediaType = detectMediaType(data);

  const title =
    mediaType === MediaType.Movie
      ? (data as MoviesResult).title
      : (data as TvResult).name;

  const originalTitle =
    mediaType === MediaType.Movie
      ? (data as MoviesResult).original_title
      : (data as TvResult).original_name;

  const releaseDate =
    mediaType === MediaType.Movie
      ? (data as MoviesResult).release_date
      : (data as TvResult).first_air_date;

  return {
    id: data.id,
    title,
    mediaType,
    overview: data.overview,
    year: new Date(releaseDate).getFullYear(),
    posterImageUrl: data.poster_path
      ? TMDB.getPosterImageAbsoluteUrl(data.poster_path)
      : TMDB.DEFAULT_POSTER_IMAGE_URI,
    backdropImageUrl: data.backdrop_path
      ? TMDB.getBackdropImageAbsoluteUrl(data.poster_path)
      : null,
    path: getPath(data.id, originalTitle || title, mediaType),
    rating: getRating(data.vote_average),
    genreIds: data.genre_ids,
  };
};

export const getYouTubeTrailerUrl = (data: MovieDetails | TvDetails) => {
  const video = data.videos?.results?.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );
  const videoId = video?.key;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const parseRelatedItems = (raw: any, fallbackMediaType: `${MediaType}`) => {
  const list = raw?.results ?? [];
  return list
    .filter((item: any) => item.poster_path)
    .map((item: any) => {
      const mediaType =
        (item.media_type as `${MediaType}`) ?? fallbackMediaType;
      const title = item.title ?? item.name ?? "";
      const originalTitle = item.original_title ?? item.original_name ?? title;
      const releaseDate = item.release_date ?? item.first_air_date ?? "";

      return {
        id: item.id,
        title,
        mediaType,
        overview: item.overview ?? "",
        year: releaseDate ? new Date(releaseDate).getFullYear() : 0,
        posterImageUrl: TMDB.getPosterImageAbsoluteUrl(item.poster_path),
        backdropImageUrl: item.backdrop_path
          ? TMDB.getBackdropImageAbsoluteUrl(item.backdrop_path)
          : null,
        path: getPath(item.id, originalTitle || title, mediaType),
        rating: getRating(item.vote_average ?? 0),
        genreIds: item.genre_ids ?? [],
      };
    });
};

export const parseMediaDetailsData = (data: MovieDetails | TvDetails) => {
  const mediaType = detectMediaType(data);

  const releaseDate =
    mediaType === MediaType.Movie
      ? (data as MovieDetails).release_date
      : (data as TvDetails).first_air_date;

  const endDate =
    mediaType === MediaType.TV ? (data as TvDetails).last_air_date : null;

  const duration =
    (data as MovieDetails).runtime ??
    (data as TvDetails).episode_run_time?.[0] ??
    0;

  return {
    id: data.id,
    title:
      mediaType === MediaType.Movie
        ? (data as MovieDetails).title
        : (data as TvDetails).name,
    mediaType,
    overview: data.overview,
    posterImageUrl: data.poster_path
      ? TMDB.getPosterImageAbsoluteUrl(data.poster_path)
      : TMDB.DEFAULT_POSTER_IMAGE_URI,
    backdropImageUrl: data.backdrop_path
      ? TMDB.getBackdropImageAbsoluteUrl(data.backdrop_path)
      : null,
    genres: data.genres.map((genre) => ({
      id: genre.id,
      name: genre.name,
      path: `/genre/${genre.id}-${slugify(
        canonicalGenreName(genre.id, genre.name, mediaType)
      )}/${mediaType}`,
    })),
    isReleased: new Date().getTime() > new Date(releaseDate).getTime(),
    isEnded: mediaType === MediaType.TV ? data.status === "Ended" : null,
    rating: getRating(data.vote_average),
    voteCount: data.vote_count ?? 0,
    duration: duration !== 0 ? formatMinutes(duration) : null,
    year: new Date(releaseDate).getFullYear(),
    endYear: endDate ? new Date(endDate).getFullYear() : null,
    trailerUrl: getYouTubeTrailerUrl(data),
    director: data.credits.crew
      .filter((crew) => crew.job === "Director")
      .map((e) => e.name)
      .join(", "),
    creator: data.credits.crew
      .filter((crew) => crew.job === "Creator")
      .map((e) => e.name)
      .join(", "),
    cast: data.credits.cast.map((cast) => ({
      id: cast.id,
      name: cast.name,
      character: cast.character,
      profileImageUrl: cast.profile_path
        ? TMDB.getProfileImageAbsoluteUrl(cast.profile_path)
        : TMDB.DEFAULT_PROFILE_IMAGE_URI,
    })),
    recommendations: parseRelatedItems(
      (data as any).recommendations,
      mediaType
    ),
    similar: parseRelatedItems((data as any).similar, mediaType),
  };
};

export const prepareMediaListData = (rawData: Movies | TvShows) => {
  const mediaData = rawData.results.map((item) =>
    parseMediaSingleItemData(item)
  );

  return {
    results: mediaData,
    totalResults: rawData.total_results,
    page: rawData.page,
    totalPages: rawData.total_pages,
  };
};
