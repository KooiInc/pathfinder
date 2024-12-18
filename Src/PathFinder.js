const cleanPath = path => /^[/.]/.test(path) ? path.slice(1) : path;
const splitPath = path => (cleanPath(path)).split(/[/.]/);
const isObj = o => Object.getPrototypeOf(o || 0).constructor === Object;
const checkArray = (shouldCheck, value) => shouldCheck && Array.isArray(value) && !!value.find(v => v.constructor && v.constructor === Object);
const noValue = `no value (undefined)`;
const invObj = `None. Object instance not suitable`;
const createReturnValue = (path = `n/a`, exists = false[yn], value = noValue) => ({searchPath: path, exists: exists[yn], value});
const validObj = obj => !Array.isArray(obj) && Object.keys(obj).length;
const { pathTo, fromPath, yn } = extendSymbolic();

export { pathTo, fromPath };

function extendSymbolic() {
  Symbol.to =Symbol.for(`pathTo`);
  Symbol.from =Symbol.for(`pathFrom`);
  Symbol.yn = Symbol.for(`yn`)
  
  Object.defineProperties(Boolean.prototype, {
    [Symbol.yn]: { value: yn, enumerable: false, },
  })
  
  Object.defineProperties(Object.prototype, {
    [Symbol.to]: { value: function(key) { return extTo(this, key); }, enumerable: false },
    [Symbol.from]: { value: function(key) { return extFrom(this, key); }, enumerable: false },
  });
  
  return { pathTo: Symbol.to, fromPath: Symbol.from, yn: Symbol.yn };
  
  function extTo(target, key) {
    return validObj(target) && findPathForKey(target, key) || {
      searchKey: key,
      pathFound: invObj,
      value: `n/a`
    };
  }
  
  function extFrom(target, path) {
    return validObj(target) && getValueFromPath(target, path) || createReturnValue(path, false, `n/a`);
  }
  
  function yn() { return !this.valueOf() ? `NO` : `YES`; }
}

function getValueFromPath(
    object2Search,
    pathString,
    searchArraysForPathInObjects = false,
    returnFoundObjectFromArrayIfPathFoundWithin = false ) {
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