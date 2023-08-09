declare global {
  // eslint-disable-next-line no-var
  var services: Map<string, any>;
}

global.services ??= new Map();

const asGlobalService = <R>(fn: () => R, key: string): R => {
  if (global.services.has(key)) {
    return global.services.get(key);
  }

  const service = fn();
  global.services.set(key, service);

  return service;
}

export default asGlobalService;
