import { name } from "./package.json";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/index.ts',
  name,
  output: {
    file: `./${name}.umd.min.js`,
    format: 'umd',
    sourcemap: false,
    exports: 'named'
  },
  plugins: [
    typescript(),
    terser()
  ],
  onwarn
}

function onwarn(message) {
  const suppressed = ['UNRESOLVED_IMPORT', 'THIS_IS_UNDEFINED']

  if (!suppressed.find((code) => message.code === code)) {
    return console.warn(message.message)
  }
}
