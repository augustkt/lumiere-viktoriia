import Link from "next/link";
import cn from "classnames";
import { useRouter } from "next/router";
import { tvGenres, movieGenres } from "@/data/genres";
import { slugify } from "@/utils/util";
import ActiveLink from "@/components/ActiveLink";
import TMDBAttribution from "@/components/TMDBAttribution";
import { getRouteData } from "@/lib/route-parser";
import { useTranslation } from "@/lib/i18n";

type GenreLinkProps = { genre: { id: number; name: string } };
type SortLinkProps = { value: string; label: string };

const Sidebar = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    isGenrePage,
    isMoviesPage,
    isTvPage,
    genrePathName,
    genreId,
    sortVal,
    currentPageMediaType,
    mediaTypeListPath,
  } = getRouteData(router);

  const localizedGenreName = (g: { id: number; name: string }) => {
    const key = `genres.${g.id}`;
    const translated = t(key);
    return translated === key ? g.name : translated;
  };

  const GenreLink = ({ genre }: GenreLinkProps) => (
    <ActiveLink
      activeClassName="text-moviyellow"
      href={genrePathName}
      as={`/genre/${genre.id}-${slugify(genre.name)}/${currentPageMediaType}`}
    >
      <a>{localizedGenreName(genre)}</a>
    </ActiveLink>
  );

  const SortLink = ({ value, label }: SortLinkProps) => (
    <span className={cn({ "text-moviyellow": sortVal === value })}>
      <Link
        href={{
          pathname: router.pathname,
          query: { ...router.query, sort: value },
        }}
      >
        {label}
      </Link>
    </span>
  );

  // Sort dropdown for genre pages
  const sortOptions = isGenrePage
    ? [
        { value: "popularity.desc", label: t("sort.popularity") },
        { value: "vote_average.desc", label: t("sort.rating") },
        {
          value: isMoviesPage ? "primary_release_date.desc" : "first_air_date.desc",
          label: t("sort.releaseDate"),
        },
        { value: "title.asc", label: t("sort.title") },
      ]
    : [];

  const currentSortBy = (router.query.sortBy as string) ?? "popularity.desc";

  return (
    <nav
      aria-label="Sidebar navigation"
      className="sticky top-0 hidden h-screen w-[15vw] flex-col gap-y-8 md:flex"
    >
      <h1 className="text-4xl">
        {isTvPage ? t("sidebar.tvShows") : isMoviesPage && t("sidebar.movies")}
      </h1>

      {!isGenrePage && (
        <div className="flex flex-col gap-3 text-xl">
          <SortLink value="trending" label={t("sidebar.trending")} />
          <SortLink value="popular" label={t("sidebar.popular")} />
          <SortLink value="top_rated" label={t("sidebar.topRated")} />
          {isMoviesPage && (
            <>
              <SortLink value="now_playing" label={t("sidebar.nowPlaying")} />
              <SortLink value="upcoming" label={t("sidebar.upcoming")} />
            </>
          )}
          {isTvPage && (
            <>
              <SortLink value="on_the_air" label={t("sidebar.onTheAir")} />
              <SortLink value="airing_today" label={t("sidebar.airingToday")} />
            </>
          )}
        </div>
      )}

      {/* Sort by dropdown for genre pages */}
      {isGenrePage && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-white/60">
            {t("sidebar.sortBy")}
          </label>
          <select
            value={currentSortBy}
            onChange={(e) => {
              router.push({
                pathname: router.pathname,
                query: { ...router.query, sortBy: e.target.value },
              });
            }}
            className="rounded-md border border-white/20 bg-movidark px-3 py-2 text-sm text-white focus:border-moviyellow focus:outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-movidark">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col">
        <h2 className="text-3xl">{t("sidebar.genres")}</h2>
        <div className="mt-4 h-[50vh] snap-y snap-proximity overflow-hidden scrollbar hover:overflow-y-scroll hover:scrollbar-thin hover:scrollbar-track-transparent hover:scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-rounded-full">
          <div className="flex flex-col gap-y-2.5 text-xl">
            <h3 className={cn({ "text-moviyellow": genreId === 0 }, "snap-start")}>
              <Link href={mediaTypeListPath ?? "/movies"}>
                {t("sidebar.all")}
              </Link>
            </h3>
            {(isMoviesPage ? movieGenres : isTvPage ? tvGenres : []).map(
              (genre) => (
                <h3 key={genre.id} className="snap-start">
                  <GenreLink genre={genre} />
                </h3>
              )
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 flex flex-col gap-y-3">
        <TMDBAttribution />
      </div>
    </nav>
  );
};

export default Sidebar;
