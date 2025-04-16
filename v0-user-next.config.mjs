/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Increase the timeout for server actions to 60 seconds (maximum for Hobby plan)
      // or 900 seconds (15 minutes) for Pro plan
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000', 'voiceforge.vercel.app'],
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
}

export default nextConfig
