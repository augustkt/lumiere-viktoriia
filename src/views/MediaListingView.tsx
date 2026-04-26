import Layout from "@/layouts/Layout";
import Carousel from "@/components/Carousel";
import SingleItem from "@/components/SingleItem";
import MediaInfiniteScroll from "@/components/MediaInfiniteScroll";
import SortBar from "@/components/SortBar";
import { MediaListingInitialData } from "@/types/tmdb/parsed";

interface MediaListingViewProps {
  initialData: MediaListingInitialData;
  queryData: Record<string, any>;
}

function MediaListingView({ initialData, queryData }: MediaListingViewProps) {
  return (
    <>
      <Layout>
        <Carousel items={initialData.results.slice(0, 4)} />

        {/* Highlighted sort UI — visible on every listing page */}
        <SortBar />

        <MediaInfiniteScroll
          className="my-4 grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-y-8 gap-x-4"
          initialData={initialData}
          queryData={queryData}
        >
          {(mediaListData) =>
            mediaListData
              .slice(4)
              .map((data) => <SingleItem key={data.id} item={data} />)
          }
        </MediaInfiniteScroll>
      </Layout>
    </>
  );
}

export default MediaListingView;
