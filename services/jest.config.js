// Load dotenv config
const dotenv = require("dotenv");
dotenv.config({
    path: "./__tests__/.tests.env"
});

module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$",
    coverageDirectory: "coverage",
    collectCoverageFrom: ["./src/**/*.{ts,tsx,js,jsx}", "!src/**/*.d.ts"],
    moduleNameMapper: {
        "^api/(.*)$": "<rootDir>/src/api/$1"
    },
    modulePathIgnorePatterns: ["/dist/*"]
};
