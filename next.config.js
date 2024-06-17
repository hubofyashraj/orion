const fs = require('fs');
const path = require('path');

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        https: {
            key: fs.readFileSync(path.resolve(__dirname, '192.168.1.21-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '192.168.1.21.pem')),
        }
    }
}

module.exports = withPWA(
    nextConfig);

