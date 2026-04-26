import InfiniteScroll from "@/components/InfiniteScroll";
import {
  MediaSingleItemData,
  MediaListingInitialData,
} from "@/types/tmdb/parsed";
import React from "react";
import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "@/utils/util";
import Loader from "@/components/Loader";

type Props = {
  initialData: MediaListingInitialData;
  queryData: Record<string, any>;
  className?: string;
  children: (mediaListData: MediaSingleItemData[]) => React.ReactNode;
};

const MediaInfiniteScroll = ({
  initialData,
  queryData,
  className,
  children,
}: Props) => {
  const { locale } = useRouter();
  const [totalPages, setTotalPages] = React.useState(initialData.totalPages);

  const { data, size, setSize } = useSWRInfinite<MediaSingleItemData[]>(
    (index) =>
      totalPages > index
        ? `/api/tmdb?page=${index + 1}&lang=${locale ?? "en"}&${new URLSearchParams(
            queryData
          )}`
        : null,
    (url: string) =>
      fetcher(url).then((data) => {
        setTotalPages(data.totalPages);
        return data.results;
      }),
    {
      fallbackData: [initialData.results],
      // Refetch when locale changes so cards relabel.
      revalidateFirstPage: true,
    }
  );

  const mediaListData = data
    ? ([] as MediaSingleItemData[]).concat(...data)
    : [];
  const hasMore = totalPages > size;
  const loadMore = () => setSize(size + 1);

  return (
    <InfiniteScroll
      loadMore={loadMore}
      hasMore={hasMore}
      className={className}
      loader={<Loader />}
      threshold="-250px"
    >
      {children(mediaListData)}
    </InfiniteScroll>
  );
};

export default MediaInfiniteScroll;
