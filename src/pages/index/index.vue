<template>
  <!-- <div class="container" :style="{height:bodyHeight}"> -->
  <div class="container">
    <div class="index-tab">
      <div class="index-tab-item icon-list">
        <img src="https://gw.alicdn.com/tfs/TB1v2WWv7voK1RjSZPfXXXPKFXa-107-105.png">
      </div>
      <div class="index-tab-item icon-map" @click="bindTab('../my-map/main?queryType=0')">
        <img src="https://gw.alicdn.com/tfs/TB1fwGTv4TpK1RjSZR0XXbEwXXa-104-96.png" alt>
      </div>
      <div class="index-tab-item icon-audio" @click="playAudio">
        <img
          src="https://gw.alicdn.com/tfs/TB1OCGWv4TpK1RjSZFGXXcHqFXa-104-95.png"
          alt
          v-if="!isPlaying"
        >
        <img
          src="https://gw.alicdn.com/tfs/TB1N1O0v9zqK1RjSZFpXXakSXXa-104-95.png"
          alt
          v-if="isPlaying"
        >
      </div>
      <div class="index-tab-item icon-video" @click="bindTab('../video/main')">
        <img src="https://gw.alicdn.com/tfs/TB1gTqYv9zqK1RjSZFHXXb3CpXa-104-96.png">
      </div>
      <div class="index-tab-item icon-scan" @click="bindTab('../scan/main')">
        <img src="https://gw.alicdn.com/tfs/TB1isa6v3HqK1RjSZFkXXX.WFXa-104-96.png" alt>
      </div>
      <div class="index-tab-item icon-quiz" @click="bindTab('../quiz/main')">
      <!-- <div class="index-tab-item icon-quiz" @click="bindTab('../developing/main')"> -->
        <img src="https://gw.alicdn.com/tfs/TB1OOfmv4jaK1RjSZKzXXXVwXXa-104-96.png" alt>
      </div>
      <div class="index-tab-item icon-my" @click="bindTab('../my/main')">
        <img src="https://gw.alicdn.com/tfs/TB1q8Tmv4jaK1RjSZKzXXXVwXXa-105-95.png" alt>
      </div>
      <div class="index-tab-line"></div>
    </div>
    <scroll-view scroll-y class="scroll" :scroll-into-view="toView">
      <div class="scroll-title">
        <img :src="titleSrc" class="scroll-title-pic">
        <img
          src="https://gw.alicdn.com/tfs/TB1ZJh6mSzqK1RjSZPxXXc4tVXa-245-52.png"
          class="scroll-title-text"
        >
        <img
          src="https://gw.alicdn.com/tfs/TB1CQ53v7voK1RjSZFNXXcxMVXa-343-214.png"
          class="scroll-title-body"
        >
      </div>
      <div class="spot">
        <div
          class="spot-item"
          v-for="(item,index) in fullSpot"
          :key="index"
          :class="activeIndex == index+1?'active':''"
          :id="'spot'+item.num"
          :style="{top:item.y+'%'}"
        >
          <div @click="chooseSpot(item,index)">{{item.num}}</div>
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
              v-if="currentSpot.spot_coverurl"
            >
            <div class="spot-item-window-text">
              <div class="spot-item-window-title">{{currentSpot.spot_title}}</div>
              <div class="spot-item-window-desc">{{currentSpot.spot_describe}}</div>
            </div>
          </div>
        </div>
      </div>
      <img src="https://gw.alicdn.com/tfs/TB1HJvXv4TpK1RjSZFGXXcHqFXa-519-6810.png" class="scroll-road">
      <!-- <img
        src="https://gw.alicdn.com/tfs/TB1_D55vYvpK1RjSZFqXXcXUVXa-469-6810.png"
        mode="widthFix"
        class="scroll-road"
      > -->
      <img
        src="https://gw.alicdn.com/tfs/TB15F6gv3HqK1RjSZFkXXX.WFXa-640-6997.png"
        class="scroll-bg"
        @load="finishLoadImg"
      >
      <!-- <img
        src="https://gw.alicdn.com/tfs/TB1VnYrv4naK1RjSZFtXXbC2VXa-640-6997.png"
        mode="widthFix"
        class="scroll-bg"
        style="height: 6316px;"
        @load="finishLoadImg"
      > -->
    </scroll-view>
    <div class="cover" @click="showRoadSelect = false" v-if="showRoadSelect"></div>
    <div class="modal" v-if="showRoadSelect">
      <div class="modal-tab">
        <div class="modal-tab-title" @click="tab1 = !tab1">
          <img
            src="https://gw.alicdn.com/tfs/TB1uLyAnxjaK1RjSZKzXXXVwXXa-80-80.png"
            class="modal-tab-title-logo"
          >
          <div class="modal-tab-title-text">
            <div class="modal-tab-title-text-stage">第一段</div>
            <div class="modal-tab-title-text-name">自然研习径</div>
          </div>
          <img
            class="modal-tab-title-icon"
            :class="tab1?'':'rotate'"
            src="https://gw.alicdn.com/tfs/TB19EKcnpzqK1RjSZFvXXcB7VXa-22-25.png"
          >
        </div>
        <!-- <div class="modal-tab-content" v-if="tab1"> -->
        <div class="modal-tab-content" v-if="1">
          <div
            class="modal-tab-content-item"
            v-for="(item,index) in natureList"
            :key="index"
            @click="toSmallLine(index)"
          >{{item}}</div>
        </div>
      </div>
      <div class="modal-tab">
        <div class="modal-tab-title" @click="bindTab('../index-sg/main')">
          <img
            src="https://gw.alicdn.com/tfs/TB1WEmfnxTpK1RjSZFMXXbG_VXa-79-80.png"
            class="modal-tab-title-logo"
          >
          <div class="modal-tab-title-text">
            <div class="modal-tab-title-text-stage">第二段</div>
            <div class="modal-tab-title-text-name">诗歌研习径</div>
          </div>
          <img
            class="modal-tab-title-icon"
            :class="tab2?'':'rotate'"
            src="https://gw.alicdn.com/tfs/TB19EKcnpzqK1RjSZFvXXcB7VXa-22-25.png"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { config } from "../../utils/index";

