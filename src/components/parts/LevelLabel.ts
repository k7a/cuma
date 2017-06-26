import * as Vue from "vue"
import VueComponent from "vue-class-component"
import Level from "../../core/model/Level"

@VueComponent({
    template: `
      <span class="label level">
        {{ name }}
      </span>
    `,
    props: {
      level: Number
    }
})
export default class LevelLabel extends Vue {
  level: number

  get name() {
    return Level.fromNumber(this.level).name;
  }
}