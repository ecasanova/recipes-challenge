/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: { appDir: true },
  images: {
    domains: ['127.0.0.1', 'localhost', '127.0.0.1:3005', 'localhost:3005'],
  },
};

module.exports = nextConfig;
