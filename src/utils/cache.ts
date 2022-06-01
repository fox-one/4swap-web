export function updateCache(cache: string[], value: string) {
  const strCache = cache.map((x) => JSON.stringify(x));
  const strValue = JSON.stringify(value);
  const index = strCache.indexOf(strValue);

  if (index > -1) {
    cache.splice(index, 1);
  }

  if (cache.length >= 20) {
    cache.pop();
  }

  cache.unshift(value);
}
