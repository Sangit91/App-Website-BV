module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
      useESM: false,
      diagnostics: false,
    }]
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: [
    '**/tests/**/*.test.ts'
  ],
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    'server/services/**/*.ts',
    'server/validators/**/*.ts',
    'server/utils/**/*.ts',
    'server/db/**/*.ts',
    'server/middleware/**/*.ts',
    '!server/generated/**',
    '!server/scripts/**',
    '!**/*.d.ts'
  ],
};