import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  // preset: "ts-jest/presets/default-esm",
  // testEnvironment: "node",
  // testMatch: ["**/src/**/*.test.ts"],
  // rootDir: ".",
  // moduleDirectories: ["node_modules", "src"],
  // modulePaths: ["<rootDir>/src"],
  // testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
  // extensionsToTreatAsEsm: [".ts"],
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  // Use the ESM module system
  moduleFileExtensions: ["js", "mjs", "ts"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|mjs|ts)$"],
  testMatch: ["<rootDir>/src/**/*.test.ts"],
};

export default jestConfig;
