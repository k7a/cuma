import * as Vue from "vue"
import VueComponent from "vue-class-component"
import ClearRank from "../../core/model/ClearRank"

@VueComponent({
    template: `
      <span class="label" :class="color">
        {{ clearRank.name }}
      </span>
    `,
    props: {
      clearRank: ClearRank
    }
})
export default class ClearRankLabel extends Vue {
  clearRank: ClearRank

  get color() {
    switch (this.clearRank)
    {
      case ClearRank.D: return "clear-rank-d";
      case ClearRank.C: return "clear-rank-c";
      case ClearRank.B: return "clear-rank-b";
      case ClearRank.BB: return "clear-rank-bb";
      case ClearRank.BBB: return "clear-rank-bbb";
      case ClearRank.A: return "clear-rank-a";
      case ClearRank.AA: return "clear-rank-aa";
      case ClearRank.AAA: return "clear-rank-aaa";
      case ClearRank.S: return "clear-rank-s";
      case ClearRank.SS: return "clear-rank-ss";
      case ClearRank.SS_PLUS: return "clear-rank-ss-plus";
      case ClearRank.SSS: return "clear-rank-sss";
      case ClearRank.MAX: return "clear-rank-max";
    }
  }
}