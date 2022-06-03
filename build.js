// noinspection JSUnresolvedFunction,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
// noinspection ES6ShorthandObjectProperty
const builder = require("esbuild");

builder.build( {
  entryPoints: ['./src/PathFinder.js'],
  bundle: true,
  target: ['esnext'],
  outfile: './Dist/Pathfinder.min.js',
  sourcemap: true,
  minify: true,
  format: 'esm',
} ).catch((err) => {
  console.log(err.message);
  process.exit(1);
} );