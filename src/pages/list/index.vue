<template>
  <div class="container">
    <div class="nav">
      <div class="top">
        <div class="nav-line"></div>
        <div class="nav-content">
          <div class="nav-item" :class="audioOff?'audio':'pause'" @click="playAudio"></div>
          <div class="point"></div>
          <div
            class="nav-item"
            :class="lang=='ch'?'chinese':'english'"
            @click="lang=='ch'?lang='en':lang='ch'"
          ></div>
          <div class="point"></div>
          <div class="nav-item note" v-if="false"></div>
          <!-- <button class="nav-item share" style="margin-left:0;margin-right:0;" open-type="share"></button> -->
          <div class="nav-item share">
            <button style="width:100%;height:100%;opacity:0;padding:0;" open-type="share"></button>
          </div>
        </div>
        <div class="nav-line"></div>
      </div>
      <div class="nav-border"></div>
    </div>
    <div class="main" v-for="(item,index) in articleData" :key="index">
      <div class="bigtitle">{{item.title}}</div>
      <div class="article" v-if="item">
        <div v-if="item.author">
          <div class="article-author">{{item.author}}</div>
          <!-- <div class="article-title">{{item.title}}</div> -->
        </div>
        <!-- <div v-else>
          <div class="article-title-full">{{item.title}}</div>
        </div>-->
        <div class="article-text" v-html="item.content"></div>
      </div>
      <div v-if="item.url">
        <img
          v-for="(urlItem,urlIndex) in item.url"
          class="article-img"
          :key="urlIndex"
          :src="prefix + urlItem.url"
          mode="widthFix"
        >
      </div>
      <!-- <div class="writer" v-if="articleData[1]">
        <div class="writer-title">{{articleData[1].title}}</div>
        <div class="writer-text" v-html="articleData[1].content"></div>
      </div>-->
    </div>
  </div>
</template>

