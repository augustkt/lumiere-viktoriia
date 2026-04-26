import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import MediaListingView from "@/views/MediaListingView";
import { NextSeo } from "next-seo";
import * as TMDB from "@/lib/tmdb";
import { prepareMediaListData } from "@/lib/media-parser";

const SORT_TO_METHOD = {
  trending: "getTrendingMovies",
  popular: "getPopularMovies",
  top_rated: "getTopRatedMovies",
  now_playing: "getNowPlayingMovies",
  upcoming: "getUpcomingMovies",
} as const;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const sort = (context.query?.sort as keyof typeof SORT_TO_METHOD) ?? "trending";
  const methodName = SORT_TO_METHOD[sort] ?? SORT_TO_METHOD.trending;
  const method = (TMDB as any)[methodName] as (page: number, locale?: string) => Promise<any>;

  const initialData = prepareMediaListData(await method(1, context.locale));
  const queryData = { method: methodName };

  return { props: { initialData, queryData, sort } };
};

const Movies = ({
  initialData,
  queryData,
  sort,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const titleMap: Record<string, string> = {
    trending: "Trending",
    popular: "Popular",
    top_rated: "Top Rated",
    now_playing: "Now Playing",
    upcoming: "Upcoming",
  };

  return (
    <>
      <NextSeo
        title={`${titleMap[sort] ?? "Trending"} Movies`}
        description="Explore movies on Lumiere"
      />
      <MediaListingView initialData={initialData} queryData={queryData} />
    </>
  );
};

export default Movies;
