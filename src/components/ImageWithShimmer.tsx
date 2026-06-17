import Image from "next/future/image";
import React from "react";

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const ImageWithShimmer = (props: React.ComponentProps<typeof Image>) => {
  // Data-URI sources (e.g. the generated initials-gradient SVG) must not use
  // the blur placeholder — next/future/image can fail to paint them otherwise.
  const isDataUri =
    typeof props.src === "string" && props.src.startsWith("data:");

  if (isDataUri) {
    // eslint-disable-next-line
    return <Image {...props} />;
  }

  return (
    // eslint-disable-next-line
    <Image
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(
        shimmer(Number(props.width), Number(props.height))
      )}`}
      {...props}
    />
  );
};

export default ImageWithShimmer;
