import * as Vue from "vue"
import VueComponent from 'vue-class-component'
import ChuniNetSession from "../core/network/ChuniNetSession"
import {Exception} from "../core/common/Exception"
import User from "../core/model/User"
import EventDispatcher from "./EventDispatcher"
import ApiButton from "./ApiButton"

@VueComponent({
  template: require("./LoginModal.html"),
  components: {
    ApiButton
  }
})
export default class extends Vue {
  segaId: string;
  password: string;
  session: any;
  content: HTMLElement;
  isVisible: boolean;

  data() {
    return {
      segaId: this.segaId,
      password: this.password,
      session: this.session,
      isVisible: this.isVisible
    };
  }

  created() {
    this.segaId = "";
    this.password = "";
    this.session = ChuniNetSession;
    this.isVisible = false;
    this.$nextTick(() => {
      this.content = <HTMLElement>this.$refs["content"];
    });
    this.open();
  }

  get isValid() {
    return this.segaId.length > 6 && this.password.length > 8;
  }

  // methods

  onWindowClick(target: Node) {
    if (this.isVisible && !this.content.contains(target)) this.close();
  }
  
  login() {
    return ChuniNetSession .sendLoginRequest(this.segaId, this.password)
                    .then(() => {
                      this.close();
                    }, (error) => {
                      this.$refs["segaIdInput"]["focus"]();
                    });
  }

  cancel() {
    ChuniNetSession.clear();
    this.close();
  }

  open() {
    if (this.isVisible) return;
    this.isVisible = true;
    EventDispatcher.$on("windowClick", this.onWindowClick);
  }

  close() {
    this.isVisible = false;
    EventDispatcher.$off("windowClick", this.onWindowClick);
  }
}