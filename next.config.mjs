/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['deccan-furniture.s3.ap-south-2.amazonaws.com'],
      },
    experimental: {
        missingSuspenseWithCSRBailout: false,
      },
};

export default nextConfig;
