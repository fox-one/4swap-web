export default class Cache {
  cache = {};

  keys: string[] = [];

  max = 20;

  set(key: string, value: unknown) {
    if (this.keys.length > this.max) {
      this.delete(this.keys.shift() || "");
    }
    this.cache[key] = value;
    this.keys.push(key);
  }

  get(key: string) {
    return this.cache[key];
  }

  delete(key: string) {
    key && this.delete(key);
  }

  clear() {
    this.cache = {};
  }

  likeClear(s: string) {
    const keys = Object.keys(this.cache).filter((k) => k.indexOf(s) > -1);
    keys.forEach((k) => this.delete(k));
  }
}
