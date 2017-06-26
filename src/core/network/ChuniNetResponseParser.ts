import Difficulty from "../model/Difficulty"
import UserTuneDetail from "../model/UserTuneDetail"
import MasterData from "../model/MasterData"
import {Exception} from "../common/Exception"

export default class ChuniNetResponseParser {
  static userMusicListToUserTuneDetails(response: any, difficulty: Difficulty = undefined): UserTuneDetail[] {
    let musicNameMap = response.musicNameMap;
    let userMusicList = response.userMusicList;
    let levelList = response.levelList;
    let levelPlusList = response.levelPlusList;
    let difLevelMap = response.difLevelMap;

    let userTuneDetails = new Array<UserTuneDetail>();
    for (let userMusicResponse of userMusicList)
    {
      let musicId = userMusicResponse.musicId;
      let tuneDifficulty = difficulty !== undefined ? difficulty : Difficulty.find(userMusicResponse.level);
      if (difLevelMap && tuneDifficulty !== difLevelMap[musicId]) continue;

      let music = MasterData.getMusic(musicId);
      if (music === undefined)
      {
        music = MasterData.setMusic({id: musicId, name: musicNameMap[musicId]});
      }
      else music.name = musicNameMap[musicId];
      let tune = music.findOrCreateTune(tuneDifficulty);

      let userTuneDetail = UserTuneDetail.fromUserMusicResponse(tune, userMusicResponse);
      userTuneDetails.push(userTuneDetail);
    }
    return userTuneDetails;
  }
}