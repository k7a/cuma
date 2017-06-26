export default class ChuniNetSessionState {
  isReady: boolean;
  msgLevel: MessageLevel;
  message: string;

  constructor() {
    this.reset();
  }

  success() {
    this.reset();
    this.isReady = true;
  }

  isNotReady() {
    this.msgLevel = MessageLevel.Warn;
    this.message = "ログインしてください";
  }

  failed(error) {
    this.isReady = false;
    this.msgLevel = MessageLevel.Error;
    this.message = error.message;
  }

  disconnected(error) {
    this.isReady = false;
    this.msgLevel = MessageLevel.Warn;
    this.message = error.message;
  }

  reset() {
    this.isReady = false;
    this.msgLevel = MessageLevel.None;
    this.message = null;
  }
}

enum MessageLevel {
  None = 0,
  Info = 1,
  Warn = 2,
  Error = 3
}