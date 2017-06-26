import * as Vue from "vue"
import VueComponent from "vue-class-component"
import FullComboState from "../../core/model/FullComboState"

@VueComponent({
    template: `
      <span class="label" :class="color">
        {{ fullComboState.name }}
      </span>
    `,
    props: {
      fullComboState: FullComboState
    }
})
export default class FullComboStateLabel extends Vue {
  fullComboState: FullComboState

  get color() {
    switch (this.fullComboState)
    {
      case FullComboState.NONE: return "full-combo-none";
      case FullComboState.FULL_COMBO: return "full-combo-fc";
      case FullComboState.ALL_JUSTICE: return "full-combo-aj";
      case FullComboState.ALL_JUSTICE_CRITICAL: return "full-combo-ajc";
    }
  }
}