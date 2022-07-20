// jest.config.js
const nextJest = require('next/jest')
const { jsWithTsESM: tsjPreset } = require('ts-jest/presets')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',

  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)",
  ],

  // Required to fix jest issue when BigInts are sent between workers in a failing test
  // https://github.com/facebook/jest/issues/11617
  // maxWorkers: 1,

  transform: {
    ...tsjPreset.transform,
  },
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
