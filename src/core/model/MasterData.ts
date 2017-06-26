import Difficulty from "./Difficulty"
import Music from "./Music"
import Tune from "./Tune"
import Level from "./Level"
import DataFetcher from "../utils/DataFetcher"
import StorageManager from "../utils/StorageManager"
import ObservableMap from "../common/ObservableMap"

class MasterData {
  private static _instance: MasterData;
  musicMap: ObservableMap<number, Music>;

  constructor() {
    if(!MasterData._instance)
    {
      MasterData._instance = this;
      this.musicMap = new ObservableMap<number, Music>();
    }
    return MasterData._instance;
  }

  static get instance() {
    if (MasterData._instance === null) MasterData._instance = new MasterData();
    return MasterData._instance;
  }

  setMusicMap() {
    return DataFetcher.fetchMusicMaster().then((json) => {
      this.fromJSON(json);
      return;
    });
  }

  getMusic(musicId: number): Music | undefined {
    // if (this.musicMap.has(musicId))
    return this.musicMap.get(musicId);
    // else throw new MusicNotFound("Musicが見つかりません");
  }

  getTune(musicId: number, difficulty: Difficulty): Tune | undefined {
    let music = this.getMusic(musicId);
    if (music === undefined) return undefined;
    else return music.getTune(difficulty);
  }

  findOrCreateTune(musicId: number, difficulty: Difficulty) {
    let music = this.getMusic(musicId);
    if (music === undefined) return undefined;
    else return music.findOrCreateTune(difficulty);
  }

  // hasTune(musicId: number, difficulty: Difficulty) {
  //   let music = this.getMusic(musicId);
  //   if (music === undefined) return false;

  //   return music.hasTune(difficulty);
  // }

  setMusic(params: {id: number, name: string, artist?: string}) {
    let music = new Music(params);
    this.musicMap.set(music.id, music);
    return music;
  }

  saveToStorage() {
    StorageManager.setJSON("MusicMasterData", this.toJSON());
  }

  loadFromStorage() {
    this.fromJSON(StorageManager.getJSON("MusicMasterData"));
  }

  // [
  //   [
  //     musicId,
  //     name,
  //     artist,
  //     date,
  //     basic,
  //     basicInternal,
  //     advanced,
  //     advancedInternal,
  //     expert,
  //     expertInternal,
  //     master,
  //     masterInternal,
  //   ]
  // ]
  toJSON() {
    let jsonObj = [];
    for (let music of this.musicMap.values)
    {
      let data = [];
      data[0] = music.id;
      data[1] = music.name;
      data[2] = music.artist || "";

      let basic = music.basic;
      data[3] = basic && basic.level || 0;
      data[4] = basic && basic.rawInternalLevel || 0;

      let advanced = music.advanced;
      data[5] = advanced && advanced.level || 0;
      data[6] = advanced && advanced.rawInternalLevel || 0;

      let expert = music.expert;
      data[7] = expert && expert.level || 0;
      data[8] = expert && expert.rawInternalLevel || 0;

      let master = music.master;
      data[9] = master && master.level || 0;
      data[10] = master && master.rawInternalLevel || 0;

      jsonObj.push(data);
    }
    return jsonObj;
  }

  fromJSON(jsonObj: (string | number)[][], overwrite: boolean = false) {
    // TODO: overwrite実装
    for (let data of jsonObj)
    {
      let musicId = <number>data[0];
      let musicName = <string>data[1];
      let musicArtist = <string>data[2];
      let music = this.setMusic({id: musicId, name: musicName, artist: musicArtist});

      music.setTune({
        difficulty: Difficulty.BASIC,
        level: <number>data[3],
        internalLevel: <number>data[4],
      });
      music.setTune({
        difficulty: Difficulty.ADVANCED,
        level: <number>data[5],
        internalLevel: <number>data[6],
      });
      music.setTune({
        difficulty: Difficulty.EXPERT,
        level: <number>data[7],
        internalLevel: <number>data[8],
      });
      music.setTune({
        difficulty: Difficulty.MASTER,
        level: <number>data[9],
        internalLevel: <number>data[10],
      });
    }
  }
}

export default new MasterData();
