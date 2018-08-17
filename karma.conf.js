const realBrowser = String(process.env.BROWSER).match(/^(1|true)$/gi)
const travisLaunchers = {
  chrome_travis: {
    base: 'Chrome',
    flags: ['--no-sandbox']
  }
}

const localBrowsers = realBrowser ? Object.keys(travisLaunchers) : ['Chrome']

module.exports = (config) => {
  const env = process.env['NODE_ENV'] || 'development'

  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    plugins: [
      'karma-jasmine',
      'karma-typescript',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter',
      'karma-spec-reporter'
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [{ pattern: 'src/**/*.ts' }, { pattern: 'test/**/*.spec.ts' }],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
      'test/**/*.spec.ts': ['karma-typescript']
    },
    reporters: ['progress', 'kjhtml'],
    colors: true,
    logLevel: env === 'debug' ? config.LOG_DEBUG : config.LOG_INFO,
    autoWatch: true,
    browsers: localBrowsers,
    singleRun: false
  })
}