<script>
import { config } from "../../utils/index";
export default {
  data() {
    return {
      prefix: config.prefix,
      fromMap: false,
      showSub: false,
      innerAudioContext: null,
      lang: "ch",
      audioOff: true,
      audioUrl: "",
      mainPic: "",
      scrollTop: 0,
      init: false,
      sharebox: false,
      spotList: [],
      articleData: [],
      spotLine: "",
      currentIndex: 1,
      url: "/File/Download?fileName=DetailPhoto/01.jpg&fileType=QGLineFile"
    };
  },
  computed: {},
  components: {},

  methods: {
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
    bindTab() {
      this.fromMap
        ? wx.navigateTo({ url: "../map/main" })
        : wx.navigateTo({ url: "../index/main" });
      // wx.navigateBack();
    },
    displaySub() {
      this.showSub = !this.showSub;
    },
    playAudio() {
      if (this.audioOff) {
        this.audioOff = false;
        this.innerAudioContext.play();
      } else {
        this.audioOff = true;
        this.innerAudioContext.stop();
      }
    },
    goVideo() {
      if (!this.videoUrl) {
        wx.showToast({
          title: "暂无视频", //提示的内容,
          icon: "none",
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        return;
      }
      wx.navigateTo({ url: "../video/main?video_url=" + this.videoUrl });
    },
    showShareBox() {
      this.sharebox = true;
    },
    hideShareBox() {
      this.sharebox = false;
    },
    formatDetail(items) {
      let diver = "《";
      return items.map((n, i) => {
        if (i === 0 && n.title.indexOf(diver) >= 0) {
          let arr = n.title.split(diver);
          return Object.assign(n, { author: arr[0], title: diver + arr[1] });
        }
        return n;
      });
    },
    loadDetail() {
      this.audioOff = true;
      if (this.innerAudioContext) {
        this.innerAudioContext.stop();
      }
      let spot_id = this.spotList[this.currentIndex].spot_id;
      wx.request({
        url: config.base + "attraction/listdetail", //开发者服务器接口地址",
        data: {
          spot_id: spot_id
        }, //请求的参数",
        method: "GET",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data.data);
          // this.articleData = res.data.data.items
          this.articleData = this.formatDetail(res.data.data.items);
          this.innerAudioContext = wx.createInnerAudioContext();
          this.audioUrl = res.data.data.audio_url;
          this.videoUrl =
            res.data.data.video_url == null
              ? ""
              : config.prefix + res.data.data.video_url;
          if (this.audioUrl) {
            this.innerAudioContext.src = this.audioUrl;
          }
        },
        fail: () => {},
        complete: () => {}
      });
    },
    getSpot(line) {
      let storageName = "DaluList";
      let storageData;
      let requestUrl = "attraction/listDetail";
      return new Promise(resolve => {
        storageData = wx.getStorageSync(storageName);
        if (storageData) {
          resolve(storageData);
        } else {
          wx.request({
            url: config.base + requestUrl, //开发者服务器接口地址",
            data: {
              lineId: config.lineId
            }, //请求的参数",
            method: "GET",
            dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
            success: res => {
              const data = this.res.data.data;
              resolve(data);
            }
          });
        }
      });
    }
  },
  onLoad(option) {
    const index = option.spot_index - 1;
    this.currentIndex = index;
    console.log({ index });
    this.getSpot(this.spotLine).then(data => {
      this.spotList = data;
      this.loadDetail();
    });
    this.innerAudioContext = wx.createInnerAudioContext();
  },
  onHide() {
    this.audioOff = true;
    this.showSub = false;
    this.innerAudioContext.stop();
    this.init = true;
    // this.innerAudioContext = null
  },
  onUnload() {
    this.audioOff = true;
    this.showSub = false;
    this.innerAudioContext.stop();
    // this.innerAudioContext = null
  },
  onShow() {
    if (this.init) {
      this.loadDetail();
    }
    // this.innerAudioContext = wx.createInnerAudioContext();
  },
  onReady() {
    console.log("onReady");
  },
  onShareAppMessage(result) {
    let title = "鹿咀自然课堂步道";
    let path = "/pages/list/main?spot_index=" + this.activeIndex;
    let imageUrl = "../../assets/list-pic-1.png";
    // let desc = '这里是描述哦'
    // if (result.from === "button") {
    //   this.billId = "billId-" + new Date().getTime();
    //   title = "我发起了一个转发";
    //   path = `pages/index/main?billId=${this.billId}`;
    // }
    return {
      title,
      path,
      imageUrl,
      // desc,
      success: res => {
        console.log("success", res);
      },
      fail(e) {
        console.log(e);
      }
    };
  }
};
</script>

<style scoped lang="less">
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.container {
  position: relative;
  background: url("https://gw.alicdn.com/tfs/TB1GOmAvVYqK1RjSZLeXXbXppXa-640-1881.png")
    repeat-y top/cover;
  color: #fff;
  padding: 20rpx;
}
.sub-nav {
  position: absolute;
  top: 0;
  right: 25rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 66;
  &-line {
    width: 2px;
    height: 38rpx;
    background: #9e7044;
  }
  &-btn {
    width: 66rpx;
    height: 66rpx;
    border-radius: 50%;
    border: 2rpx solid #9e7044;
    background: #f6ca47;
    .center();
    &-in {
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      border: 2rpx solid #9e7044;
      background: #f7eec5;
      position: relative;
      .center();
    }
  }

  .btn-show {
    width: 30rpx;
    height: 16rpx;
  }
  .reverse {
    transform: rotateX(180deg);
  }
  .btn-audio {
    width: 30rpx;
    height: 26rpx;
  }
  .btn-video {
    width: 28rpx;
    height: 26rpx;
  }
  .btn-share {
    width: 24rpx;
    height: 28rpx;
  }
}
.main {
  @size: 110rpx;
  position: relative;
  margin-bottom: 40rpx;
  border: 9rpx solid #fff;
  border-top: none;
  background: rgba(0, 0, 0, 0.4);
  padding-top: @size;
  .bigtitle {
    position: absolute;
    left: -20rpx;
    right: -20rpx;
    margin: auto;
    top: 0;
    height: @size;
    color: #095d31;
    font-size: 36rpx;
    font-weight: bold;
    line-height: 100rpx;
    text-align: center;
    background: url("https://gw.alicdn.com/tfs/TB1fuG0v3HqK1RjSZFkXXX.WFXa-630-94.png")
      no-repeat top/cover;
  }
}
.article {
  padding: 16rpx;
  font-size: 36rpx;
  &-author {
    text-align: center;
    margin: 40rpx 0 10rpx;
  }
  &-title {
    text-align: center;
    margin-bottom: 40rpx;
  }
  &-title-full {
    text-align: center;
    margin: 40rpx 0;
  }
  &-text {
    font-size: 28rpx;
    line-height: 50rpx;
    letter-spacing: 2rpx;
  }
  &-img {
    // border-left: 8rpx solid #fff;
    // border-right: 8rpx solid #fff;
    // border-bottom: 8rpx solid #fff;
    // height: 400rpx;
    width: 100%;
  }
}
.writer {
  border: 8rpx solid #fff;
  padding: 20rpx;
  margin-top: -12rpx;
  &-title {
    text-align: left;
    font-size: 32rpx;
    margin: 40rpx 0;
  }
  &-text {
    font-size: 24rpx;
    line-height: 40rpx;
  }
}

