import * as Vue from "vue"
import * as VueRouter from "vue-router"
import VueComponent from 'vue-class-component'
import UserTuneDetailListPage from './page/UserTuneDetailListPage'
import UserTuneDetailListPageSideBar from './page/UserTuneDetailListPageSideBar'
import BestRatingPage from './page/BestRatingPage'
import MasterDataPage from './page/MasterDataPage'
import OptionPage from './page/OptionPage'
import LoginModal from "./LoginModal"
import EventDispatcher from "./EventDispatcher"

Vue.use(VueRouter);

Vue.filter('round', function (value, n) {
	return typeof value === "number" ? value.toFixed(n) : "-";
})

@VueComponent({
  template: require('./App.html'),
  components: {
    LoginModal
  }
})
class App extends Vue {
  visibility: {
    loginModal: boolean,
    aimeSelectModal: boolean,
  }
  loginModal: LoginModal
  dragging: boolean
  dragStart: {x: number, y: number}
  dragOffset: {x: number, y: number}
  dragOffsetDiff: {x: number, y: number}
  leftSideBarPosition: number
  leftSideBarPositionOrigin: number
  rightSideBarPosition: number
  rightSideBarPositionOrigin: number

  data() {
    return {
      visibility: this.visibility,
      dragging: this.dragging,
      dragStart: this.dragStart,
      dragOffset: this.dragOffset,
      leftSideBarPosition: this.leftSideBarPosition,
      leftSideBarPositionOrigin: this.leftSideBarPositionOrigin,
      rightSideBarPosition: this.rightSideBarPosition,
      rightSideBarPositionOrigin: this.rightSideBarPositionOrigin,
    }
  }

  created() {
    this.visibility = {
      loginModal: false,
      aimeSelectModal: false,
    }
    this.dragging = false;
    this.dragStart = {x: 0, y: 0};
    this.dragOffset = {x: 0, y: 0};
    this.dragOffsetDiff = {x: 0, y: 0};
    this.leftSideBarPosition = -256;
    this.leftSideBarPositionOrigin = -256;
    this.rightSideBarPosition = 256;
    this.rightSideBarPositionOrigin = 256;

    window.addEventListener("click", (event) => {
      EventDispatcher.$emit("windowClick", event.target);
    });
    this.$nextTick(() => {
      this.loginModal = <LoginModal>this.$refs["loginModal"];
      this.loginModal.$watch("isVisible", (val: boolean) => {
        this.visibility.loginModal = val;
      }, {immediate: true})
      this.openLoginModal();
    });
  }
  
  get isMasked() {
    let visibility = this.visibility;
    console.log();
    return visibility.loginModal || visibility.aimeSelectModal;
  }

  get leftSideBarStyle() {
    return {
      transform: `translateX(${this.leftSideBarPosition}px)`,
      transition: this.dragging ? "none" : "transform 0.3s ease-in-out"
    };
  }

  get rightSideBarStyle() {
    return {
      transform: `translateX(${this.rightSideBarPosition}px)`,
      transition: this.dragging ? "none" : "transform 0.3s ease-in-out"
    };
    // return {
    //   transform: `translateX(${this.rightSideBarPosition}px)`,
    //   transition: this.dragging ? "none" : "transform 0.3s ease-in-out"
    // };
  }

  get hasRightSideBar() {
    return this.$route.meta.hasRightSideBar;
  }
  
  openLoginModal() {
    if (this.visibility.loginModal) return;
    this.loginModal.open();
  }

  closeLoginModal() {
    if (!this.loginModal.isVisible) return;
    this.loginModal.close();
  }

  startDrag(e) {
    console.log(this.$route);
    e = e.changedTouches ? e.changedTouches[0] : e;
    this.dragging = true;
    this.dragStart.x = e.pageX;
    this.dragStart.y = e.pageY;
    this.leftSideBarPositionOrigin = this.leftSideBarPosition;
    this.rightSideBarPositionOrigin = this.rightSideBarPosition;
  }

