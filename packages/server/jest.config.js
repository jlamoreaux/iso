module.exports = {
  rootDir: "../../",
  roots: ["<rootDir>/packages/server/src"],
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      { tsconfig: "<rootDir>/packages/server/tsconfig.json", diagnostics: false },
    ],
  },
  testMatch: ["**/*.test.js"],
  testEnvironment: "node",
  // testRegex: './src/.*\\.(test|spec)?\\.(ts|ts)$',
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
