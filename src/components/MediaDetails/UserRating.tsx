import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSession, signIn } from "next-auth/react";
import useSWR from "swr";
import cn from "classnames";
import { fetcher } from "@/utils/util";
import { useTranslation } from "@/lib/i18n";
import { MediaType } from "@/types/general";

type Props = {
  mediaId: number;
  mediaType: `${MediaType}`;
  mediaTitle: string;
  rating: number | null;
  voteCount?: number;
  isReleased: boolean;
};

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
      clipRule="evenodd"
    />
  </svg>
);

const StarOutlineIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
    />
  </svg>
);

const formatVotes = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};

const UserRating: React.FC<Props> = ({
  mediaId,
  mediaType,
  mediaTitle,
  rating,
  voteCount,
  isReleased,
}) => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: userRatingData, mutate } = useSWR<{
    mediaId: number;
    mediaType: string;
    rating: number | null;
  }>(
    session
      ? `/api/rating?mediaType=${mediaType}&mediaId=${mediaId}`
      : null,
    fetcher
  );

  const userRating = userRatingData?.rating ?? null;

  const openModal = () => {
    if (!session) {
      signIn("google");
      return;
    }
    setHovered(null);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  const submitRating = async (newRating: number) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rating", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaType, mediaId, rating: newRating }),
      });
      if (res.ok) {
        await mutate({ mediaId, mediaType, rating: newRating }, false);
        setIsOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeRating = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rating", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaType, mediaId }),
      });
      if (res.ok) {
        await mutate({ mediaId, mediaType, rating: null }, false);
        setIsOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If movie isn't released and has no rating, hide the whole block.
  if (!isReleased && !rating) return null;

  return (
    <>
      <div className="flex items-stretch gap-x-8">
        {/* TMDB / Aggregate rating */}
        {Boolean(rating) && (
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
              {t("rating.imdbRating")}
            </span>
            <div className="mt-1 flex items-center gap-x-1.5">
              <StarIcon className="h-6 w-6 fill-moviyellow" />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold">
                  {rating}
                  <span className="text-sm font-normal text-white/70">
                    &nbsp;{t("rating.outOf")}
                  </span>
                </span>
                {voteCount !== undefined && voteCount > 0 && (
                  <span className="text-xs text-white/60">
                    {t("rating.votes", { count: formatVotes(voteCount) })}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Your rating */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
            {t("rating.yourRating")}
          </span>
          <button
            onClick={openModal}
            className="mt-1 flex items-center gap-x-1.5 text-left transition hover:opacity-80"
          >
            {userRating ? (
              <>
                <StarIcon className="h-6 w-6 fill-blue-400" />
                <div className="flex flex-col leading-tight">
                  <span className="text-lg font-bold text-blue-400">
                    {userRating}
                    <span className="text-sm font-normal text-white/70">
                      &nbsp;{t("rating.outOf")}
                    </span>
                  </span>
                </div>
              </>
            ) : (
              <>
                <StarOutlineIcon className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-semibold text-blue-400">
                  {session ? t("rating.rate") : t("rating.loginToRate")}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rating modal — IMDb-style 10 stars */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          onClose={closeModal}
          className="fixed inset-0 z-50 overflow-y-auto p-4"
        >
          <Transition.Child
            enter="duration-200 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-150 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            className="flex h-full w-full items-center justify-center"
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-150 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative w-full max-w-md overflow-hidden rounded-xl bg-movidark px-6 py-6 shadow-2xl ring-1 ring-white/10">
              <Dialog.Title className="text-center text-base font-semibold text-white/70">
                {t("rating.rateThisOf", { title: mediaTitle })}
              </Dialog.Title>

              {/* Big star showing current selection */}
              <div className="my-4 flex items-center justify-center">
                <div className="relative">
                  <StarIcon className="h-24 w-24 fill-blue-500/90" />
                  <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">
                    {hovered ?? userRating ?? "—"}
                  </span>
                </div>
              </div>

              {/* 10 stars row */}
              <div
                className="mb-4 flex items-center justify-center gap-x-0.5"
                onMouseLeave={() => setHovered(null)}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => {
                  const active =
                    hovered !== null
                      ? value <= hovered
                      : userRating !== null && value <= userRating;
                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={isSubmitting}
                      onMouseEnter={() => setHovered(value)}
                      onClick={() => submitRating(value)}
                      className={cn(
                        "p-0.5 transition disabled:opacity-50",
                        active ? "text-blue-400" : "text-white/30 hover:text-blue-300"
                      )}
                      aria-label={`${value} ${t("rating.outOf")}`}
                    >
                      <StarIcon className="h-7 w-7 fill-current" />
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-x-3 pt-2">
                {userRating ? (
                  <button
                    onClick={removeRating}
                    disabled={isSubmitting}
                    className="text-sm font-semibold text-red-400 hover:underline disabled:opacity-50"
                  >
                    {t("rating.remove")}
                  </button>
                ) : (
                  <span />
                )}
                <button
                  onClick={closeModal}
                  className="text-sm font-semibold text-white/70 hover:text-white"
                >
                  {t("rating.cancel")}
                </button>
              </div>

              <button
                className="absolute right-3 top-3 text-white/60 hover:text-white"
                onClick={closeModal}
                aria-label={t("details.close")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default UserRating;
