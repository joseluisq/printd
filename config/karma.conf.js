const TS_SOURCE = '../source/**/*'
const TS_TEST = '../test/**/*.spec.*'

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
    files: [
      { pattern: TS_SOURCE },
      { pattern: TS_TEST }
    ],
    preprocessors: {
      [TS_SOURCE]: ['karma-typescript'],
      [TS_TEST]: ['karma-typescript']
    },
    karmaTypescriptConfig: {
      include: [
        TS_SOURCE,
        TS_TEST
      ],
      exclude: [
        'dist',
        'node_modules'
      ],
      compilerOptions: {
        lib: [
          'es2017',
          'dom',
          'es2015.generator',
          'es2015.iterable',
          'es2015.promise',
          'es2015.symbol',
          'es2015.symbol.wellknown',
          'esnext.asynciterable'
        ]
      }
    },
    reporters: ['progress', 'kjhtml'],
    colors: true,
    logLevel: env === 'debug' ? config.LOG_DEBUG : config.LOG_INFO,
    autoWatch: true,
    browsers: localBrowsers,
    singleRun: false
  })
}
