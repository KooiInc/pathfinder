const addMethod2Prototype = await import("//kooiinc.github.io/ProtoXT/protoxt.js").then(r => `default` in r ? r.default : r);
const cleanPath = path => /^[/.]/.test(path) ? path.slice(1) : path;
const splitPath = path => (cleanPath(path)).split(/[/.]/);
const isObj = o => Object.getPrototypeOf(o || 0).constructor === Object;
const checkArray = (shouldCheck, value) => shouldCheck && Array.isArray(value) && !!value.find(v => v.constructor && v.constructor === Object);
const noValue = `no value (undefined)`;
const invObj = `None. Invalid Object instance`;
const yn = addMethod2Prototype(Boolean, function() { return !this.valueOf() ? `NO` : `YES`; } );
const createReturnValue = (path = `n/a`, exists = false[yn], value = noValue) => ({searchPath: path, exists: exists[yn], value});
const validObj = obj => !Array.isArray(obj) && Object.keys(obj).length;
const extTo = (me, key) => validObj(me) && findPathForKey(me, key) || { searchKey: key, pathFound: invObj, value: `n/a`};
const extFrom = (me, path) => validObj(me) && getValueFromPath(me, path) || createReturnValue(path, false, `n/a`);
const pathTo = addMethod2Prototype(Object, extTo);
const fromPath = addMethod2Prototype(Object, extFrom)

export { pathTo, fromPath, };

function getValueFromPath( object2Search, pathString, searchArraysForPathInObjects = false, returnFoundObjectFromArrayIfPathFoundWithin = false ) {
  const iPath = splitPath(pathString);
  const exists = currentObj => {
    const current = iPath.shift();

    if (checkArray(searchArraysForPathInObjects, currentObj[current])) {
      const retrievedFromArray = currentObj[current]
        .find(v => getValueFromPath(v, iPath.join("/"), 1).exists);

      return retrievedFromArray
        ? returnFoundObjectFromArrayIfPathFoundWithin
          ? createReturnValue(pathString, true, retrievedFromArray)
          : getValueFromPath(retrievedFromArray, iPath.join("/"), 1)
        : createReturnValue(pathString, false);
    }

    return Object.hasOwn(currentObj, current) && iPath.length
      ? exists(currentObj[current])
      : { ...createReturnValue(pathString, current in currentObj, currentObj[current]),
        setValue: value => currentObj[current] = value };
  };

  if (checkArray(searchArraysForPathInObjects, object2Search)) {
    object2Search = {root: object2Search};
  }
  return exists(object2Search);
}

function findPathForKey(initialObj, key) {
  let result = {
    searchKey: key,
    pathFound: false[yn],
  };

  function loop(obj, key, path = ``) {
    for (let k of Object.keys(obj)) {
      if (k !== key && isObj(obj[k])) {
        loop( obj[k], key, `${path}.${k}` );
      }

      if (k === key) {
        result.pathFound = `${path}.${key}`.replace(/^\./, ``);
        result.value = obj[k] === undefined && noValue || obj[k];
        result.cloneWithNewValue = value => {
          const cloned = window[`structuredClone`]
            ? window[`structuredClone`](initialObj) : JSON.parse(JSON.stringify(initialObj));
          const currentValue = getValueFromPath(cloned, result.pathFound);

          if (Object.hasOwn(currentValue, `setValue`)) {
            currentValue.setValue(value); // Note: by reference
          }

          return cloned;
        };

        break;
      }
    }

    if (!Object.hasOwn(result, `value`)) { result.value = `No path for key '${key}'`; }

    return result;
  }

  return loop(initialObj, key);
}