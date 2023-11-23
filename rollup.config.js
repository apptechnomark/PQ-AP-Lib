const babel = require('rollup-plugin-babel');
const typescript = require('rollup-plugin-typescript2');
const postcss = require("rollup-plugin-postcss");
const tailwindcss = require('tailwindcss');

module.exports = {
  input: 'src/index.tsx',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: 'dist/index.es.js',
      format: 'esm',
    },
  ],
  plugins: [
    typescript(
      {
        tsconfig: './tsconfig.json',
      }
    ),
    babel({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-typescript',
      ],
    }),
    postcss({
      plugins: [
        tailwindcss('./tailwind.config.js'),
      ],
      extract: true, 
      minimize: true,
    }),
  ],
  external: ['react'],
};
