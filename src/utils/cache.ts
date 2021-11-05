export function updateCache(cache: string[], value: string) {
  const index = cache.indexOf(value);

  if (index > -1) {
    cache.splice(index, 1);
  }

  if (cache.length >= 20) {
    cache.pop();
  }

  cache.unshift(value);
}
