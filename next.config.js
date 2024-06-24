const withPWA = require("next-pwa")({
    dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [{ source: '/api/:path*', headers: [{
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
        }]}]
    },
    reactStrictMode: true,
}

module.exports = withPWA(nextConfig);

