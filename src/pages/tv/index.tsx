import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import MediaListingView from "@/views/MediaListingView";
import { NextSeo } from "next-seo";
import * as TMDB from "@/lib/tmdb";
import { prepareMediaListData } from "@/lib/media-parser";

const SORT_TO_METHOD = {
  trending: "getTrendingTvShows",
  popular: "getPopularTvShows",
  top_rated: "getTopRatedTvShows",
  on_the_air: "getOnTheAirTvShows",
  airing_today: "getAiringTodayTvShows",
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

const TvShows = ({
  initialData,
  queryData,
  sort,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const titleMap: Record<string, string> = {
    trending: "Trending",
    popular: "Popular",
    top_rated: "Top Rated",
    on_the_air: "On The Air",
    airing_today: "Airing Today",
  };

  return (
    <>
      <NextSeo
        title={`${titleMap[sort] ?? "Trending"} TV Shows`}
        description="Explore TV shows on Lumiere"
      />
      <MediaListingView initialData={initialData} queryData={queryData} />
    </>
  );
};

export default TvShows;
