const defaultConfig = {
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coverageReporters: [
        "text",
        "lcov",
    ],

    coverageThreshold: {
        global: {
            branch: 100,
            function: 100,
            lines: 100,
            statements: 100,
        }
    },
    maxWorkers: "50%",
    watchPathIgnorePatterns: [
        "node_modules"
    ],
    transformIgnorePatterns: [
        "node_modules"
    ]
}

export default {
    project: [
        {
            ...defaultConfig,
            testEnvironment: "node",
            displayName: "backend",
            collectCoverageFrom: [
                "server/",
                "!server/index.js",
            ],
            transformIgnorePatterns: [
                ...defaultConfig.transformIgnorePatterns,
                "public"
            ],

            testMatch: [
                "**/test/**/server/**/*.test.js"
            ]

        },

        {
            ...defaultConfig,
            testEnvironment: "jsdom",
            displayName: "frontend",
            collectCoverageFrom: [
                "public/",

            ],
            transformIgnorePatterns: [
                ...defaultConfig.transformIgnorePatterns,
                "server"
            ],

            testMatch: [
                "**/test/**/public/**/*.test.js"
            ]

        }
    ]
}