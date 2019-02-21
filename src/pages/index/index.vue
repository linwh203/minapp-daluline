<template>
  <div class="container">
    <div class="index-tab">
      <div class="index-tab-item icon-list first">
        <img src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/menu_top.png">
      </div>
      <div class="index-tab-item icon-map" @click="bindTab('../my-map/main?queryType=0')">
        <img src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/menu_map.png" alt>
      </div>
      <div class="index-tab-item icon-audio" @click="toggleAutoPlay">
        <img
          src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/menu_audio_play.png"
          alt
          v-if="!isPlaying"
        >
        <img
          src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/menu_audio_stop.png"
          alt
          v-if="isPlaying"
        >
      </div>
      <div class="index-tab-item icon-video" @click="bindTab('../video-list/main')">
        <img src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/menu_video.png">
      </div>
      <div class="index-tab-item icon-scan" @click="bindTab('../scan/main')">
        <img src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/menu_photo.png" alt>
      </div>
      <!-- <div class="index-tab-item icon-quiz" @click="bindTab('../quiz/main')">
        <img src="https://gw.alicdn.com/tfs/TB1OOfmv4jaK1RjSZKzXXXVwXXa-104-96.png" alt>
      </div>-->
      <div class="index-tab-item icon-my" @click="bindTab('../my/main')">
        <img src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/menu_center.png" alt>
      </div>
      <div class="index-tab-line"></div>
    </div>
    <scroll-view scroll-x style="width: 100%" class="navi-scroll">
      <div class="navi">
        <div class="navi-item" :style="lineIndex==98?'color:#2b9f62':''" @click="toSmallLine(98)">全部</div>
        <div
          class="navi-item"
          :style="lineIndex==0?'color:#2b9f62':''"
          @click="toSmallLine(0)"
        >第一段 新大-七星湾</div>
        <div
          class="navi-item"
          :style="lineIndex==1?'color:#2b9f62':''"
          @click="toSmallLine(1)"
        >第二段 七星湾-桔钓沙段</div>
        <div
          class="navi-item"
          :style="lineIndex==2?'color:#2b9f62':''"
          @click="toSmallLine(2)"
        >第三段 桔钓沙-杨梅坑段</div>
        <div
          class="navi-item"
          :style="lineIndex==3?'color:#2b9f62':''"
          @click="toSmallLine(3)"
        >第四段 杨梅坑-过店段</div>
        <div
          class="navi-item"
          :style="lineIndex==4?'color:#2b9f62':''"
          @click="toSmallLine(4)"
        >第五段 过店-鹿咀段</div>
      </div>
    </scroll-view>
    <div class="scroll">
      <!-- <scroll-view scroll-y class="scroll"> -->
      <div class="scroll-title">
        <img
          class="logo"
          src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/List/list_logo.png"
          mode="aspectFit"
        >
        <!-- <img :src="titleSrc" class="scroll-title-pic">
        <img
          src="https://gw.alicdn.com/tfs/TB1ZJh6mSzqK1RjSZPxXXc4tVXa-245-52.png"
          class="scroll-title-text"
        >
        <img
          src="https://gw.alicdn.com/tfs/TB1CQ53v7voK1RjSZFNXXcxMVXa-343-214.png"
          class="scroll-title-body"
        >-->
      </div>
      <!-- <div class="spot" :style="{height:fullHeight+'rpx'}"> -->
      <div class="spot">
        <div
          class="spot-item"
          v-for="(item,index) in fullSpot"
          :key="index"
          :id="'spot'+item.num"
          :style="{top:item.y+'%'}"
        >
          <div
            class="number"
            :class="activeIndex == index+1?'active':''"
            @click="chooseSpot(item,index)"
          >{{item.num}}</div>
          <div class="spot-item-tri" v-if="activeIndex == index+1"></div>
          <div
            class="spot-item-window"
            :style="{right:calcRight+'rpx'}"
            v-if="activeIndex == index+1"
            @click="goDetail"
          >
            <img
              class="spot-item-window-pic"
              :src="prefix + currentSpot.spot_coverurl"
              v-if="currentSpot && currentSpot.spot_coverurl"
            >
            <div class="spot-item-window-text" v-if="currentSpot">
              <div class="spot-item-window-title">{{currentSpot.spot_title}}</div>
              <div class="spot-item-window-desc">{{currentSpot.spot_describe}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <img
        mode="widthFix"
        src="https://gw.alicdn.com/tfs/TB1HJvXv4TpK1RjSZFGXXcHqFXa-519-6810.png"
        class="scroll-road"
      >-->
      <!-- <img
        mode="widthFix"
        src="https://gw.alicdn.com/tfs/TB15F6gv3HqK1RjSZFkXXX.WFXa-640-6997.png"
        class="scroll-bg"
        @load="roadready"
      >-->
      <img
        mode="widthFix"
        src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/background_road.png?1"
        class="scroll-road"
      >
      <img
        mode="widthFix"
        src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/background.png?2"
        class="scroll-bg"
        @load="roadready"
      >
      <!-- </scroll-view> -->
    </div>
  </div>
</template>

<script>
import { config } from "../../utils/index";

export default {
  data() {
    return {
      prefix: config.prefix,
      innerAudioContext: wx.createInnerAudioContext(),
      currentSpot: {},
      fullHeight: "",
      activeIndex: 1,
      toView: "spot1",
      titleSrc:
        "https://gw.alicdn.com/tfs/TB1K_SBi4jaK1RjSZFAXXbdLFXa-222-146.png",
      fullSpot: [],
      isIPX: false,
      isIPXS: false,
      isIP5: false,
      isPlus: false,
      showRoadSelect: false,
      tab1: false,
      tab2: false,
      lineIndex: 98,
      windowHeight: 0,
      firstY: 0,
      isPlaying: false
    };
  },

  computed: {
    margin() {
      if (this.isPlus || this.isIP5) {
        return `7.43%`;
      }
      return `7.37%`;
    },
    calcRight() {
      const a = this.activeIndex % 6;
      switch (a) {
        case 0:
          return -140;
        case 1:
          return -20;
        case 2:
          // 处女座说,必须调整,所以0改成-16
          return -120;
        case 3:
          return -280;
        case 4:
          return -400;
        case 5:
          return -280;
      }
    }
  },

  components: {},

  methods: {
    toggleAutoPlay() {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        this.playAudio();
      } else {
        this.stopAudio();
      }
    },
    playAudio() {
      // console.log(this.currentSpot.spot_id)
      if (!this.isPlaying) {
        return;
      }
      wx.request({
        url: config.base + "attraction/listdetail", //开发者服务器接口地址",
        data: {
          spot_id: this.currentSpot.spot_id
        }, //请求的参数",
        method: "GET",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data.data);
          this.audioUrl = res.data.data.audio_url;
          if (this.audioUrl) {
            this.innerAudioContext.src = this.audioUrl;
            this.innerAudioContext.play();
          }
        }
      });
    },
    stopAudio() {
      this.innerAudioContext.stop();
    },
    roadready(e) {
      this.fullHeight = e.target.height;
    },
    setStorage(key, val) {
      try {
        wx.setStorageSync(key, val);
      } catch (e) {
        wx.setStorage(key, val);
      }
    },
    getStorage(key) {
      try {
        wx.getStorageSync(key);
      } catch (e) {
        wx.getStorage(key);
      }
    },
    bindTab(url) {
      wx.navigateTo({ url: url });
    },
    goDetail() {
      // 备注:因为二维码从1开始计数,所以放到list中再去-1
      const index = parseInt(this.activeIndex);
      wx.navigateTo({ url: "../list/main?spot_index=" + index });
    },
    showRoadName() {
      this.showRoadSelect = true;
    },
    toSmallLine(index) {
      let lineNo = parseInt(index + 1);
      let top;
      switch (lineNo) {
        case 1:
          top = 0;
          this.activeIndex = 1;
          this.lineIndex = 0;
          break;
        case 2:
          top = this.isIP5 ? 1700 : 2000;
          if (this.isPlus) {
            top = 2100;
          }
          if (this.isIPX) {
            top = 1900;
          }
          this.activeIndex = 30;
          this.lineIndex = 1;
          break;
        case 3:
          top = this.isIP5 ? 2100 : 2500;
          if (this.isPlus) {
            top = 2850;
          }
          if (this.isIPX) {
            top = 2400;
          }
          this.activeIndex = 38;
          this.lineIndex = 2;
          break;
        case 4:
          top = this.isIP5 ? 2700 : 3200;
          if (this.isPlus) {
            top = 3600;
          }
          if (this.isIPX) {
            top = 3000;
          }
          this.activeIndex = 48;
          this.lineIndex = 3;
          break;
        case 5:
          top = this.isIP5 ? 3200 : 3800;
          if (this.isPlus) {
            top = 4300;
          }
          this.activeIndex = 58;
          this.lineIndex = 4;
          break;
        case 99:
          top = 0;
          this.activeIndex = 1;
          this.lineIndex = 98;
          break;
      }
      this.currentSpot = this.spotList[this.activeIndex - 1];
      wx.pageScrollTo({
        scrollTop: top,
        duration: 0
      });
      this.showRoadSelect = false;
      this.tab1 = false;
    },
    chooseSpot(item, index) {
      console.log("chooseSpot", item, index);
      this.activeIndex = index + 1;
      this.currentSpot = this.spotList[index];

      if (this.isPlaying) {
        this.stopAudio();
        this.playAudio();
      }
    },
    firstSpot() {
      this.activeIndex = 1;
      this.currentSpot = this.spotList[0];
      if (this.isPlaying) {
        this.stopAudio();
        this.playAudio();
      }
    },
    getSpot() {
      const self = this;
      let process = data => {
        this.spotList = data;
        this.currentSpot = data[0];
        this.fullSpot.length = 0;
        for (let i = 0; i <= data.length; i++) {
          let item = { num: i + 1, y: this._fy(i) };
          this.fullSpot.push(item);
        }
      };
      const storageData = wx.getStorageSync("DaluList").slice(0, 63);
      if (storageData) {
        process(storageData);
        return;
      }
      wx.request({
        url: config.base + "attraction/List", //开发者服务器接口地址",
        data: {
          lineId: config.lineId
        }, //请求的参数",
        method: "GET",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          // console.log(res)
          // self.GLOBAL.spot_list = res.data.data
          const data = res.data.data;
          this.setStorage("DaluList", data);
          process(data);
        },
        fail: () => {},
        complete: () => {}
      });
    },

    /**
     * 计算序号的位置跟x的偏移的关系
     * 规律:
     * 0,1,2,3,4,5为一个周期,对应的x的偏移为0,1,2,3,2,1
     * f(x) = dict[x%6]
     * 又因为最开始的1出现在偏移为2的位置,所以
     * g(x) = dict[(x+1)%6]
     */
    _fx(x) {
      let dict = this._getMarginXDict();
      return dict[x % 6];
    },
    _getMarginXDict() {
      return [20, 30, 40, 50];
    },
    /**
     * 计算序号的位置跟y的偏移关系
     * 规律:
     * 因为图片很长,并且不是完全的等差,所以需要分段进行重新定位
     * 每个序号属于某个分段,它的y偏移为分段的初始偏移加上跟分段相对偏移
     * f1(x)返回序号属于的第几个分段的偏移
     * 一个分段,最后一个数字是4
     * f1(x) = dict[INT((x+1)/6)]
     * f2(x)返回序号在分段中的相对偏移
     * 简单递增
     * f2(x) = deltaY * ((x+1)%6)
     * 所以,总偏移f(x)= f1(x) + f2(x)
     *
     */
    _fy(x) {
      return this._fy1(x) + this._fy2(x);
    },
    _fy1(x) {
      let dict = this._getMarginYDict();
      return dict[parseInt(x / 6)];
    },
    _fy2(x) {
      let deltaY = this._getDeltaY(x);
      return deltaY * (x % 6);
    },
    _getDeltaY(x) {
      let index = parseInt(x / 6);
      let dict = this._getMarginYDict();
      let rst = dict[index + 1] ? (dict[index + 1] - dict[index]) / 6 : 1.63;
      console.log(index, dict[index + 1], dict[index], rst);
      return rst;
    },
    _getMarginYDict() {
      let arr = [
        5.26,
        15.235,
        24.94,
        34.74,
        44.54,
        54.34,
        64.14,
        73.94,
        83.74,
        93.54,
        103.34
      ];
      return arr;
    }
  },
  mounted() {},
  onLoad(option) {
    console.log("index option", option);
    if (option.share_from) {
      if (option.share_from === "list") {
        this.bindTab(
          `../${option.share_from}/main?spot_index=${option.spot_index}`
        );
      } else {
        this.bindTab(`../${option.share_from}/main`);
      }
    }
    // 判断是否第一次使用
    const firsttime = wx.getStorageSync("firsttime");
    if (!firsttime) {
      const url = "../first/main";
      wx.redirectTo({ url: url });
    } else {
      console.log(firsttime);
    }
    this.getSpot();
    wx.getSystemInfo({
      success: res => {
        console.log("model", res);
        this.windowHeight = res.windowHeight;
        if (res.model.indexOf("iPhone X") >= 0) {
          console.log("isIPX");
          this.isIPX = true;
        }
        if (
          res.model.indexOf("iPhone 6 Plus") >= 0 ||
          res.model.indexOf("iPhone 7 Plus") >= 0 ||
          res.model.indexOf("iPhone 8 Plus") >= 0
        ) {
          console.log("isPlus");
          this.isPlus = true;
        }
        if (res.model.indexOf("iPhone 5") >= 0) {
          console.log("isIP5");
          this.isIP5 = true;
        }
        if (res.model.indexOf("iPhone11") >= 0) {
          console.log("model is iphone xs");
          this.isIPXS = true;
        }
      }
    });
  },
  created() {
    this.innerAudioContext.onPlay(() => {
      console.log("audio play");
    });
    this.innerAudioContext.onEnded(() => {
      console.log("audio end");
      let index = this.spotList.indexOf(this.currentSpot);
      console.log(index);
      if (this.spotList[index + 1]) {
        this.chooseSpot(null, index + 1);
      }
    });
    // this.toView = 'spot12'
  },
  onReady() {},
  onShow() {},
  onHide() {
    this.isPlaying = false;
    this.innerAudioContext.stop();
  },
  onUnload() {
    this.isPlaying = false;
    this.innerAudioContext.stop();
  }
};
</script>

