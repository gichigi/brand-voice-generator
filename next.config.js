/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["placeholder.com", "via.placeholder.com"],
    unoptimized: true,
  },
  // Ensure environment variables are properly exposed
  env: {
    // Add any public environment variables here
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
