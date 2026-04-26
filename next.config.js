/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ["*.themoviedb.org", "*.tmdb.org", "*.googleusercontent.com"],
  },
  i18n: {
    locales: ["en", "uk"],
    defaultLocale: "en",
    // Keep default locale URLs without /en prefix.
    // Ukrainian pages will be served at /uk/...
    localeDetection: false,
  },
};
