export class Exception {
  message: any;
  name: string;
  
  constructor(message: any, name: string) {
    this.message = message;
    this.name = name;
  }
}

export namespace Exception {
  export class NetworkError extends Exception {
    constructor(message: any) {
      super(message, "NetworkError");
    }
  }

  export class ChuniNetSessionNotFound extends Exception {
    constructor(message: any) {
      super(message, "ChuniNetSessionNotFound");
    }
  }

  export class ChuniNetSessionDisconnected extends Exception {
    constructor(message: any) {
      super(message, "ChuniNetSessionDisconnected");
    }
  }

  export class ChuniNetLoginError extends Exception {
    constructor(message: any) {
      super(message, "ChuniNetLoginError");
    }
  }

  export class ErrorResponse extends Exception {
    constructor(message: any) {
      super(message, "ErrorResponse");
    }
  }

  export class MusicNotFound extends Exception {
    constructor(message: any) {
      super(message, "MusicNotFound");
    }
  }
}