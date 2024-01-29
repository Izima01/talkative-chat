/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: 'izima-cloudinary/image/',
      },
    ],
  },
}

module.exports = {
  
}

module.exports = nextConfig
