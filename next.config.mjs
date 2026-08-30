/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

if (!process.env.VERCEL) {
  nextConfig.output = 'standalone';
}

export default nextConfig;
