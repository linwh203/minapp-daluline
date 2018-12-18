<template>
  <div class="container">
    <camera
      :device-position="cameraDirection"
      flash="off"
      binderror="error"
      class="cameraArea"
      v-if="!showResult"
    ></camera>
    <img class="cameraArea" v-if="showResult" :src="src">
    <div class="index-tab" style="color:#fff;font-size:24rpx;">
      <div class="index-tab-left">
        <img
          src="https://gw.alicdn.com/tfs/TB1_K2GwQPoK1RjSZKbXXX1IXXa-90-90.png"
          @click="showDesc = !showDesc"
        >
        <p>使用说明</p>
      </div>
      <div class="index-tab-mid">
        <img
          src="https://gw.alicdn.com/tfs/TB1LBjDwIbpK1RjSZFyXXX_qFXa-120-120.png"
          @click="takePhoto"
        >
        <p>拍一拍</p>
      </div>
      <div class="index-tab-right">
        <img src="https://gw.alicdn.com/tfs/TB1w9HRwNjaK1RjSZFAXXbdLFXa-90-90.png" @click="reverse">
        <p>镜头切换</p>
      </div>
    </div>
    <div class="modal" v-if="showResult" @click="init"></div>
    <div class="waiting" v-if="isWaiting">
      <div class="text">努力识别中...</div>
      <img src="../../assets/waiting.png" alt>
      <div class="sub-text">不要着急,马上有结果</div>
    </div>
    <div class="result-tab" v-if="showResult">
      <scroll-view scroll-x class="result-tab-scroll" :scroll-into-view="toView">
        <div class="result-tab-box">
          <div
            @click="toWebview(item.detail_url)"
            class="result-tab-item"
            v-for="(item,index) in matchItem"
            :key="index"
            :id="'result'+index"
          >
            <div class="result-tab-item-name">{{item.name}}</div>
            <div class="result-tab-item-desc">{{item.desc}}</div>
            <div class="result-tab-item-pic active">
              <img :src="item.reference_url">
              <div class="result-tab-item-pic-hint">匹配度:{{item.match}}%</div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <cover-view class="desc" v-if="showDesc">
      <cover-view>拍照识别物种：对准你好奇的物种，</cover-view>
      <cover-view>点击拍一拍吧！</cover-view>
    </cover-view>
  </div>
</template>

<script>
import { config } from "../../utils/index";

