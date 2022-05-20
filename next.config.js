module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,

    experimental: {
      outputStandalone: true,
    },

    webpack: (config) => {
      config.resolve = {
        ...config.resolve,
        fallback: {
          "fs": false,
        }
      }
      return config
    },
  }
}
