export const assignWith = (object, ...rest) => {
  if (
    rest.length === 0 ||
    (rest.length === 1 && typeof rest[0] === 'function')
  ) {
    return object;
  }
  let customizer = rest[rest.length - 1];
  customizer = typeof customizer === 'function' ? customizer : null;
  const sources = customizer ? rest.slice(0, rest.length - 1) : rest;
  if (!customizer) {
    return Object.assign(object, ...sources);
  } else {
    for (let i = 0; i < sources.length; ++i) {
      const source = sources[i];
      const newSources = Object.keys(source).map(k => {
        return {[k]: customizer(object[k], source[k], k, object, source)};
      });
      Object.assign(object, ...newSources);
    }
    return object;
  }
};

export const castArray = (...args) => {
  if (args.length === 0) {
    return [];
  }
  return Array.isArray(args[0]) ? args[0] : [args[0]];
};

export const mapValues = (obj, mapper) => {
  if (!obj) {
    return obj;
  }
  if (!mapper) {
    return {...obj};
  }
  const parts = Object.keys(obj).map(k => ({[k]: mapper(obj[k], k, obj)}));
  return Object.assign({}, ...parts);
};

export const shallowEqual = (obj1, obj2) => {
  if (obj1 === obj2) {
    return true;
  }
  if (!obj1 || !obj2) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let i = 0; i < keys1.length; ++i) {
    const key = keys1[i];
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
};
