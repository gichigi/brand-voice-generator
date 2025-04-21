/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000', 'voiceforge.vercel.app', 'pinchoir.vercel.app'],
    },
  },
  // Configure serverless functions timeout
  serverRuntimeConfig: {
    // Will only be available on the server side
    PROJECT_ROOT: __dirname,
  },
  // This is the key configuration for Vercel serverless functions
  functions: {
    // Increase the timeout for all serverless functions
    "api/*": {
      maxDuration: 60, // 60 seconds for Hobby plan, up to 900 seconds for Pro plan
    },
    "app/**/*": {
      maxDuration: 60, // 60 seconds for Hobby plan, up to 900 seconds for Pro plan
    }
  },
  // Add these required fields
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["placeholder.com", "via.placeholder.com", "kzmn7rdurk60g8xi6aga.lite.vusercontent.net"],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add this to help with hydration issues
  compiler: {
    styledComponents: true,
  }
}

export default nextConfig
