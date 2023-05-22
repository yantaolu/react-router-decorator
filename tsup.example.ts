import { defineConfig } from 'tsup';

export default defineConfig(async (options) => {
  return {
    entry: ['examples/basic/index.tsx'],
    outDir: 'dist',
    sourcemap: false,
    clean: true,
    minify: !options.watch,
    dts: true,
    format: ['iife'],
    target: 'es5',
    treeshake: false,
    define: {
      'process.env.NODE_ENV': options.watch ? JSON.stringify('development') : JSON.stringify('production'),
    },
  };
});
