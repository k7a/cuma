import ChuniNetAPIRequester from "./ChuniNetAPIRequester"
import {Exception} from "../common/Exception"

class ChuniNetRequestQueue {
  static REQUEST_INTERVAL_MS = 500;
  private static _instance: ChuniNetRequestQueue;
  queue: Promise<any>;
  // state: any;
  requesterMap: Map<string, ChuniNetAPIRequester>;
  private _start: Function;
  private _cancel: Function;
  // private reject: Function;
  
  constructor() {
    if(!ChuniNetRequestQueue._instance)
    {
      ChuniNetRequestQueue._instance = this;
      this.clear();
      // this.queue = Promise.resolve();
      // this.state = {
      //   loadingCount: 0,
      //   error: null
      // };
      // this.reject = null;
      // this.requesterMap = new Map<string, ChuniNetAPIRequester>();
    }
    return ChuniNetRequestQueue._instance;
  }

  get count(): number {
    return this.requesterMap.size;
  }

  add(requester: ChuniNetAPIRequester) {
    let requestKey = requester.key;
    if (this.requesterMap.has(requestKey)) return;
    this.requesterMap.set(requestKey, requester);

    this.queue = this.queue.then(() => {
      return Promise.all([
        new Promise((resolve) => setTimeout(resolve, ChuniNetRequestQueue.REQUEST_INTERVAL_MS)),
        new Promise((resolve, reject) => {
          // this.reject = reject;
          requester.send();
          requester.then(
            // resolved
            (response) => {
              this.requesterMap.delete(requestKey);
              resolve(response);
            },
            // rejected
            (error: any) => {
              console.log(error);
              this.stop();
              reject();
              // if (this.reject !== null)
              // {
              //   this.reject(error);
              //   this.reject = null;
              // }
              // if (this.onError !== null) this.onError(error);
            }
          );
        })
      ]);
    });
  }

  start() {
    this._start();
  }

  retry() {
    if (this.count === 0) {
      this.start();
      return;
    }

    let requesterMap = this.requesterMap;
    this.clear();
    for (let requester of requesterMap.values())
    {
      this.add(requester);
    }
    this.start();
  }

  stop() {
    this.queue = new Promise((resolve, reject) => {
      this._start = resolve;
      this._cancel = reject;
    });
  }

  clear() {
    this.stop();
    // this.reject = null;
    this.requesterMap = new Map<string, ChuniNetAPIRequester>();
  }

  // break(error: any = undefined) {
  //   if (this.reject !== null)
  //   {
  //     this.reject(error);
  //     this.reject = null;
  //   }
  // }
}

export default new ChuniNetRequestQueue();