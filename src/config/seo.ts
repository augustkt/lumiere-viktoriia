import { DefaultSeoProps } from "next-seo";

const siteName = "next-Lumiere";
const title = "Lumiere";
const description = "Lumiere, explore & discover movies and TV shows.";
const keywords = [
  "next-Lumiere",
  "movies",
  "tv",
  "explore movies",
  "discover tv shows",
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
