<template>
  <div class="container">
    <div class="nav">
      <div class="top">
        <div class="nav-line"></div>
        <div class="nav-content">
          <div class="nav-item" :class="audioOff?'audio':'pause'" @click="playAudio"></div>
          <!-- <div class="point"></div> -->
          <div class="nav-item note" @click="showCover = true"></div>
          <!-- <div class="point"></div> -->
          <div class="nav-item" :class="lang=='ch'?'chinese':'english'" @click="changeLang"></div>
          <!-- <div class="point"></div> -->
          <div class="nav-item share">
            <button style="width:100%;height:100%;opacity:0;padding:0;" open-type="share"></button>
          </div>
        </div>
        <div class="nav-line"></div>
      </div>
      <div class="nav-border left"></div>
      <div class="nav-border right"></div>
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
        <div class="url-content" v-for="(urlItem,urlIndex) in item.url" :key="urlIndex">
          <img class="article-img" :src="prefix + urlItem.url" mode="widthFix">
          <div class="article-title-url" v-if="urlItem.title">{{urlItem.title}}</div>
        </div>
      </div>
      <!-- <div class="writer" v-if="articleData[1]">
        <div class="writer-title">{{articleData[1].title}}</div>
        <div class="writer-text" v-html="articleData[1].content"></div>
      </div>-->
    </div>
    <div class="cover" v-if="showCover"></div>
    <div class="ruleLayer" v-if="showCover">
      <scroll-view scroll-y class="ruleLayer-main">
        <img
          mode="widthFix"
          src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/Other/Copyright.jpg"
          alt
        >
      </scroll-view>
      <div class="close" @click="showCover = false"></div>
    </div>
  </div>
</template>

<script>
import { config } from "../../utils/index";
export default {
  data() {
    return {
      showCover: false,
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
      let lang = this.lang;
      let url =
        lang === "ch"
          ? config.base + "attraction/listdetail"
          : config.base + "attraction/englishlistdetail";
     
      wx.request({
        url: url, //开发者服务器接口地址",
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
        fail: () => {
        },
        complete: () => {
        }
      });
    },
    getSpot() {
      let storageName = "DaluList";
      let storageData;
      let requestUrl = "attraction/List";
      return new Promise(resolve => {
        storageData = this.getStorage(storageName);
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
              const data = res.data.data;
              resolve(data);
            }
          });
        }
      });
    },
    changeLang() {
      this.lang = this.lang === "ch" ? "en" : "ch";
      this.setStorage("list-lang", this.lang);
      this.loadDetail();
    }
  },
  onLoad(option) {
    console.log("list option", option);
    // 使用默认的语言
    // 没有默认,就用中文(ch)
    this.lang = wx.getStorageSync("list-lang") || "ch";
    let currentId = '';
    // 获取数据
    if (option.spot_id) {
      currentId = option.spot_id;
      let url =
        this.lang === "ch"
          ? config.base + "attraction/listdetail"
          : config.base + "attraction/englishlistdetail";
      wx.request({
        url: url, //开发者服务器接口地址",
        data: {
          spot_id: option.spot_id
        }, //请求的参数",
        method: "GET",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data.data);
          // this.articleData = res.data.data.items
          this.articleData = this.formatDetail(res.data.data.items);
          this.audioUrl = res.data.data.audio_url || '';
          this.videoUrl =
            res.data.data.video_url == null
              ? ""
              : config.prefix + res.data.data.video_url;
          this.innerAudioContext = wx.createInnerAudioContext();
          if (this.audioUrl) {
            this.innerAudioContext.src = this.audioUrl;
          }
        },
        fail: () => {
        }
      });
    }

    if (option.spot_index) {
      const index = option.spot_index - 1;
      this.currentIndex = index;
    }
    
    this.getSpot().then(data => {
      this.spotList = data;
      this.spotList.forEach((item,index) => {
        if (item.spot_id == currentId) {
          this.currentIndex = index;
        }
      })
      this.loadDetail();
    });
    // 音频
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
      // this.loadDetail();
    }
    // this.innerAudioContext = wx.createInnerAudioContext();
  },
  onReady() {
    console.log("onReady");
  },
  onShareAppMessage(result) {
    let path =
      `/pages/index/main?share_from=list&spot_index=${this.currentIndex}`;
    // let title = `share_from=list&spot_index=${this.currentIndex}`;;
    let title = "鹿咀自然课堂步道";
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
  // background: url("https://gw.alicdn.com/tfs/TB1GOmAvVYqK1RjSZLeXXbXppXa-640-1881.png")
  // repeat-y top/cover;
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
    top: -20rpx;
    height: @size;
    color: #095d31;
    font-size: 36rpx;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20rpx;
    text-align: center;
    background: url("https://gw.alicdn.com/tfs/TB1fuG0v3HqK1RjSZFkXXX.WFXa-630-94.png")
      no-repeat center/contain;
  }
}
.url-content {
  padding: 0 20rpx;
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
  &-title-url {
    text-align: left;
    // height: 32rpx;
    font-size: 28rpx;
    line-height: 28rpx;
    padding: 10rpx 0 40rpx;
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
    transform: translateY(15rpx);
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
    // margin-bottom: 15rpx;
    position: relative;
  }
  &-line {
    height: 8rpx;
    width: 15%;
    background: #fff;
  }
  .audio {
    transform: translateX(-12rpx);

    background: url("https://dl-line.oss-cn-shenzhen.aliyuncs.com/detail/play.png")
      no-repeat center/contain;
  }
  .pause {
    transform: translateX(-12rpx);

    background: url("https://dl-line.oss-cn-shenzhen.aliyuncs.com/detail/stop.png")
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
    background: url("https://dl-line.oss-cn-shenzhen.aliyuncs.com/detail/en.png")
      no-repeat center/contain;
  }
  .chinese {
    // margin-left: 6%;
    background: url("https://dl-line.oss-cn-shenzhen.aliyuncs.com/detail/zh.png")
      no-repeat center/contain;
  }
  .note {
    // margin-left: 6%;
    background: url("https://dl-line.oss-cn-shenzhen.aliyuncs.com/detail/copyright.png")
      no-repeat center/contain;
  }
  .share {
    // margin-left: 6%;
    background: url("https://dl-line.oss-cn-shenzhen.aliyuncs.com/detail/share.png")
      no-repeat center/contain;
    transform: translateX(12rpx);
  }
  &-border {
    position: absolute;
    top: 43%;
    // left: 0;
    // width: 100%;
    width: 8rpx;
    box-sizing: border-box;
    height: @h / 2;
    background-color: #fff;
    // border-left: 8rpx solid #fff;
    // border-right: 8rpx solid #fff;
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
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
.cover {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 80;
  top: 0;
  left: 0;
}
.ruleLayer {
  width: 500rpx;
  height: 760rpx;
  position: fixed;
  z-index: 81;
  top: 20%;
  left: 0;
  right: 0;
  margin: auto;
  &-main {
    width: 500rpx;
    height: 760rpx;
    img {
      width: 100%;
    }
  }
}
.close {
  width: 70rpx;
  height: 142rpx;
  background: url("https://gw.alicdn.com/tfs/TB1bzrMwMHqK1RjSZJnXXbNLpXa-60-132.png")
    no-repeat top/cover;
  position: absolute;
  right: 0;
  top: -138rpx;
  z-index: 81;
}
</style>
