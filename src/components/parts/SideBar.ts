import * as Vue from "vue"
import VueComponent from "vue-class-component"

@VueComponent({
    template: `
    <div id="leftsidebar" :style="style">
      <slot></slot>
    </div>
    `
})
export default class SideBar extends Vue {
  static position: {
    hide: number
    visible: number
  }
  position: number

  get isVisible() {
    return this.position == SideBar.position.visible;
  }

  visible() {
    this.position = SideBar.position.visible;
  }

  hide() {
    this.position = SideBar.position.hide;
  }
}