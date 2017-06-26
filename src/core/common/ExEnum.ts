export function ExEnumDefine(dataMap: any) {
  return function decorator(target: Function) {
    for (let key in dataMap)
    {
      new target.prototype.constructor(key, dataMap[key]);
    }

    // 書き換え不可にする
    Object.freeze(target);
  };
}