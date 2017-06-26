import VueComponent from "vue-class-component"

@VueComponent({
    template: `<button class="ui button" :class="[{ loading: isLoading }]" @click.stop.prevent="onClick" @keyup.enter.prevent="onClick"><slot></slot></button>`,
    props: {
      action: Function,
      filterConditions: Object
    }
})
export default class ApiButton {
  action: () => Promise<any>;
  isLoading: boolean;
  text: string;

  data() {
    return {
      isLoading: this.isLoading
    }
  }

  created() {
    this.isLoading = false;
  }

  onClick() {
    this.isLoading = true;
    this.action().then(() => this.isLoading = false);
  }
}