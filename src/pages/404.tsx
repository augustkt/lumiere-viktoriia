import Header from "@/components/Header";
import { useTranslation } from "@/lib/i18n";

export default function Error404() {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <div className="flex h-screen">
        <div className="m-auto">
          <div className="-mt-20">
            <span className="text-xl font-light">{t("errors.notFound")}</span>
          </div>
        </div>
      </div>
    </>
  );
}
