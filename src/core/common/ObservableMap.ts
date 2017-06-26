import * as Vue from "vue"

export default class ObservableMap<TKey extends (number | string), TValue> {
  constructor() {
  }
  
  set(key: TKey, item: TValue) {
    Vue.set(this, key.toString(), item);
  }

  get(key: TKey) {
    return this[key.toString()];
  }

  delete(key: TKey) {
    Vue.delete(this, key.toString());
  }

  clear() {
    for (let key of this.keys())
    {
      Vue.delete(this, key);
    }
  }

  hasKey(key: TKey) {
    return this.get(key) !== undefined;
  }

  keys(): string[] {
    return Object.keys(this);
  }

  get values(): TValue[] {
    console.log("ObservableMap#values");
    return Object.keys(this).map(key => this[key]);
  }

  [Symbol.iterator]() {
    return Object.keys(this).map(key => [key, this[key]]);
  }
}