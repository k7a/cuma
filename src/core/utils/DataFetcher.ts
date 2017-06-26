import APIRequester from "../network/APIRequester"
import ChuniNetAPIRequester from "../network/ChuniNetAPIRequester"
import ChuniNetResponseParser from "../network/ChuniNetResponseParser"
import Difficulty from "../model/Difficulty"
import Level from "../model/Level"
import Music from "../model/Music"
import Tune from "../model/Tune"
import UserTuneDetail from "../model/UserTuneDetail"
import MasterData from "../model/MasterData"

export default class DataFetcher {
  static fetchFriendCode() {
    return ChuniNetAPIRequester.getUserFriendList().then((response) => {
      return response.friendCode;
    });
  }

  static fetchUserInfo() {
    return ChuniNetAPIRequester.getUserInfo().then((response) => {
      let userInfo = response.userInfo;
      // レーティングの値は100倍した整数値で返ってきている
      userInfo.highestRating /= 100;
      userInfo.playerRating /= 100;
      return userInfo;
    });
  }

  // playCount, lastPlayedは取得できない
  static fetchAllUserTuneDetails() {
    let promises: Promise<UserTuneDetail[]>[] = [];
    for (let difficulty of Difficulty.All)
    {
      let requester = ChuniNetAPIRequester.getUserMusic(difficulty);
      let promise = requester.then(response => ChuniNetResponseParser.userMusicListToUserTuneDetails(response, difficulty));
      promises.push(promise);
      requester.addToQueue();
    }
    return Promise.all(promises)
                  .then(userTuneDetailLists => userTuneDetailLists.reduce((a, b) => a.concat(b)));
  }

  // static fetchAllUserTuneDetailsFromLevel() {
  //   let requesters = [];
  //   for (let level　of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
  //   {
  //     let requester = ChuniNetAPIRequester.getUserMusicFromLevel(level)
  //       .then((response) => {
  //         let musicNameMap = response.musicNameMap;
  //         for (let musicIdStr in musicNameMap)
  //         {
  //           let musicId = parseInt(musicIdStr);
  //           let difficulty = Difficulty.find(response.difLevelMap[musicId]);
  //           if (MasterData.getTune(musicId, difficulty) === undefined)
  //           {
  //             let music = MasterData.getMusic(musicId);
  //             if (music === undefined)
  //             {
  //               let musicName = musicNameMap[musicId];
  //               music = new Music({
  //                 id: musicId,
  //                 name: musicNameMap[musicId],
  //               });
  //               MasterData.setMusic(music);
  //             }
  //             let tune = new Tune({
  //               musicId: musicId,
  //               level: level + (response.levelPlusList.includes(musicId) ? 0.5 : 0),
  //               difficulty: difficulty
  //             });
  //             music.setTune(tune);
  //             console.log(music);
  //             console.log(tune);
  //           }
  //         }
  //         return ChuniNetResponseParser.userMusicListToUserTuneDetails(response);
  //       });

  //     requesters.push(requester);
  //   }
  //   return Promise.all(requesters)
  //                 .then((userTuneDetailLists) => userTuneDetailLists.reduce((a, b) => a.concat(b)));
  // }

  // playCount, lastPlayedを取得できる
  static fetchUserTuneDetails(musicId: number) {
    return ChuniNetAPIRequester.getUserMusicDetail(musicId).then((response) => {
      let userTuneDetails = new Array<UserTuneDetail>();
      for (let userMusicResponse of response.userMusicList)
      {
        let tune = MasterData.getTune(userMusicResponse.musicId, userMusicResponse.level);
        let userTuneDetail = UserTuneDetail.fromUserMusicResponse(tune, userMusicResponse);
        userTuneDetails.push(userTuneDetail);
      }
      return userTuneDetails;
    });
  }

  static fetchMusicMaster() {
    let path = require("../../assets/master_data.json");
    let requester = new APIRequester({endpoint: path});
    requester.send();
    return requester;
  }

  static fetchMusicMasterFromChuniNet() {
    let requesters = [];
    for (let level　of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
    {
      let requester = ChuniNetAPIRequester.getUserMusicFromLevel(level);
      requester.then((response) => {
          let musicNameMap = response.musicNameMap;
          for (let musicIdStr in musicNameMap)
          {
            let musicId = parseInt(musicIdStr);
            let difficulty = Difficulty.find(response.difLevelMap[musicId]);

            let music = MasterData.getMusic(musicId);
            if (music === undefined)
            {
              let musicName = musicNameMap[musicId];
              music = new Music({
                id: musicId,
                name: musicNameMap[musicId],
              });
              music = MasterData.setMusic(music);
            }

            let tune = music.findOrCreateTune(difficulty);
            if (tune.level === undefined)
            {
              tune.level = level + (response.levelPlusList.includes(musicId) ? 0.5 : 0);
              // let tune = new Tune({
              //   musicId: musicId,
              //   level: level + (response.levelPlusList.includes(musicId) ? 0.5 : 0),
              //   difficulty: difficulty
              // });
              // music.setTune(tune);
            }
          }
          return;
        });
      requester.addToQueue();
      requesters.push(requester);
    }
    return Promise.all(requesters);
  }

  // response:
  // [
  //   {
  //     musicId,
  //     name,
  //     artist,
  //     basic,
  //     advanced,
  //     expert,
  //     master,
  //     basicInternal,
  //     advancedInternal,
  //     expertInternal,
  //     masterInternal
  //   },...
  // ]
  // static fetchMusicMasterMap() {
  //   return DataFetcher.fetchMusicMaster().then((response) => {
  //     let musicMap = new Map();
  //     for (let params of response)
  //     {
  //       let music = new Music({
  //           id: params.musicId,
  //           name: params.name,
  //           artist: params.artist
  //         });
  //       for (let difficulty of Difficulty.All)
  //       {
  //         let level: number, internalLevel: number;
  //         let key = difficulty.name.toLocaleLowerCase();
  //         level = params[key];
  //         internalLevel = params[`${key}Internal`];

  //         music.setTune({
  //           difficulty: difficulty,
  //           level: level,
  //           internalLevel: internalLevel
  //         });
  //       }

  //       musicMap.set(music.id, music);
  //     }
  //     return musicMap;
  //   });
  // }
}