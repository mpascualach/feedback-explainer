/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  nextConfig,
  publicRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    JSON_RPC_PROVIDER: process.env.JSON_RPC_PROVIDER,
    NEXT_PUBLIC_ENV: process.env.JSON_RPC_PROVIDER,
  },
};
