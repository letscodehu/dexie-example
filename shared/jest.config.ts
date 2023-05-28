import type { Config } from 'jest';
const config: Config = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: 'node',
    modulePathIgnorePatterns: ["dist/"]
};

export default config;