export default {
  data() {
    return {
      prefix: config.prefix,
      currentSpot: {
        spot_coverurl: "",
        spot_title: "",
        spot_describe: "",
        spot_id: ""
      },
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
      isPlaying: false,
      innerAudioContext: wx.createInnerAudioContext(),
      showRoadSelect: false,
      tab1: false,
      tab2: false,
      natureList: [
        "滨海线研习段",
        "二线关研习段",
        "大岭古研习段",
        "红花岭水库研习段",
        "洞背村研习段"
      ],
      windowHeight: 0,
      firstY: 0
    };
  },

  computed: {
    bodyHeight() {
      let full_h;
      full_h = 620;
      if (this.isIPX) {
        full_h = 444;
      } else if (this.isIPXS) {
        full_h = 444;
      } else if (this.isIP5) {
        full_h = 545;
      }
      let h = parseInt(full_h);
      return `${h}%`;
    },
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
          return -260;
        case 1:
          return -120;
        case 2:
          // 处女座说,必须调整,所以0改成-16
          return -16;
        case 3:
          return -116;
        case 4:
          return -250;
        case 5:
          return -380;
      }
    }
  },

  components: {},

  methods: {
    finishLoadImg(e) {
      console.log(e.target);
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
          break;
        case 2:
          top = this.isIP5 ? 1000 : 1100;
          this.activeIndex = 20;
          break;
        case 3:
          top = this.isIP5 ? 1600 : 1800;
          this.activeIndex = 32;
          break;
        case 4:
          top = this.isIP5 ? 2350 : 2700;
          this.activeIndex = 47;
          break;
        case 5:
          top = this.isIP5 ? 3200 : 3700;
          this.activeIndex = 64;
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
      this.activeIndex == index + 1
        ? (this.activeIndex = -1)
        : (this.activeIndex = index + 1);
      this.currentSpot = this.spotList[this.activeIndex - 1];
    },
    firstSpot() {
      this.activeIndex = 1;
      this.currentSpot = this.spotList[0];
    },
    playAudio() {
      // console.log(this.currentSpot.spot_id)
      if (this.isPlaying) {
        this.innerAudioContext.stop();
        this.isPlaying = false;
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
          this.audioUrl =
            res.data.data.audio_url == null
              ? ""
              : config.prefix + res.data.data.audio_url;
          if (this.audioUrl) {
            this.innerAudioContext.src = this.audioUrl;
            this.innerAudioContext.play();
            this.isPlaying = true;
          }
        },
        fail: () => {},
        complete: () => {}
      });
    },
    login(code) {
      const userInfo = wx.getStorageSync("userInfo");
      wx.request({
        url: config.base + "wxlogin/login",
        data: {
          code: code,
          lineId: config.lineId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          city: userInfo.city,
          province: userInfo.province,
          country: userInfo.country
        },
        method: "GET",
        dataType: "json",
        success: res => {
          // console.log('login',res.data.data)
          this.setStorage("userCode", res.data.data);
        },
        fail: err => {
          console.log("hasError", err);
        }
      });
    },
    getSpot() {
      const self = this;
      let process = data => {
        this.spotList = storageData;
        this.currentSpot = storageData[0];
        this.fullSpot.length = 0;
        for (let i = 0; i <= data.length; i++) {
          let item = { num: i+1, y: this._fy(i) };
          this.fullSpot.push(item);
        }
      };
      const storageData = wx.getStorageSync("NatureList").slice(0,63);
      if (storageData) {
        process(storageData);
        return;
      }
      wx.request({
        url: config.base + "attraction/NaturalList", //开发者服务器接口地址",
        data: {
          lineId: config.lineId
        }, //请求的参数",
        method: "GET",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          // console.log(res)
          // self.GLOBAL.spot_list = res.data.data
          const data = res.data.data.slice(0,63);
          this.setStorage("NatureList", data);
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
      return dict[(x) % 6];
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
      return dict[parseInt((x + 1) / 6)];
    },
    _fy2(x) {
      let deltaY = this._getDeltaY(x);
      return deltaY * ((x + 1) % 6);
    },
    _getDeltaY(x) {
      let index = parseInt((x + 1) / 6);
      let dict = this._getMarginYDict();
      let rst = dict[index + 1] ? (dict[index + 1] - dict[index]) / 6 : 1.05;
      console.log(index, dict[index + 1], dict[index], rst);
      return rst;
    },
    _getMarginYDict() {
      return [
        4,
        12.94,
        21.88,
        30.82,
        39.76,
        48.7,
        57.64,
        66.58,
        75.52,
        84.46,
        93.8,
        100
      ];
    }
  },
  mounted() {
    this.getSpot();
  },
  onLoad() {
    // 判断是否第一次使用
    const firsttime = wx.getStorageSync("firsttime");
    if (!firsttime) {
      const url = "../first/main";
      wx.redirectTo({ url: url });
    } else {
      console.log(firsttime);
    }
    wx.getSystemInfo({
      success: res => {
        console.log("model", res);
        this.windowHeight = res.windowHeight;
        if (res.model.indexOf("iPhone X") >= 0) {
          this.isIPX = true;
        }
        if (
          res.model.indexOf("iPhone 6 Plus") ||
          res.model.indexOf("iPhone 7 Plus") ||
          res.model.indexOf("iPhone 8 Plus")
        ) {
          this.isPlus = true;
        }
        if (res.model.indexOf("iPhone 5") >= 0) {
          this.isIP5 = true;
        }
        if (res.model.indexOf("iPhone11") >= 0) {
          console.log("model is iphone xs");
          this.isIPXS = true;
        }
      }
    });
  },
  onReady() {
    // this.toView = 'spot12'
  },
  onShow() {},
  onHide() {
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
  height: 8186rpx;
}
.spot {
  width: 100%;
  position: absolute;
  height: 100%;
  // top: 2.8%;
  &-item.active {
    position: relative;
    background: url("https://gw.alicdn.com/tfs/TB1k55YvYPpK1RjSZFFXXa5PpXa-72-72.png")
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
    background: url("https://gw.alicdn.com/tfs/TB1yx12v5rpK1RjSZFhXXXSdXXa-72-72.png")
      no-repeat center/100%;
    margin-bottom: 7.27%;
    &-window {
      width: 522rpx;
      height: 176rpx;
      border-bottom: 1px solid #c7c7c7;
      background: url("https://gw.alicdn.com/tfs/TB1.crTvQvoK1RjSZFNXXcxMVXa-500-168.png")
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
    margin-left: 50%;
  }
  &-item:nth-of-type(6n + 3) {
    margin-left: 32%;
  }
  &-item:nth-of-type(6n + 1) {
    margin-left: 64%;
  }
  &-item:nth-of-type(6n + 4) {
    margin-left: 18%;
  }
  &-item:nth-of-type(6n) {
    margin-left: 50%;
  }
  &-item:nth-of-type(6n + 5) {
    margin-left: 32%;
  }
}
.scroll {
  position: relative;
  &-title {
    width: 402rpx;
    height: 234rpx;
    position: absolute;
    top: 0.1%;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 21;
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
    height: 8186rpx;
  }
}
.index-tab {
  position: fixed;
  top: 15rpx;
  right: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  z-index: 21;
  &-item {
    width: 120rpx;
    height: 110rpx;
    margin-bottom: 36rpx;
    position: relative;
    z-index: 23;
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
</style>
