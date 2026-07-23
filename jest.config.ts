import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Path to your Next.js app so next/jest can load next.config.ts and .env files
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Run jest.setup.ts before each test suite so custom matchers like
  // toBeInTheDocument() are available in every test file.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Collect tests only from the __tests__ directory at the project root
  testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],
}

// createJestConfig is exported this way so next/jest can load the async Next.js config
export default createJestConfig(config)
