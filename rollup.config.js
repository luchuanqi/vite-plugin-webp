import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { name, version, author } from './package.json';
import process from 'process';

const isDev = process.env.NODE_ENV === 'development';

const banner =
    `${'/*!\n' + ' * '}${name} v${version}\n` +
    ` * (c) ${new Date()} ${author}\n` +
    ` * Released under the MIT License.\n` +
    ` */`;

const commonPlugins = [
  cleanup(),
  typescript({
    include: ['src/**/*.ts', 'src/*.ts'],
    tsconfigOverride: {
      compilerOptions: {
        // 开发环境不生成 *.d.ts
        declaration: !isDev,
      },
    },
  }),
  json(),
  nodeResolve(),
  commonjs()
];
const devPlugins = [];
const prodPlugins = [];
const plugins = isDev ? commonPlugins.concat(devPlugins) : commonPlugins.concat(prodPlugins);
export default [
  {
    input: 'src/main.ts',
    output: [
      {
        file: `lib/${name}.js`,
        format: 'cjs',
        name,
        banner
      },
      {
        file: `lib/${name}.min.js`,
        format: 'cjs',
        banner,
        plugins: [terser()]
      },
      {
        file: `lib/${name}.esm.js`,
        format: 'esm',
        banner
      }
    ],
    external: ['sharp', 'cssjson'],
    plugins
  },
];