export default {
  data() {
    return {
      src: "",
      cameraDirection: "back",
      showDesc: false,
      showResult: false,
      userCode: "",
      matchItem: [],
      toView: "result0",
      isWaiting: false
    };
  },

  components: {},

  methods: {
    toWebview(webviewUrl) {
      console.log("show webview");
      let url = "../webview/main";
      url = url + "?webviewUrl=" + encodeURIComponent(webviewUrl);
      wx.navigateTo({ url });
    },
    bindTab(e) {
      console.log(e.currentTarget);
    },
    reverse() {
      this.cameraDirection == "back"
        ? (this.cameraDirection = "front")
        : (this.cameraDirection = "back");
    },
    init() {
      this.showResult = false;
      this.src = "";
      this.matchItem = [];
    },
    takePhoto() {
      this.showDesc = false;
      const ctx = wx.createCameraContext();
      ctx.takePhoto({
        quality: "high",
        success: res => {
          this.src = res.tempImagePath;
          this.showResult = true;
          this.upload(res.tempImagePath);
          // this.postPhoto(res.tempImagePath)
        }
      });
    },
    upload(file) {
      this.isWaiting = true;

      wx.uploadFile({
        url: config.base + "photo/UpdatePhoto", //开发者服务器 url
        filePath: file, //要上传文件资源的路径
        name: "name", //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
        success: res => {
          let data = JSON.parse(res.data).data;
          console.log(data);
          this.postPhoto(data);
        },
        fail: () => {
          this.isWaiting = false;
        },
        complete: () => {}
      });
    },
    postPhoto(imgList) {
      const code = wx.getStorageSync("userCode");
      wx.request({
        url: config.base + "identify/photo", //开发者服务器接口地址",
        data: {
          image_url: imgList,
          lineId: config.lineId
        }, //请求的参数",
        header: {
          token: code
        },
        method: "POST",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          const data = res.data;
          console.log(data);
          if (data.res_code == 0) {
            const list = res.data.data;
            if (list.length > 0) {
              list.forEach(item => {
                let m = parseFloat(item.match).toFixed(2) * 100;
                item.match = m;
              });
              this.matchItem = list;
            } else {
              this.matchItem = res.data.data;
            }
            console.log(this.matchItem);
          } else {
            this.matchItem = [
              {
                name: "未能识别...",
                desc: "请换个生物拍一拍",
                match: 0
              }
            ];
          }
        },
        fail: () => {},
        complete: () => {
          this.isWaiting = false;
        }
      });
    },
    error(e) {
      console.log(e.detail);
    },
    login(code) {
      wx.request({
        url: config.base + "wxlogin/login",
        data: {
          code: code,
          lineId: config.lineId
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
    setStorage(key, val) {
      try {
        wx.setStorageSync(key, val);
      } catch (e) {
        wx.setStorage(key, val);
      }
    }
  },

  created() {
    this.userCode = wx.getStorageSync("userCode");
  },
  onLoad() {
    const firsttime = wx.getStorageSync("firstPhoto");
    if (!firsttime) {
      this.showDesc = true;
      setTimeout(() => {
        this.showDesc = false;
      }, 2000);
    }
    wx.login({
      success: res => {
        console.log(res);
        this.login(res.code);
      }
    });
  },
  onShow() {
    wx.setStorageSync("firstPhoto", true);
    this.showWebview = false;
  },
  onHide() {
    this.init();
  },
  onUnload() {
    this.init();
  }
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  position: relative;
}
.index-tab {
  height: 24%;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  p {
    margin-top: 18rpx;
    text-align: center;
    font-size: 24rpx;
  }
  &-left {
    color: #000;
    img {
      width: 94rpx;
      height: 94rpx;
    }
  }
  &-mid {
    color: #000;
    img {
      width: 140rpx;
      height: 140rpx;
    }
  }
  &-right {
    color: #000;
    img {
      width: 94rpx;
      height: 94rpx;
    }
  }
}
img {
  width: 100%;
  height: 100%;
  display: block;
}
.cameraArea {
  width: 100%;
  height: 76%;
}
.desc {
  width: 520rpx;
  height: 126rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
  color: #fff;
  border-radius: 18rpx;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #84988b;
  position: absolute;
  top: 62%;
  right: 0;
  left: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
}
.result-tab {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60%;
  background: #fff;
  &-scroll {
    width: 100%;
  }
  &-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  &-item {
    width: 550rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-right: 100rpx;
    &-name {
      font-size: 40rpx;
      line-height: 86rpx;
    }
    &-desc {
      font-size: 24rpx;
      color: #909090;
      margin-bottom: 30rpx;
    }
    &-pic {
      overflow: hidden;
      position: relative;
      &-hint {
        width: 100%;
        line-height: 70rpx;
        font-size: 24rpx;
        position: absolute;
        bottom: 0;
        text-align: center;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
      }
    }
    .active {
      width: 550rpx;
      height: 550rpx;
      border-radius: 50%;
      border: 2px solid #f3f3f3;
    }
  }
  &-item:nth-of-type(1) {
    padding-left: 100rpx;
  }
}

.waiting {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 999;
  img {
    @perc: 60vw;
    width: @perc;
    height: @perc;
    animation: spin 6s linear infinite;
  }
  .text {
    color: #00cbff;
    font-size: 60rpx;
    line-height: 120rpx;
    margin-bottom: 30rpx;
  }
  .sub-text {
    margin-top: 30rpx;
    color: black;
    font-size: 36rpx;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
