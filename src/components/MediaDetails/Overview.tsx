import React from "react";
import cn from "classnames";
import { MediaDetailsData } from "@/types/tmdb/parsed";
import { useTranslation } from "@/lib/i18n";

const Overview = ({ overview }: Pick<MediaDetailsData, "overview">) => {
  const { t } = useTranslation();
  const [shouldTruncate, setShouldTruncate] = React.useState(false);
  const [readMore, setReadMore] = React.useState(false);

  // https://notes.alexkehayias.com/line-clamp-with-react-and-tailwindcss/
  const measuredRef = React.useCallback((node: any) => {
    if (node?.parentElement) {
      const elHeight = node.offsetHeight;
      const styles = window.getComputedStyle(node);
      const lineHeight = styles
        .getPropertyValue("line-height")
        .replace("px", "");
      const elLineCount = elHeight / parseInt(lineHeight, 10);

      setShouldTruncate(elLineCount > 3);
    }
  }, []);

  const shouldClamp = shouldTruncate && !readMore;

  return overview ? (
    <div className="flex flex-col gap-y-2">
      <h3 className="text-lg font-semibold">{t("details.overview")}</h3>
      <p
        ref={measuredRef}
        className={cn("text-white/70 transition-all", {
          "line-clamp-3": shouldClamp,
          "line-clamp-none": !shouldClamp,
        })}
      >
        {overview}
      </p>

      {shouldClamp && (
        <button
          onClick={() => setReadMore(true)}
          className="-mt-2 flex items-center gap-x-1"
        >
          <span className="text-sm font-bold text-white/70">
            {t("details.readMore")}
          </span>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-3 w-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      )}
    </div>
  ) : (
    <></>
  );
};

export default Overview;
