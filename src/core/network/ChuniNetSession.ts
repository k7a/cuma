import APIRequester from "./APIRequester"
import ChuniNetRequestQueue from "./ChuniNetRequestQueue"
import {Exception} from "../common/Exception"
import App from "../../components/App"
import ChuniNetSessionState from "./ChuniNetSessionState"

class ChuniNetSession {
  CHUNINET_URL = "https://chunithm-net.com/";

  private static _instance: ChuniNetSession;
  private _userId: number;
  private userIdList: number[];
  private _loginPromise: Promise<number>;
  private _resolveLogin: Function;
  private _cancelLogin: Function;
  state: ChuniNetSessionState;

  constructor() {
    if(!ChuniNetSession._instance)
    {
      ChuniNetSession._instance = this;
      this.clear();
      // this._userId = null;
      // this.loginPromise = new Promise<number>((resolve, reject) => {
      //   this._resolveLogin = resolve;
      //   this._cancelLogin = reject;
      // });
      // this.state = new ChuniNetSessionState();
    }
    return ChuniNetSession._instance;
  }

  get loginPromise(): Promise<number> {
    if (this.userId === null)
    {
      this.state.isNotReady();
      this.openLoginModal();
    }
    return this._loginPromise;
  }

  set loginPromise(value) {
    this._loginPromise = value;
  }

  get userId() {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  confirm() {
    if (this.state.isReady) return;
    else
    {
      this.state.isNotReady();
      this.openLoginModal();
      return;
    }
  }

  // Endpoint: /Login/SegaIdLoginApi
  // params: {segaId, password}
  // response: ChuniNetLoginResponse
  // {
  //   length: int,
  //   sessionIdList: [
  //     aime1sessionId,
  //     aime2sessionId,
  //     ...
  //   ]
  // }
  sendLoginRequest(segaId: string, password: string) {
    this.state.reset();
    let requester = new APIRequester({
        endpoint: this.CHUNINET_URL + "Login/SegaIdLoginApi",
        data: {segaId: segaId, password: password},
        method: "POST"
      });
      requester.then((response: ChuniNetLoginResponse) => {
        if (response.sessionIdList[0] === undefined)
        {
          let error = new Exception.ChuniNetLoginError("ログインに失敗しました")
          this.onLoginFailed(error);
          throw error;
        }
        this.onLoginSuccess(response);
      });
      requester.send();
      return requester;
  }

  clear() {
    this.userId = null;
    this.userIdList = null;
    this.state = new ChuniNetSessionState();
    this.loginPromise = new Promise<number>((resolve, reject) => {
      this._resolveLogin = resolve;
      this._cancelLogin = reject;
    });
  }

  onDisconnected(error) {
    this.clear();
    this.state.disconnected(error);
    this.openLoginModal();
  }

  private onLoginSuccess(response: ChuniNetLoginResponse) {
    this.state.success();
    this.userIdList = response.sessionIdList;
    if (response.sessionIdList.length > 1) this.showSelectAimeDialog();
    else this.selectAime(0);
  }

  private onLoginFailed(error) {
    this.clear();
    this.state.failed(error);
  }
  
  private selectAime(aimeId: number) {
    this.userId = this.userIdList[aimeId];
    this._resolveLogin();
    // this.closeLoginModal();
    ChuniNetRequestQueue.retry();
  }

  private openLoginModal() {
    App.openLoginModal();
  }

  // private closeLoginModal() {
  //   App.closeLoginModal();
  // }

  private showSelectAimeDialog() {

  }
}
export default new ChuniNetSession();

interface ChuniNetLoginResponse {
  length: number;
  sessionIdList: number[];
}
