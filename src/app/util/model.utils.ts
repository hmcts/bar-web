export function traverseJson(json: any, propName = '', apply: Function, converted = {}) {
  json = propName ? json[propName] : json;
  if (json instanceof Object) {
      Object.keys(json).forEach((key, index) => {
          if (Array.isArray(json) && Object.keys(converted).length === 0 && converted.constructor === Object) {
              converted = [];
          }
          converted[key] = traverseJson(json, key, apply, converted[key]);
      });
      return converted;
  } else {
      return apply(json, propName);
  }
}

export function convertPenceToPound(json: any, propName = '') {
  return traverseJson(json, propName, (value, key: string) => {
    if (key.toLowerCase().includes('amount')) {
      return value ? value / 100 : value;
    } else {
      return value;
    }
  });
}

export function convertPoundToPence(json: any, propName = '') {
  return traverseJson(json, propName, (value, key: string) => {
    if (key.toLowerCase().includes('amount')) {
      return value ? value * 100 : value;
    } else {
      return value;
    }
  });
}
