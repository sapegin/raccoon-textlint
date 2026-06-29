import { builtinModules } from 'node:module';
import esbuild from 'esbuild';

const context = await esbuild.context({
  entryPoints: ['index.ts'],
  outfile: 'index.js',
  bundle: true,
  external: [
    ...builtinModules,
    '@textlint/ast-node-types',
    '@textlint/types',
    'textlint-rule-helper',
  ],
  platform: 'node',
  format: 'esm',
  target: 'esnext',
  logLevel: 'info',
  sourcemap: false,
  treeShaking: true,
  minify: false,
});

await context.rebuild();
// eslint-disable-next-line unicorn/no-process-exit
process.exit(0);
