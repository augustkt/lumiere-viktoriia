import ImageWithShimmer from "@/components/ImageWithShimmer";
import Link from "next/link";
import React from "react";
import cn from "classnames";
import useScroll from "@/hooks/useScroll";
import { MediaDetailsData } from "@/types/tmdb/parsed";
import { useTranslation } from "@/lib/i18n";

const Cast = ({ title, cast }: Pick<MediaDetailsData, "title" | "cast">) => {
  const { t } = useTranslation();

  const localizeCharacter = (raw: string): string => {
    if (!raw) return raw;
    return raw
      .replace(/\(voice\)/gi, `(${t("cast.voice")})`)
      .replace(/\(uncredited\)/gi, `(${t("cast.uncredited")})`)
      .replace(/\(archive footage\)/gi, `(${t("cast.archiveFootage")})`);
  };

  const {
    ref: scrollRef,
    handleScroll,
    isScrollableToLeft,
    isScrollableToRight,
    scrollToLeft,
    scrollToRight,
  } = useScroll();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{t("details.castOf", { title })}</h2>
        <div className="mr-4 hidden justify-end gap-x-8 md:flex">
          <button
            className={cn(
              "transition-all",
              { "pointer-events-none fill-white/30": !isScrollableToLeft },
              { "fill-white/80 hover:fill-white": isScrollableToLeft }
            )}
            onClick={scrollToLeft}
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 34.075 34.075"
              xmlSpace="preserve"
              className="h-6 w-6 "
            >
              <path d="M24.57 34.075a1.964 1.964 0 0 1-1.396-.577L8.11 18.432a1.972 1.972 0 0 1 0-2.79L23.174.578a1.973 1.973 0 1 1 2.791 2.79l-13.67 13.669 13.67 13.669a1.974 1.974 0 0 1-1.395 3.369z" />
            </svg>
            <span className="sr-only">{t("cast.previous")}</span>
          </button>
          <button
            className={cn(
              "transition-all",
              { "pointer-events-none fill-white/30": !isScrollableToRight },
              { "fill-white/80 hover:fill-white": isScrollableToRight }
            )}
            onClick={scrollToRight}
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 34.075 34.075"
              xmlSpace="preserve"
              className="h-6 w-6"
              transform="scale(-1,1)"
            >
              <path d="M24.57 34.075a1.964 1.964 0 0 1-1.396-.577L8.11 18.432a1.972 1.972 0 0 1 0-2.79L23.174.578a1.973 1.973 0 1 1 2.791 2.79l-13.67 13.669 13.67 13.669a1.974 1.974 0 0 1-1.395 3.369z" />
            </svg>
            <span className="sr-only">{t("cast.next")}</span>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="-mx-6 snap-x snap-mandatory scroll-px-6 overflow-x-auto scroll-smooth scrollbar-none sm:-mx-12 sm:scroll-px-12"
      >
        <div className="inline-block px-6 sm:px-12">
          <ul className="grid auto-cols-min grid-flow-col gap-x-4 p-1 sm:gap-x-8">
            {cast.map((person) => (
              <li
                key={person.id}
                className="flex w-[25vw] snap-start flex-col gap-y-2 focus:outline-none sm:w-[150px]"
              >
                {/*
                  Use next/link so locale persists (uk → /uk/person/:id).
                  Plain <a href> caused a full page reload that lost the
                  active locale.
                */}
                <Link href={`/person/${person.id}`}>
                  <a className="block focus:outline-none">
                    <ImageWithShimmer
                      alt={person.name}
                      src={person.profileImageUrl}
                      tabIndex={0}
                      width="150"
                      height="150"
                      className="h-[25vw] w-full rounded-full object-cover shadow-2xl ring-2 ring-transparent transition hover:ring-moviyellow focus:outline-none focus:ring-4 focus:ring-moviyellow sm:h-[150px]"
                    />
                  </a>
                </Link>
                <div className="flex flex-col text-center">
                  <Link href={`/person/${person.id}`}>
                    <a className="block hover:underline">
                      <span
                        title={person.name}
                        className="block truncate text-xs font-bold md:text-sm"
                      >
                        {person.name}
                      </span>
                    </a>
                  </Link>
                  <span
                    title={person.character}
                    className="truncate text-xs text-white/70"
                  >
                    {localizeCharacter(person.character)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Cast;
