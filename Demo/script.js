import { Logger } from "./Helpers.js";

// MODULE for retrieving paths/values (to and from)
// pathTo, fromPath are  Symbols, associated with Object.prototype
import { pathTo, fromPath, } from "../Src/PathFinder.js";
// TESTDATA FROM JSON
const testData = await fetch("./Data.json").then(r => r.json());
const log = Logger();
const toCodeCmd = s => `<code class="cmd">${s}</code>`;
const lastGreetingPath = testData[pathTo(`lastGreeting`)];
log(`${ toCodeCmd( `testData[pathTo(\`lastGreeting\`)]`) } =>`, lastGreetingPath);
const yellowPath = testData[pathTo(`yellow`)];
log(`----\n`, `${toCodeCmd(`testData[pathTo(\`yellow\`)]`)} =>`, yellowPath);

log(`\n<b>Retrieving the value from the found path result ${toCodeCmd(`yellowPath.value`)}</b> =>`, yellowPath.value);

log(`\n<b>A search w/o result ${toCodeCmd(`testData[pathTo(\`noDice\`)]`)}</b> =>`, 
    testData[pathTo(`noDice`)]);

log(`\n<b>A search with value null for the existing path ${
      toCodeCmd(`testData[pathTo(\`noName\`)]`)}</b> =>`,
    testData[pathTo(`noName`)]);
    
// testDate is from json, which can not contain undefined values, so set it first for demonstration
testData.data["area"]["CA"].name.isDefined = undefined;
log(`\nAfter ${toCodeCmd(`testData.data.area.CA.name.isDefined = undefined;`)}`);
log(`<b>A search with no value (undefined) for the existing path ${
    toCodeCmd(`testData[pathTo(\`isDefined\`)]`)}</b> =>`, 
      testData[pathTo(`isDefined`)]);

log (`\n<b>Using [fromPath] extension with [pathTo] result</b> `,
     `${toCodeCmd(`testData[fromPath(testData[pathTo(\`yellow\`)].pathFound)]`)} =>`,
     testData[fromPath(testData[pathTo(`yellow`)].pathFound)] );

log(`<h2>No path no glory: only Objects with (at least one) key-value pair(s)</h2>`,
    `...but it won't bite you`);

log(`\n<b>Trying to retrieve path from empty object\n  ${
  toCodeCmd(`{}[pathTo(\`nothing\`)]`)}</b> =>`, 
  Object.create({})[pathTo(`nothing`)]);

log(`\n<b>Trying to retrieve path from some array\n  ${
  toCodeCmd(`[1,2,3,4][pathTo(\`nothing\`)]`)}</b> =>`, 
  [1,2,3,4][pathTo(`2`)]);

const re = /[a-z]/i;

log(`\n<b>Trying to retrieve path from some regular expression (re = ${toCodeCmd(`/[a-z]/i`)})</b>\n ${
  toCodeCmd(`/re[pathTo(\`test\`)]`)} =>`, 
  re[pathTo(`test`)]);

log(`\n<b>${toCodeCmd(`fromPath + pathTo`)} for regular expression (re = ${toCodeCmd(`/[a-z]/i`)})\n  ${
    toCodeCmd(`re[ fromPath( re[ pathTo( \`test\` ) ].pathFound) ]`)}</b> =>`, 
    re[ fromPath( re[pathTo(`test`)].pathFound ) ] );

// clone with new value
log(`<h2>Cloning from the result of testData[pathTo(...)] with new value</h2>`) ;
const testDataWithChangedYellowPathValue = yellowPath.cloneWithNewValue(`${
  yellowPath.value} magically shifted to RED in this testData clone`);

log(`\n<b>Cloned testData with new value for key 'yellow' (declaration =>
  ${toCodeCmd(`const testDataWithChangedYellowPathValue = yellowPath.cloneWithNewValue(\`\${
    yellowPath.value} magically shifted to RED in this testData clone\`)`)})</b>`);

log(`\n<b>Retrieving the value from the found path result in clone\n  ${
    toCodeCmd(`testDataWithChangedYellowPathValue[pathTo(\`yellow\`)]`)}</b> =>`, 
    testDataWithChangedYellowPathValue[pathTo(`yellow`)]);


log(`\n----------\n <b style="color:red">testData</b>\n----------`, testData);
