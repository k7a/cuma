import * as Vue from "vue"
import VueComponent from 'vue-class-component'
import Difficulty from "../../core/model/Difficulty"
import Level from "../../core/model/Level"

@VueComponent({
    template: `
      <span class="label" :class="color">
        {{ difficulty.shortName }}
      </span>
    `,
    props: {
      difficulty: Difficulty,
      level: Number,
    }
})
export default class DifficultyLabel extends Vue {
  difficulty: Difficulty
  level: number

  get color() {
    switch (this.difficulty.id)
    {
      case 0: return "difficulty-basic";
      case 1: return "difficulty-advanced";
      case 2: return "difficulty-expert";
      case 3: return "difficulty-master";
    }
  }

  get name() {
    return Level.fromNumber(this.level).name;
  }
}