/** @type {import('next').NextConfig} **/
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
      preprocess: false,
    },
  },
};

module.exports = nextConfig;
