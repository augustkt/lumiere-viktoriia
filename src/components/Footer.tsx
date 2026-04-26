import { useTranslation } from "@/lib/i18n";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="container mx-auto mt-auto flex flex-col items-center justify-center p-4 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-y-2 text-xs text-white/60">
        <span className="font-semibold tracking-wider">
          © {new Date().getFullYear()} Lumiere
        </span>
        <span>
          {t("footer.dataBy")}{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            {t("footer.tmdb")}
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
