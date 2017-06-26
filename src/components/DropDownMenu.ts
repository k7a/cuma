import * as Vue from 'vue'
import VueComponent from 'vue-class-component'
import EventDispatcher from "./EventDispatcher"

@VueComponent({
    template: require("./DropDownMenu.html"),
    props: {
    }
})
export default class DropDownMenu extends Vue {
  isVisible: boolean

  data() {
    return {
      isVisible: this.isVisible
    }
  }

  created() {
    this.isVisible = false;
    EventDispatcher.$on("windowClick", (target: Node) => {
      if (this.isVisible && !this.$el.contains(target)) this.close();
    });
  }

  onClick() {
  }

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}