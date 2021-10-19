export function updateCache(cache: string[], value: string) {
  const index = cache.indexOf(value);

  if (index > -1) {
    cache.splice(index, 1);
  } else if (cache.length >= 20) {
    cache.shift();
  }

  cache.push(value);
}
