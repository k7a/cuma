import UserTuneDetailMap from "./UserTuneDetailMap"
import UserTuneDetail from "./UserTuneDetail"
import DataFetcher from "../utils/DataFetcher"
import StorageManager from "../utils/StorageManager"
import MasterData from "./MasterData"

class User {
  private static _instance: User;
  private static userInfoStorageKey = "UserInfo";
  private static scoreStorageKey = "ScoreData";

  userTuneDetailMap: UserTuneDetailMap;
  playerRating: number;
  highestRating: number;
  playCount: number;
  friendCode: number;
  updated_at: string;

  constructor() {
    if(!User._instance)
    {
      User._instance = this;
      this.userTuneDetailMap = new UserTuneDetailMap();
      this.playerRating = 0.0;
      this.highestRating = 0.0;
      this.playCount = 0;
      this.friendCode = 0;
      MasterData.setMusicMap().then(() => {
        this.loadFromStorage();
      });
    }
    return User._instance;
  }

  fetchFriendCode() {
    if (this.friendCode != 0) return Promise.resolve();
    
    return DataFetcher.fetchFriendCode().then((friendCode: number) => {
      this.friendCode = friendCode;
      return;
    });
  }

  fetchUserData() {
    let promises:Promise<void>[];
    promises.push(this.fetchUserInfo());
    promises.push(this.fetchAllUserTuneDetailMap());
    return Promise.all(promises).then(() => {
      this.updated_at = new Date().toISOString();
    });
  }

  fetchUserInfo() {
    return DataFetcher.fetchUserInfo().then((userInfo: any) => {
      this.playerRating = userInfo.playerRating;
      this.highestRating = userInfo.highestRating;
      this.playCount = userInfo.playCount;
      return;
    });
  }

  fetchAllUserTuneDetailMap() {
    return DataFetcher.fetchAllUserTuneDetails()
                      .then(tuneDetails => this.userTuneDetailMap.setAll(tuneDetails));
  }

  saveToStorage() {
    // nullチェック
    let userInfo = {
      "playerRating": this.playerRating,
      "highestRating": this.highestRating,
      "playCount": this.playCount,
      "friendCode": this.friendCode,
    };
    StorageManager.setJSON(User.userInfoStorageKey, userInfo);

    StorageManager.setJSON(User.scoreStorageKey, this.userTuneDetailMap.toJSON());
  }

  loadFromStorage() {
    let userInfo = StorageManager.getJSON(User.userInfoStorageKey);
    this.playerRating = userInfo.playerRating;
    this.highestRating = userInfo.highestRating;
    this.playCount = userInfo.playCount;
    this.friendCode = userInfo.friendCode;

    let scoreData = StorageManager.getJSON(User.scoreStorageKey);
    if (scoreData !== null) this.userTuneDetailMap.loadFromJSON(scoreData);
  }
}
export default new User();