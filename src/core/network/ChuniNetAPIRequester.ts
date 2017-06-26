import APIRequester from "./APIRequester"
import Difficulty from "../model/Difficulty"
// import Consts from "../model/Consts"
import ChuniNetSession from "./ChuniNetSession"
import ChuniNetRequestQueue from "./ChuniNetRequestQueue"
import {Exception} from "../common/Exception"

export default class ChuniNetAPIRequester extends APIRequester {
  static BASE_URL = ChuniNetSession.CHUNINET_URL + "ChuniNet/";

  constructor(apiName: string, data: any) {
    super({
      endpoint: ChuniNetAPIRequester.BASE_URL + apiName,
      data: data,
      method: "POST",
      responseType: "json"
    });
  }

  get key() {
    return Object.keys(this.data).map((key) => key != "userId" ? `${key}:${this.data[key]}` : "").join();
  }

  // Endpoint: /ChuniNet/GetUserMusicApi
  // params: {userId, level: ジャンルコード}
  // response:
  // {
  //   characterFileName: null,
  //   characterLevel: null,
  //   genreList,
  //   genreMap,
  //   length,
  //   musicNameMap: {musicId: musicName, ...},
  //   userName: null,
  //   userMusicList:
  //     [
  //       {
  //         fullChain,
  //         isAllJustice,
  //         isFullCombo,
  //         isSuccess,
  //         level: null,
  //         musicId,
  //         playCount: null,
  //         scoreMax,
  //         scoreRank,
  //         updateDate: null
  //       },...
  //     ]
  // }
  static getUserMusic(difficulty: Difficulty) {
    // 19900 = ジャンルコード：全部
    return new ChuniNetAPIRequester("GetUserMusicApi", {level: 19900 + difficulty.id, isStatus: true});
  }

  // Endpoint: /ChuniNet/GetUserMusicLevelApi
  // params: {userId, level: int}
  // response:
  // {
  //   characterFileName:　null,
  //   characterLevel:　null,
  //   length,
  //   levelList: [...musicIds],
  //   levelPlusList: [...musicIds],
  //   difLevelMap: {musicId: difficulty, ...},
  //   musicNameMap:  {musicId: musicName, ...},
  //   userMusicList:
  //     [
  //       {
  //         fullChain,
  //         isAllJustice,
  //         isFullCombo,
  //         isSuccess,
  //         level: null,
  //         musicId,
  //         playCount: null,
  //         scoreMax,
  //         scoreRank,
  //         updateDate: null
  //       },...
  //     ]
  //   userName:null
  // }
  static getUserMusicFromLevel(level) {
    return new ChuniNetAPIRequester("GetUserMusicLevelApi", {level: level});
    // let requester = new ChuniNetAPIRequester("GetUserMusicLevelApi", {level: level});
    // requester.send();
    // return requester.then((response) => {
    //   return response;
    // });
  }

  // Endpoint: /ChuniNet/GetUserMusicDetailApi
  // params: {userId, musicId}
  // response:
  // {
  //   artistName,
  //   length,
  //   musicFileName,
  //   musicName,
  //   starId: null,
  //   tagId: null,
  //   userMusicList:
  //     [
  //       {
  //         fullChain,
  //         isAllJustice,
  //         isFullCombo,
  //         isSuccess,
  //         level,
  //         musicId,
  //         playCount,
  //         scoreMax,
  //         scoreRank,
  //         updateDate
  //       },...
  //     ]
  // }
  static getUserMusicDetail(musicId) {
    let requester = new ChuniNetAPIRequester("GetUserMusicDetailApi", {musicId: musicId});
    requester.send();
    return requester.then((response) => {
      return response;
    });
  }

  // static getUserMusicDetails(musicIds) {
  //   let promises = [];
  //   for (let musicId of musicIds)
  //   {
  //     promises.push(ChuniNetAPIRequester.getUserMusicDetail(musicId));
  //   }
  //   return promises;
  // }

  // Endpoint: /ChuniNet/GetUserInfoApi
  // params: {userId, friendCode: 0, fileLevel: 3}
  // response:
  // {
  //   userInfo: {
  //     characterFileName,
  //     characterLevel,
  //     friendCount,
  //     highestRating,
  //     level,
  //     playCount,
  //     playerRating,
  //     point,
  //     reincarnationNum,
  //     totalPoint,
  //     trophyName,
  //     trophyType,
  //     userName,
  //     webLimitDate
  //   }
  // }
  static getUserInfo() {
    let requester = new ChuniNetAPIRequester("GetUserInfoApi", {friendCode: 0, fileLevel: 3});
    requester.send();
    return requester.then((response) => {
      return response;
    });
  }

  // Endpoint: /ChuniNet/GetUserFriendlistApi
  // params: {userId, state: 4(フレンド候補)}
  // response:
  // {
  //   acceptCount,
  //   friendCode,
  //   length,
  //   userFriendlistList:
  //     [{friendCode, isFavorite, orderId},...]
  // }
  static getUserFriendList() {
    let requester = new ChuniNetAPIRequester("GetUserFriendlistApi", {state: 4});
    requester.send();
    return requester.then((response) => {
      return response;
    });
  }

  send() {
    // let promise = new Promise<any>((resolve, reject) => {
    //   super.send().then((response) => {
    //     ChuniNetSession.userId = response.userId;
    //     resolve(response);
    //   });
    // });
    // return promise;
    // return ChuniNetSession.loginPromise.then((userId) => {
      this.data["userId"] = ChuniNetSession.userId;
      super.send();
    // })
  }

  onResponse(response) {
    if (response === null)
    {
      let error = new Exception.ChuniNetSessionDisconnected("セッションが切断されました");
      this.onError(error);
      ChuniNetSession.onDisconnected(error);
      throw error;
    }
    // セッションID更新
    ChuniNetSession.userId = response.userId;

    super.onResponse(response);
  }

  addToQueue() {
    ChuniNetSession.confirm();
    ChuniNetRequestQueue.add(this);
  }
}