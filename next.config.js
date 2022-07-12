// @ts-check

/**
 * @returns {import('next').NextConfig}
 */
module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,

    output: "standalone",

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
