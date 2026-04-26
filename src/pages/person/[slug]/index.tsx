import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import Image from "next/future/image";
import Link from "next/link";
import * as TMDB from "@/lib/tmdb";
import { TMDBIdNotFound } from "@/lib/tmdb";
import { InferGetServerSidePropsType, MediaType } from "@/types/general";
import { slugify } from "@/utils/util";
import LayoutWithoutSidebar from "@/layouts/LayoutWithoutSidebar";
import { useTranslation } from "@/lib/i18n";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const slug = context.params?.slug as string;
  const id = parseInt(slug.split("-")[0]);
  if (!id || isNaN(id)) return { notFound: true };

  let raw: any;
  try {
    raw = await TMDB.getPersonDetailsById(id, context.locale);
  } catch (e) {
    if (e instanceof TMDBIdNotFound) return { notFound: true };
    throw e;
  }

  // Combined credits sorted by popularity, deduped, top 18
  const credits = (raw.combined_credits?.cast ?? [])
    .filter((c: any) => c.poster_path)
    .sort((a: any, b: any) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 18)
    .map((c: any) => {
      const mediaType = c.media_type === "tv" ? MediaType.TV : MediaType.Movie;
      const title = c.title ?? c.name;
      const originalTitle = c.original_title ?? c.original_name ?? title;
      const year = (c.release_date ?? c.first_air_date ?? "").slice(0, 4);
      return {
        id: c.id,
        title,
        mediaType,
        year,
        character: c.character ?? "",
        posterImageUrl: c.poster_path
          ? TMDB.getPosterImageAbsoluteUrl(c.poster_path)
          : TMDB.DEFAULT_POSTER_IMAGE_URI,
        path: `/${mediaType}/${c.id}-${slugify(originalTitle || title)}`,
      };
    });

  const person = {
    id: raw.id,
    name: raw.name,
    biography: raw.biography ?? "",
    birthday: raw.birthday ?? null,
    deathday: raw.deathday ?? null,
    placeOfBirth: raw.place_of_birth ?? null,
    knownForDepartment: raw.known_for_department ?? null,
    profileImageUrl: raw.profile_path
      ? TMDB.getProfileImageAbsoluteUrl(raw.profile_path)
      : TMDB.DEFAULT_PROFILE_IMAGE_URI,
    credits,
  };

  return { props: { person } };
};

const PersonPage = ({
  person,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t, locale } = useTranslation();
  const dateFmt = (d: string) =>
    new Date(d).toLocaleDateString(locale === "uk" ? "uk-UA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <NextSeo title={person.name} description={person.biography.slice(0, 160)} />
      <LayoutWithoutSidebar>
        <div className="flex flex-col gap-12 md:flex-row">
          <div className="mx-auto h-[clamp(200px,25vw,300px)] w-[clamp(200px,25vw,300px)] flex-shrink-0 md:mx-0">
            <Image
              src={person.profileImageUrl}
              alt={person.name}
              width={300}
              height={300}
              className="h-full w-full rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex flex-col gap-y-4">
            <h1 className="text-4xl font-bold">{person.name}</h1>

            <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {person.knownForDepartment && (
                <div>
                  <span className="block text-xs uppercase tracking-wider text-white/60">
                    {t("person.knownForDepartment")}
                  </span>
                  <span className="block">{person.knownForDepartment}</span>
                </div>
              )}
              {person.birthday && (
                <div>
                  <span className="block text-xs uppercase tracking-wider text-white/60">
                    {t("person.born")}
                  </span>
                  <span className="block">{dateFmt(person.birthday)}</span>
                </div>
              )}
              {person.deathday && (
                <div>
                  <span className="block text-xs uppercase tracking-wider text-white/60">
                    {t("person.died")}
                  </span>
                  <span className="block">{dateFmt(person.deathday)}</span>
                </div>
              )}
              {person.placeOfBirth && (
                <div>
                  <span className="block text-xs uppercase tracking-wider text-white/60">
                    {t("person.placeOfBirth")}
                  </span>
                  <span className="block">{person.placeOfBirth}</span>
                </div>
              )}
            </div>

            <div className="mt-2">
              <h2 className="mb-2 text-xl font-bold">{t("person.biography")}</h2>
              <p className="whitespace-pre-line text-white/80">
                {person.biography || t("person.noBiography")}
              </p>
            </div>
          </div>
        </div>

        {person.credits.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">{t("person.filmography")}</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {person.credits.map((c: any) => (
                <Link key={`${c.mediaType}-${c.id}`} href={c.path}>
                  <a className="group flex flex-col gap-y-2">
                    <div className="overflow-hidden rounded-lg shadow-xl transition group-hover:brightness-125">
                      <Image
                        src={c.posterImageUrl}
                        alt={c.title}
                        width={300}
                        height={450}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                    <div className="px-1">
                      <span className="block truncate text-sm font-semibold">
                        {c.title}
                      </span>
                      {c.character && (
                        <span className="block truncate text-xs text-white/60">
                          {c.character}
                        </span>
                      )}
                      {c.year && (
                        <span className="block text-xs text-white/40">
                          {c.year}
                        </span>
                      )}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
      </LayoutWithoutSidebar>
    </>
  );
};

export default PersonPage;
