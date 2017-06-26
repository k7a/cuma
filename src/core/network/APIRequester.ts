import "whatwg-fetch"
import {Exception} from "../common/Exception"

export default class APIRequester implements PromiseLike<any> {
  endpoint: string;
  data: Object;
  method: string;
  responseType: string;
  private promise: Promise<any>;
  private resolve: Function;
  private reject: Function;

  constructor(params: {endpoint: string, data?: any, method?: "GET" | "POST", responseType?: string}) {
    this.endpoint = params.endpoint;
    this.data = params.data || {};
    this.method = params.method || "GET";
    this.responseType = params.responseType || "json";
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  get key() {
    return Object.keys(this.data).map((key) => `${key}:${this.data[key]}`).join();
  }

  send() {
    fetch(this.endpoint, {
        method: this.method,
        body: this.method === "POST" && this.data ? JSON.stringify(this.data) : undefined
        // mode: "no-cors"
        // credentials: "include"
      }).then((response: Response) => {
        if (response.status < 200 || response.status >= 300) throw new Exception.ErrorResponse(response);
        let parseResponsePromise: Promise<any>;
        switch (this.responseType)
        {
          case "json":
            parseResponsePromise = response.json();
            break;
        }
        parseResponsePromise.then(parsedResponse => this.onResponse(parsedResponse));
      },
      (error: any) => {
        console.log(error);
        this.onError(error);
        throw new Exception.NetworkError(error);
    });
  }

  onResponse(response: any) {
    this.resolve(response);
  }

  onError(error) {
    this.reject(error);
  }

  then(onResponseCallback: Function, onErrorCallback: Function = null) {
    return this.promise.then(response => onResponseCallback(response), error => onErrorCallback && onErrorCallback(error));
  }
}