import { MediaDetailsData } from "@/types/tmdb/parsed";
import { useTranslation } from "@/lib/i18n";

const Properties = ({
  creator,
  director,
}: Pick<MediaDetailsData, "creator" | "director">) => {
  const { t } = useTranslation();
  return (
    <div className="flex max-w-lg justify-between">
      {Boolean(creator) && (
        <div className="flex-1">
          <h3 className="block font-bold">{t("details.creator")}</h3>
          <span className="block text-white/70">{creator}</span>
        </div>
      )}

      {Boolean(director) && (
        <div className="flex-1">
          <h3 className="block font-bold">{t("details.director")}</h3>
          <span className="block text-white/70">{director}</span>
        </div>
      )}
    </div>
  );
};

export default Properties;
