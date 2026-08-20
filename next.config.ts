import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: [
        'http://localhost:3000',
        '10.144.245.*',
        'https://learninghub24-frontend.vercel.app',
        'https://learninghub24-frontend-c24102kuu-celestial-weavers-projects.vercel.app',
        'https://learninghub24-backend-server.vercel.app'
    ],
};

export default nextConfig;