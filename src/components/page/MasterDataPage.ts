import * as Vue from 'vue'
import VueComponent from 'vue-class-component'
import MasterData from "../../core/model/MasterData"
import DifficultyLabel from "../parts/DifficultyLabel"
import Music from "../../core/model/Music"
import Difficulty from "../../core/model/Difficulty"
import ObservableMap from "../../core/common/ObservableMap"
// import "file-saver"

@VueComponent({
    template: `
    <tr>
      <td class="right aligned">
        {{ music.id }}
      </td>
      <td>
        {{ music.name }}
      </td>
      <td class="right aligned">
        <template v-if="!isEditMode">
          {{ music.basic.level | round(1) || "-" }}
        </template>
        <div class="ui input" v-else>
          <input ref="basicLevel" type="number" min="1" max="13.5" step="0.5" v-model="formData.basic">
        </div>
      </td>
      <td class="right aligned">
        <template v-if="!isEditMode">
          {{ music.basic._internalLevel | round(1) || "-" }}
        </template>
        <div class="ui input" v-else>
          <input ref="basicInternalLevel" type="number" min="1" max="13.9" step="0.1" v-model="formData.basicInternal">
        </div>
      </td>
      <td class="right aligned">
        <template v-if="!isEditMode">
          {{ music.advanced.level | round(1) || "-" }}
        </template>
        <div class="ui input" v-else>
          <input ref="advancedLevel" type="number" min="1" max="13.5" step="0.5" v-model="formData.advanced">
        </div>
      </td>
      <td class="right aligned">
        <template v-if="!isEditMode">
          {{ music.advanced._internalLevel | round(1) || "-" }}
        </template>
        <div class="ui input" v-else>
          <input ref="advancedInternalLevel" type="number" min="1" max="13.9" step="0.1" v-model="formData.advancedInternal">
        </div>
      </td>
      <td class="right aligned">
        <template v-if="!isEditMode">
          {{ music.expert.level | round(1) || "-" }}
        </template>
        <div class="ui input" v-else>
          <input ref="expertLevel" type="number" min="1" max="13.5" step="0.5" v-model="formData.expert">
        </div>
      </td>
      <td class="right aligned">
        <template v-if="!isEditMode">
          {{ music.expert._internalLevel | round(1) || "-" }}
        </template>
        <div class="ui input" v-else>
          <input ref="expertInternalLevel" type="number" min="1" max="13.9" step="0.1" v-model="formData.expertInternal">
        </div>
      </td>
      <td class="right aligned">
        <template v-if="!isEditMode">
          {{ music.master.level | round(1) || "-" }}
        </template>
        <div class="ui input" v-else>
          <input ref="masterLevel" type="number" min="1" max="13.5" step="0.5" v-model="formData.master">
        </div>
      </td>
      <td class="right aligned">
        <template v-if="!isEditMode">
          {{ music.master._internalLevel | round(1) || "-" }}
        </template>
        <div class="ui input" v-else>
          <input ref="masterInternalLevel" type="number" min="1" max="13.9" step="0.1" v-model="formData.masterInternal">
        </div>
      </td>
      <td>
        <button v-if="!isEditMode" class="ui primary icon button" @click.stop="edit">
          <i class="edit icon"></i>
        </button>
        <div v-else class="ui buttons">
          <button class="ui icon button" @click.stop="cancel"><i class="remove icon"></i></button>
          <button class="ui icon primary button" @click.stop="apply"><i class="checkmark icon"></i></button>
        </div>
      </td>
    </tr>
    `,
    props: {
      music: Music
    }
})
class MusicDataRow extends Vue {
  music: Music;
  isEditMode: boolean;
  formData: {
    basic: number,
    basicInternal: number,
    advanced: number,
    advancedInternal: number,
    expert: number,
    expertInternal: number,
    master: number,
    masterInternal: number,
  };

  data() {
    return {
      isEditMode: this.isEditMode,
      formData: this.formData,
    };
  }

  created() {
    this.initialize();
  }

  initialize() {
    this.isEditMode = false;
    this.formData = {
      basic: this.music.basic.level,
      basicInternal: this.music.basic.rawInternalLevel,
      advanced: this.music.advanced.level,
      advancedInternal: this.music.advanced.rawInternalLevel,
      expert: this.music.expert.level,
      expertInternal: this.music.expert.rawInternalLevel,
      master: this.music.master.level,
      masterInternal: this.music.master.rawInternalLevel,
    };
  }

  edit() {
    this.initialize();
    this.isEditMode = true;
  }

  cancel() {
    this.initialize();
    // this.isEditMode = false;
    // this.formData = {
    //   basic: undefined,
    //   basicInternal: undefined,
    //   advanced: undefined,
    //   advancedInternal: undefined,
    //   expert: undefined,
    //   expertInternal: undefined,
    //   master: undefined,
    //   masterInternal: undefined,
    // };
  }

  apply() {
    this.music.basic.level = this.formData.basic || undefined;
    this.music.basic.internalLevel = this.formData.basicInternal || undefined;
    this.music.advanced.level = this.formData.advanced || undefined;
    this.music.advanced.internalLevel = this.formData.advancedInternal || undefined;
    this.music.expert.level = this.formData.expert || undefined;
    this.music.expert.internalLevel = this.formData.expertInternal || undefined;
    this.music.master.level = this.formData.master || undefined;
    this.music.master.internalLevel = this.formData.masterInternal || undefined;
    this.isEditMode = false;
  }
}

@VueComponent({
    template: require("./MasterDatapage.html"),
    components: {
      MusicDataRow
    }
})
export default class {
  musicMap: ObservableMap<number, Music>;
  sortType: string;
  sortOrder: number;

  data() {
    return {
      musicMap: this.musicMap,
      sortType: this.sortType,
      sortOrder: this.sortOrder,
    };
  }

  created() {
    this.musicMap = MasterData.musicMap;
  }

  get musics() {
    return Array.from(this.musicMap.values);
  }

  changeOrder() {

  }

  saveJSON() {
    let FileSaver = require('file-saver');
    let jsonText = JSON.stringify(MasterData.toJSON());
    let blob = new Blob([jsonText], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "master_data.json");
  }
}