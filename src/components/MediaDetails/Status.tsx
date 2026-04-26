import { MediaDetailsData } from "@/types/tmdb/parsed";
import { useTranslation } from "@/lib/i18n";

const Status = ({
  isEnded,
  isReleased,
}: Pick<MediaDetailsData, "isEnded" | "isReleased">) => {
  const { t } = useTranslation();
  return (
    <span className="rounded-md border-2 px-2 uppercase text-white/70">
      {isEnded
        ? t("status.ended")
        : isReleased
        ? t("status.onAir")
        : t("status.comingSoon")}
    </span>
  );
};

export default Status;
