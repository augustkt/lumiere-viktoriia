import React from "react";
import cn from "classnames";
import SingleItem from "@/components/SingleItem";
import { MediaSingleItemData } from "@/types/tmdb/parsed";
import { useTranslation } from "@/lib/i18n";
import useScroll from "@/hooks/useScroll";

type Props = {
  recommendations: MediaSingleItemData[];
  similar: MediaSingleItemData[];
};

const tabs = ["recommendations", "similar"] as const;

const Recommendations = ({ recommendations, similar }: Props) => {
  const { t } = useTranslation();
  const [active, setActive] = React.useState<(typeof tabs)[number]>(
    recommendations.length > 0 ? "recommendations" : "similar"
  );

  const items = active === "recommendations" ? recommendations : similar;

  const {
    ref: scrollRef,
    handleScroll,
    isScrollableToLeft,
    isScrollableToRight,
    scrollToLeft,
    scrollToRight,
  } = useScroll();

  if (recommendations.length === 0 && similar.length === 0) return null;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-x-2 border-b border-white/10">
          {tabs.map((tab) => {
            const count =
              tab === "recommendations" ? recommendations.length : similar.length;
            if (count === 0) return null;
            return (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={cn(
                  "border-b-2 px-3 pb-2 text-sm font-bold transition",
                  active === tab
                    ? "border-moviyellow text-moviyellow"
                    : "border-transparent text-white/60 hover:text-white"
                )}
              >
                {t(`details.${tab}`)}
              </button>
            );
          })}
        </div>

        <div className="hidden gap-x-4 md:flex">
          <button
            disabled={!isScrollableToLeft}
            onClick={scrollToLeft}
            className={cn(
              "rounded-full p-1.5 transition",
              isScrollableToLeft
                ? "bg-white/10 text-white hover:bg-white/20"
                : "cursor-not-allowed bg-white/5 text-white/30"
            )}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            disabled={!isScrollableToRight}
            onClick={scrollToRight}
            className={cn(
              "rounded-full p-1.5 transition",
              isScrollableToRight
                ? "bg-white/10 text-white hover:bg-white/20"
                : "cursor-not-allowed bg-white/5 text-white/30"
            )}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="-mx-6 snap-x snap-mandatory scroll-px-6 overflow-x-auto scroll-smooth scrollbar-none sm:-mx-12 sm:scroll-px-12"
      >
        <div className="inline-block px-6 sm:px-12">
          <ul className="grid auto-cols-min grid-flow-col gap-x-4">
            {items.map((item) => (
              <li
                key={`${item.mediaType}-${item.id}`}
                className="w-[40vw] snap-start sm:w-[180px]"
              >
                <SingleItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
