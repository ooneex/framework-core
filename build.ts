Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  splitting: false,
  minify: false,
  format: 'esm',
  target: 'bun',
});