.nav {
  @h: 140rpx;
  height: @h;
  position: relative;
  .top {
    display: flex;
    align-items: center;
  }
  &-content {
    width: 70%;
    // margin-left: 1.5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-item {
    width: 92rpx;
    height: 86rpx;
    margin-bottom: 15rpx;
    position: relative;
  }
  &-line {
    height: 8rpx;
    width: 15%;
    background: #fff;
  }
  .audio {
    background: url("https://gw.alicdn.com/tfs/TB1gKqwv3TqK1RjSZPhXXXfOFXa-73-78.png")
      no-repeat center/contain;
  }
  .pause {
    background: url("https://gw.alicdn.com/tfs/TB1.ayEv5rpK1RjSZFhXXXSdXXa-71-78.png")
      no-repeat center/contain;
  }
  // .audio:after,.video:after,.note:after,.pause:after{
  //   content:'';
  //   position: absolute;
  //   width: 12rpx;
  //   height: 12rpx;
  //   border-radius: 50%;
  //   background: #fff;
  //   right: -26rpx;top: 44rpx;
  // }
  .point {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: #fff;
    right: -26rpx;
    top: 44rpx;
  }
  .english {
    // margin-left: 6%;
    background: url("https://gw.alicdn.com/tfs/TB1c2i4v4YaK1RjSZFnXXa80pXa-79-78.png")
      no-repeat center/contain;
  }
  .chinese {
    // margin-left: 6%;
    background: url("https://gw.alicdn.com/tfs/TB1wmyZv3HqK1RjSZFkXXX.WFXa-79-78.png")
      no-repeat center/contain;
  }
  .note {
    // margin-left: 6%;
    background: url("https://gw.alicdn.com/tfs/TB1B3U6nxjaK1RjSZFAXXbdLFXa-91-83.png")
      no-repeat center/cover;
  }
  .share {
    // margin-left: 6%;
    background: url("https://gw.alicdn.com/tfs/TB13iiIv7zoK1RjSZFlXXai4VXa-82-78.png")
      no-repeat center/contain;
    transform: translateX(12rpx);
  }
  &-border {
    position: absolute;
    top: 38%;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    height: 100rpx;
    border-left: 8rpx solid #fff;
    border-right: 8rpx solid #fff;
  }
}
.share-box {
  width: 100%;
  height: 320rpx;
  background: #fff;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &-body {
    height: 220rpx;
    .center();
    &-item {
      position: relative;
      img {
        width: 144rpx;
        height: 168rpx;
        display: block;
      }
    }
  }
  &-close {
    width: 100%;
    height: 100rpx;
    background: #efefef;
    color: #000;
    font-size: 34rpx;
    text-align: center;
    line-height: 98rpx;
  }
}
.btn-share-origin {
  position: absolute;
  top: 0;
  left: 0;
  width: 144rpx;
  height: 168rpx;
  background: transparent;
  border: none;
}
.btn-share-origin::after {
  border: 0;
}
</style>
