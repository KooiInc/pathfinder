// noinspection JSUnresolvedFunction,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
// noinspection ES6ShorthandObjectProperty
const builder = require("esbuild");
const dtOpts = {
  ...(`month,day,hour,minute,second`.split(`,`).reduce( (a, v) => ({...a, [v]: `2-digit`}), {} )),
  ...{ year: `numeric`, hour12: false,  timeZone: 'Europe/Amsterdam', } };
const dtFormat = (dt = new Date()) => new Intl.DateTimeFormat(`nl-NL`, dtOpts).format(dt);
builder.build( {
  entryPoints: ['./src/PathFinder.js'],
  bundle: true,
  target: ['esnext'],
  outfile: './Dist/Pathfinder.min.js',
  sourcemap: true,
  minify: true,
  format: 'esm',
  watch: {
    onRebuild(error, _) {
      if (error) {
        console.error(`${dtFormat()} watch build failed:`, error);
      }
      else {
        console.log(`${dtFormat()} watch build ok`);
      }
    }
  }
} )
  .catch((err) => {
      console.log(err.message);
      process.exit(1);
    }
  );