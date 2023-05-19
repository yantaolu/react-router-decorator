import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/index.tsx'],
    outDir: 'lib',
    sourcemap: false,
    clean: true,
    minify: !options.watch,
    dts: true,
    format: ['esm', 'cjs'],
    target: 'es5',
    treeshake: false,
  };
});
