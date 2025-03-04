import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  target: 'es2020',
  clean: true,
  sourcemap: true,
  minify: 'terser',
  dts: true,
  external: [
    'commander',
    'chalk',
    'fs-extra',
    'inquirer',
    'ora',
    'child_process',
    'path'
  ],
  loader: {
    '.ejs': 'text'
  }
});
