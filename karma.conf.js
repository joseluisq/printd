const realBrowser = String(process.env.BROWSER).match(/^(1|true)$/gi)
const localLaunchers = {
    ChromeNoSandboxHeadless: {
        base: "Chrome",
        flags: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
            "--headless",
            "--disable-gpu",
            "--no-gpu",
            // Without a remote debugging port, Google Chrome exits immediately.
            "--remote-debugging-port=9333"
        ]
    }
};

const browsers = realBrowser ? ["Chrome"] : Object.keys(localLaunchers)

module.exports = (config) => {
    const env = process.env["NODE_ENV"] || "development"

    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        plugins: [
            "karma-jasmine",
            "karma-typescript",
            "karma-chrome-launcher",
            "karma-jasmine-html-reporter",
            "karma-spec-reporter"
        ],
        client: {
            // leave Jasmine Spec Runner output visible in browser
            clearContext: false
        },
        files: [{ pattern: "src/**/*.ts" }, { pattern: "test/**/*.spec.ts" }],
        preprocessors: {
            "**/*.ts": ["karma-typescript"],
            "test/**/*.spec.ts": ["karma-typescript"]
        },
        karmaTypescriptConfig: {
            compilerOptions: {
            lib: [
                    "ES2017",
                    "DOM",
                    "ES2015.Generator",
                    "ES2015.Iterable",
                    "ES2015.Promise",
                    "ES2015.Symbol",
                    "ES2015.Symbol.WellKnown",
                    "ESNext.AsyncIterable"
                ]
            }
        },
        reporters: ["progress", "kjhtml"],
        colors: true,
        logLevel: env === "debug" ? config.LOG_DEBUG : config.LOG_INFO,
        autoWatch: true,
        browsers: browsers,
        customLaunchers: localLaunchers,
        singleRun: false
    })
}
