import { useRouter } from "next/router";
import cn from "classnames";
import { useTranslation } from "@/lib/i18n";
import { getRouteData } from "@/lib/route-parser";

const SortBar = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { isGenrePage, isMoviesPage, isTvPage } = getRouteData(router);

  // Trending/Popular/Top Rated/Now Playing/Upcoming for movies
  // Trending/Popular/Top Rated/On The Air/Airing Today for tv
  // For genres → no category options, just the sort_by dropdown
  const categoryOptions = isGenrePage
    ? []
    : isMoviesPage
    ? [
        { value: "trending", label: t("sidebar.trending") },
        { value: "popular", label: t("sidebar.popular") },
        { value: "top_rated", label: t("sidebar.topRated") },
        { value: "now_playing", label: t("sidebar.nowPlaying") },
        { value: "upcoming", label: t("sidebar.upcoming") },
      ]
    : isTvPage
    ? [
        { value: "trending", label: t("sidebar.trending") },
        { value: "popular", label: t("sidebar.popular") },
        { value: "top_rated", label: t("sidebar.topRated") },
        { value: "on_the_air", label: t("sidebar.onTheAir") },
        { value: "airing_today", label: t("sidebar.airingToday") },
      ]
    : [];

  const sortByOptions = isGenrePage
    ? [
        { value: "popularity.desc", label: t("sort.popularity") },
        { value: "vote_average.desc", label: t("sort.rating") },
        {
          value: isMoviesPage
            ? "primary_release_date.desc"
            : "first_air_date.desc",
          label: t("sort.releaseDate"),
        },
        { value: "title.asc", label: t("sort.title") },
      ]
    : [];

  const currentCategory =
    (router.query.sort as string) ?? (isGenrePage ? null : "trending");
  const currentSortBy =
    (router.query.sortBy as string) ?? "popularity.desc";

  const setCategory = (value: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sort: value },
    });
  };

  const setSortBy = (value: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sortBy: value },
    });
  };

  if (categoryOptions.length === 0 && sortByOptions.length === 0) return null;

  return (
    <div className="my-6 flex flex-wrap items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur-sm md:gap-4 md:p-4">
      {categoryOptions.length > 0 && (
        <>
          <span className="text-xs font-bold uppercase tracking-wider text-white/60">
            {t("sortBar.show")}
          </span>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setCategory(opt.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-semibold transition",
                  currentCategory === opt.value
                    ? "bg-moviyellow text-movidark shadow-lg"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}

      {sortByOptions.length > 0 && (
        <>
          <span className="text-xs font-bold uppercase tracking-wider text-white/60">
            {t("sortBar.sortBy")}
          </span>
          <select
            value={currentSortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-full border border-white/20 bg-movidark px-3 py-1.5 text-sm font-semibold text-white focus:border-moviyellow focus:outline-none"
          >
            {sortByOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-movidark">
                {opt.label}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default SortBar;
