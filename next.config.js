/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    // next/image does NOT support wildcards in `domains` — they must be exact
    // hostnames. Use remotePatterns for subdomain wildcards instead.
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "**.themoviedb.org" },
      { protocol: "https", hostname: "**.tmdb.org" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
  },
  i18n: {
    locales: ["en", "uk"],
    defaultLocale: "en",
    // Keep default locale URLs without /en prefix.
    // Ukrainian pages will be served at /uk/...
    localeDetection: false,
  },
};