<style scoped lang="less">
// z-index: 右上角菜单，21,顶部标题图，21
.container {
  position: relative;
  overflow: hidden;
  height: 9100rpx;
  background: #b4deda;
  // background: url("https://gw.alicdn.com/tfs/TB15F6gv3HqK1RjSZFkXXX.WFXa-640-6997.png")
  //   no-repeat top/cover;
}
@navHeight: 98rpx;
.navi {
  height: @navHeight;
  background: #fff;
  color: #101010;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 28rpx;
  flex-direction: row;
  width: 224%;
  &-item {
    margin-left: 36rpx;
  }
  &-scroll {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 40;
  }
  .active {
    color: #2b9f62;
  }
}
.spot {
  width: 100%;
  position: absolute;
  height: 100%;
  // top: 2.8%;
  &-item.active {
    position: relative;
    background: url("https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/green.png")
      no-repeat center/100%;
  }
  &-item.active:after {
    content: "";
    width: 28rpx;
    height: 24rpx;
    display: block;
    position: absolute;
    right: -10rpx;
    top: 15rpx;
    background: url("https://gw.alicdn.com/tfs/TB1yEvqv5LaK1RjSZFxXXamPFXa-28-24.png")
      no-repeat center/100%;
  }
  &-item {
    // position: relative;
    position: absolute;
    z-index: 30;
    width: 70rpx;
    height: 82rpx;
    line-height: 82rpx;
    text-align: center;
    color: #fff;
    font-size: 34rpx;
    margin-bottom: 7.27%;
    .number {
      background: url("https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/gray.png")
        no-repeat center/100%;
      transform: scale(1.3);
      &.active {
        position: relative;
        background: url("https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/green.png")
          no-repeat center/100%;
      }
      &.active:after {
        content: "";
        width: 28rpx;
        height: 24rpx;
        display: block;
        position: absolute;
        right: -10rpx;
        top: 15rpx;
        background: url("https://gw.alicdn.com/tfs/TB1yEvqv5LaK1RjSZFxXXamPFXa-28-24.png")
          no-repeat center/100%;
      }
    }
    &-window {
      width: 522rpx;
      height: 176rpx;
      border-bottom: 1px solid #c7c7c7;
      background: url("https://dl-line.oss-cn-shenzhen.aliyuncs.com/list/knowledge%20_summary.png")
        no-repeat center/contain;
      position: absolute;
      bottom: 106rpx;
      z-index: 30;
      display: flex;
      &-pic {
        width: 136rpx;
        height: 134rpx;
        background: #fff;
        margin: 12rpx 12rpx 0 32rpx;
      }
      &-text {
        width: 280rpx;
        display: flex;
        flex-direction: column;
        color: #101010;
        text-align: left;
        overflow: hidden;
      }
      &-title {
        margin-top: 45rpx;
        font-size: 28rpx;
        line-height: 40rpx;
        white-space: nowrap;
      }
      &-desc {
        font-size: 20rpx;
        color: #6f6f6f;
        line-height: 30rpx;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 2; /** 显示的行数 **/
        overflow: hidden; /** 隐藏超出的内容 **/
      }
    }
    &-tri {
      width: 52rpx;
      height: 30rpx;
      background: url("https://gw.alicdn.com/tfs/TB1C0d3nwHqK1RjSZFkXXX.WFXa-181-96.png")
        no-repeat center/cover;
      position: absolute;
      top: -28rpx;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 31;
    }
  }
  &-item:nth-of-type(6n + 2) {
    margin-left: 52%;
  }
  &-item:nth-of-type(6n + 3) {
    margin-left: 32%;
  }
  &-item:nth-of-type(6n + 1) {
    margin-left: 70%;
  }
  &-item:nth-of-type(6n + 4) {
    margin-left: 15%;
  }
  &-item:nth-of-type(6n) {
    margin-left: 52%;
  }
  &-item:nth-of-type(6n + 5) {
    margin-left: 32%;
  }
}
.scroll {
  position: relative;
  top: @navHeight;
  left: -37rpx;
  // height: 100%;
  // background: url("https://gw.alicdn.com/tfs/TB15F6gv3HqK1RjSZFkXXX.WFXa-640-6997.png") no-repeat top/cover;
  &-title {
    width: 402rpx;
    height: 278rpx;
    position: absolute;
    top: 40rpx;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 21;
    .logo {
      width: 100%;
      height: 100%;
    }
    &-body {
      width: 402rpx;
      height: 210rpx;
      position: absolute;
      top: 68rpx;
      z-index: 22;
    }
    &-text {
      width: 286rpx;
      height: 60rpx;
      position: absolute;
      top: 180rpx;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 23;
    }
    &-pic {
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      border: 12rpx solid #2b9f62;
    }
  }
  &-road {
    position: absolute;
    top: 2.7%;
    height: 7967rpx;
  }
  &-bg {
    width: 100%;
    // height: 100%;
  }
}
.index-tab {
  position: fixed;
  top: 140rpx;
  right: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  z-index: 21;
  // transform: scale(1.2);
  &-item {
    width: 120rpx;
    height: 98rpx;
    margin-bottom: 68rpx;
    position: relative;
    z-index: 23;
    // transform: scale(1.1);
    &.first {
      height: 114rpx;
    }
  }
  &-line {
    width: 1px;
    height: 90%;
    background-image: url("https://gw.alicdn.com/tfs/TB1KyaQv9rqK1RjSZK9XXXyypXa-1-780.png");
    background-repeat: repeat-y;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 10rpx;
    right: 44rpx;
    z-index: 22;
  }
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.cover {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 80;
  top: 0;
  left: 0;
}
.modal {
  width: 100%;
  position: fixed;
  z-index: 82;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  &-tab {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: #fff;
    &-title {
      height: 150rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      &-logo {
        width: 76rpx;
        height: 76rpx;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid #292770;
        margin-right: 14rpx;
      }
      &-text {
        display: flex;
        flex-direction: column;
        font-size: 28rpx;
        line-height: 34rpx;
        font-weight: bold;
      }
      &-icon {
        width: 22rpx;
        height: 26rpx;
        margin-top: 36rpx;
        margin-left: 20rpx;
      }
    }
    &-content {
      text-align: center;
      line-height: 80rpx;
      font-size: 28rpx;
      background: #f6f7f6;
      &-item:hover {
        color: #a8368e;
      }
    }
  }
}
.rotate {
  transform: rotate(180deg);
}
.scroll-road {
  width: 90%;
}
</style>
