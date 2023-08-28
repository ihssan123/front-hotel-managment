/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
// next.config.js
module.exports = {
    experimental: {
      reactServerComponents: false,
      reactRoot: true,
    },
    // ...other config settings
  };
  
