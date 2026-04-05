/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep native Node.js modules out of the webpack bundle so they work in API routes
    serverComponentsExternalPackages: ['ws', '@neondatabase/serverless', '@prisma/adapter-neon', 'nodemailer'],
  },
}

export default nextConfig
