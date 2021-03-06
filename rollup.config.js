import browserSync from 'rollup-plugin-browsersync'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

const pkg = require('./package.json')

const libraryName = 'Demo'

const plugins = [
  // Allow json resolution
  json(),
  // Compile TypeScript files
  typescript({ useTsconfigDeclarationDir: true }),
  // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
  commonjs(),
  // Allow node_modules resolution, so you can use 'external' to control
  // which external modules to include in the bundle
  // https://github.com/rollup/rollup-plugin-node-resolve#usage
  resolve(),

  // Resolve source maps to the original source
  sourceMaps()
]

if (process.env.ROLLUP_PLUGIN === 'browserSync') {
  plugins.push(
    browserSync({
      server: {
        baseDir: './'
      },
      startPath: '/examples',
      files: ['dist/**/*.js', 'examples/**/*'],
      host: '0.0.0.0',
      port: '8080',
      open: false
    })
  )
}

export default {
  input: `src/index.ts`,
  output: [
    { file: pkg.main, name: libraryName, format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**'
  },
  plugins
}
