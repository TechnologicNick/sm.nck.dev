// @ts-check

/**
 * @returns {import("next").NextConfig}
 */
module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,

    output: "standalone",

    experimental: {
      urlImports: [
        "https://raw.githubusercontent.com/pierrec/node-lz4",
      ],
    },

    webpack: (config) => {
      config.resolve = {
        ...config.resolve,
        fallback: {
          "fs": false,
        },
      }
      return config
    },

    async rewrites() {
      return {
        afterFiles: [
          // These rewrites are checked after pages/public files
          // are checked but before dynamic routes
          {
            source: "/save-editor/:path*",
            destination: "/save-editor",
          },
        ],
      }
    }
  }
}
