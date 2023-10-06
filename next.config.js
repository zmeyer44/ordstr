/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/.well-known/nostr.json",
        destination: "/api/well-known",
      },
    ];
  },
};

module.exports = nextConfig;
