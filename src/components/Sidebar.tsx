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

const Sidebar = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    isMoviesPage,
    isTvPage,
    genrePathName,
    genreId,
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
      activeClassName="text-moviyellow font-semibold"
      href={genrePathName}
      as={`/genre/${genre.id}-${slugify(genre.name)}/${currentPageMediaType}`}
    >
      <a className="transition hover:text-white">{localizedGenreName(genre)}</a>
    </ActiveLink>
  );

  return (
    <nav
      aria-label="Sidebar navigation"
      className="sticky top-0 hidden h-screen w-[15vw] flex-col gap-y-6 md:flex"
    >
      <h1 className="text-3xl font-bold lg:text-4xl">
        {isTvPage ? t("sidebar.tvShows") : isMoviesPage && t("sidebar.movies")}
      </h1>

      <div className="flex flex-col">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-white/60">
          {t("sidebar.genres")}
        </h2>
        <div className="h-[55vh] snap-y snap-proximity overflow-hidden scrollbar hover:overflow-y-scroll hover:scrollbar-thin hover:scrollbar-track-transparent hover:scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-rounded-full">
          <div className="flex flex-col gap-y-2 text-sm lg:text-base">
            <h3
              className={cn(
                { "text-moviyellow font-semibold": genreId === 0 },
                "snap-start transition hover:text-white"
              )}
            >
              <Link href={mediaTypeListPath ?? "/movies"}>
                <a>{t("sidebar.all")}</a>
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
