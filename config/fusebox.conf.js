const path = require('path')

const {
  FuseBox,
  WebIndexPlugin,
  SassPlugin,
  CSSPlugin,
  CSSResourcePlugin,
  TerserPlugin,
  QuantumPlugin
} = require('fuse-box')
const { task, context } = require('fuse-box/sparky')

const isProduction = process.env['NODE_ENV'] === 'production'

// Settings
const output = path.resolve('./dist/$name.js')
const template = path.resolve('./public/index.html')
const homeDir = path.resolve('./public')

context(class {
  getConfig() {
    return FuseBox.init({
      homeDir,
      output,
      hash: isProduction,
      sourceMaps: !isProduction,
      target: 'browser',
      plugins: [
        WebIndexPlugin({
          template
        }),
        [
          SassPlugin(),
          CSSResourcePlugin(),
          CSSPlugin()
        ],

        isProduction && TerserPlugin({
          compress: true,
          mangle: true,
          toplevel: true
        }),
        isProduction && QuantumPlugin({
          bakeApiIntoBundle: 'app',
          css: { clean: true },
          extendServerImport: true
        })
      ]
    })
  }

  createBundle(fuse) {
    const app = fuse.bundle('app')

    app.instructions('>index.ts')

    if (!isProduction) {
      app.watch()
      app.hmr({ reload: true })
    }

    return app
  }
})

task('default', async (context) => {
  const fuse = context.getConfig()

  fuse.dev()
  context.createBundle(fuse)
  await fuse.run()
})

task('dist', async (context) => {
  context.isProduction = true
  const fuse = context.getConfig()

  context.createBundle(fuse)
  await fuse.run()
})
