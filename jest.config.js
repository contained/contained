module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverageFrom: [
    'src/**'
  ],
  testPathIgnorePatterns: ['test/fixtures/.*/.*?/'],
  moduleFileExtensions: ['js', 'mjs', 'json'],
  moduleNameMapper: {
    '\.containedrc': '<rootDir>/test/fixtures/config/.containedrc'
  },
  expand: true,
  forceExit: true,
  verbose: true
}
