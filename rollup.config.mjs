import path from 'node:path';
import { builtinModules } from 'node:module';

import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

import pkg from './package.json' with { type: 'json' };

const externalPackages = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]);

const builtinExternals = new Set([
  ...builtinModules,
  ...builtinModules.map((moduleName) => `node:${moduleName}`),
]);

const isExternal = (id) => {
  if (builtinExternals.has(id)) {
    return true;
  }

  return Array.from(externalPackages).some(
    (packageName) => id === packageName || id.startsWith(`${packageName}/`),
  );
};

export default [
  {
    input: 'src/index.ts',
    external: isExternal,
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        exports: 'named',
      },
      {
        file: 'dist/index.mjs',
        format: 'es',
      },
    ],
    plugins: [
      typescript({
        tsconfig: path.resolve('tsconfig.build.json'),
        declaration: false,
        declarationMap: false,
        sourceMap: false,
      }),
    ],
  },
  {
    input: 'src/index.ts',
    external: isExternal,
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        tsconfig: path.resolve('tsconfig.build.json'),
      }),
    ],
  },
];
