// @ts-check

/**
 * @returns {import("next").NextConfig}
 */
module.exports = (phase, { defaultConfig }) => {
  return {
    output: "standalone",
    productionBrowserSourceMaps: true,
    compress: false, // Offload gzip compression to nginx

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
  }
}
