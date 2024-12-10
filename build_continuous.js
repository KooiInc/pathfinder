import * as builder from "esbuild";
import dtFormat from "../DateFormat/index.js";
const log = console.log.bind(console);
const label = `[PathFinder]`;

const buildContext = {
  entryPoints: ['./src/PathFinder.js'],
  bundle: true,
  outfile: './Dist/Pathfinder.min.js',
  treeShaking: true,
  sourcemap: true,
  minify: true,
  format: 'esm',
  target: ['esnext'],
  plugins: [pluginFactory(`Bundled`)],
};

const distro = await builder.context(buildContext);
await distro.watch();

process.on( `exit`, () => distro.dispose());

function onRebuild(errors, buildType)  {
  const now = dtFormat(new Date(), `dd-mm-yyyy hh:mmi:ss`, `l:nl`);
  if (errors.length) {
    return log(`${label} ${buildType}  ${now} -> not ok!`);
  }
  log(`${label} ${buildType} ${now} -> ok`);
}

function pluginFactory(name) {
  return {
    name,
    setup(build) {
      build.onEnd(result => {
        return onRebuild(result.errors, name);
      });
    },
  }
}