  onDrag(e) {
    let touch: Touch = e.changedTouches ? e.changedTouches[0] : e;
    if (this.dragging) {
      let newOffsetX = (touch.pageX - this.dragStart.x);
      this.dragOffsetDiff.x = newOffsetX - this.dragOffset.x;
      this.dragOffset.x = newOffsetX;
      this.dragOffset.y = touch.pageY - this.dragStart.y;
      if (Math.abs(this.dragOffset.x) <= 30)
      {
        if (Math.abs(this.dragOffset.y) >= 15)
        {
          this.cancelDrag();
        }
        return;
      }
      // サイドバーを動かしている間はスクロールを止める
      e.preventDefault();
      if (this.rightSideBarPositionOrigin == 256)
      {
        let leftpos = Math.max(this.leftSideBarPositionOrigin + this.dragOffset.x, -256);
        leftpos = Math.min(leftpos, 0);
        this.leftSideBarPosition = leftpos;
      }
      if  (this.leftSideBarPositionOrigin == -256)
      {
        let rightpos = Math.max(this.rightSideBarPositionOrigin + this.dragOffset.x, 0);
        rightpos = Math.min(rightpos, 256);
        this.rightSideBarPosition = rightpos;
      }
    }
  }

  cancelDrag() {
    if (this.dragging) {
      this.dragging = false;
      if (this.dragOffsetDiff.x >= 30)
      {
        if (this.rightSideBarPositionOrigin == 256)
        this.leftSideBarPosition = 0;
        else
        this.rightSideBarPosition = 256;
      }
      else if (this.dragOffsetDiff.x <= -30)
      {
        if (this.rightSideBarPositionOrigin == 256)
        this.leftSideBarPosition = -256;
        else
        this.rightSideBarPosition = 0;
      }
    }
    this.leftSideBarPosition = (256 + this.leftSideBarPosition) < 256 / 2 ? -256 : 0;
    this.rightSideBarPosition = (256 - this.rightSideBarPosition) < 256 / 2 ? 256 : 0;
    this.dragOffset.x = 0;
    this.dragOffset.y = 0;
    this.dragOffsetDiff.x = 0;
    this.dragOffsetDiff.y = 0;
  }

  stopDrag() {
    if (this.dragging) {
      this.dragging = false;
      if (this.dragOffset.x >= 50)
      {
        if (this.rightSideBarPositionOrigin == 256)
        this.leftSideBarPosition = 0;
        else
        this.rightSideBarPosition = 256;
      }
      else if (this.dragOffset.x <= -50)
      {
        if (this.rightSideBarPositionOrigin == 256)
        this.leftSideBarPosition = -256;
        else
        this.rightSideBarPosition = 0;
      }
    }
    this.leftSideBarPosition = (256 + this.leftSideBarPosition) < 256 / 2 ? -256 : 0;
    this.rightSideBarPosition = (256 - this.rightSideBarPosition) < 256 / 2 ? 256 : 0;
    this.dragOffset.x = 0;
    this.dragOffset.y = 0;
    this.dragOffsetDiff.x = 0;
    this.dragOffsetDiff.y = 0;
  }
}

const router = new VueRouter({
  mode: "history",
  routes: [
    { 
      path: "/score-list",
      name: "Score List",
      meta: {
        hasRightSideBar: true
      },
      components: {
        main: UserTuneDetailListPage,
        rightSideBar: UserTuneDetailListPageSideBar
      },
    },
    {
      path: "/best-rating",
      name: "Rating Best",
      components: {
        main: BestRatingPage,
        // rightSideBar: 
      },
    },
    {
      path: "/master-data",
      name: "MasterData",
      components: {
        main: MasterDataPage,
        // rightSideBar: 
      },
    },
    {
      path: "/option",
      name: "Option",
      components: {
        main: OptionPage,
        // rightSideBar: 
      },
    }
  ]
});

export default new App({
    router
}).$mount("#app");