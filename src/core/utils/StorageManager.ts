
class StorageManager {
  private static _instance: StorageManager;
  private storage: Storage;

  constructor() {
    if(!StorageManager._instance)
    {
      StorageManager._instance = this;
      this.storage = localStorage;
    }
    return StorageManager._instance;
  }

  getJSON(key: string) {
    let data = this.storage.getItem(key);
    return JSON.parse(data);
  }

  setJSON(key: string, data: any) {
    let dataString = JSON.stringify(data);
    this.storage.setItem(key, dataString);
  }

  loadJSON(key: string) {
    let data = this.storage.getItem(key);
    return JSON.parse(data);
  }

  clear() {
    this.storage.clear();
  }
}

export default new StorageManager();