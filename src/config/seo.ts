import { DefaultSeoProps } from "next-seo";

const siteName = "Lumiere";
const title = "Lumiere";
const description = "Lumiere — explore & discover movies and TV shows.";
const keywords = [
  "lumiere",
  "movies",
  "tv shows",
  "explore movies",
  "discover tv shows",
  "фільми",
  "серіали",
];

const seoConfig: DefaultSeoProps = {
  defaultTitle: title,
  titleTemplate: `%s – Lumiere`,
  description: description,
  openGraph: {
    title: title,
    description: description,
    type: "website",
    site_name: siteName,
  },
  additionalMetaTags: [{ name: "keywords", content: keywords.join(",") }],
};

export default seoConfig;
