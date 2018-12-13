<template>
  <div class="container">
    <div class="top">
      <open-data type="userAvatarUrl" class="userPic"></open-data>
      <open-data type="userNickName" class="userName"></open-data>
      <div class="top-btn">
        <div class="top-btn-item">
          <span>{{count}}</span>挑战次数
        </div>
        <div class="top-btn-item" @click="showRule">
          <span>?</span>挑战规则
        </div>
      </div>
    </div>
    <button open-type="share" class="share">
    </button>
    <scroll-view scroll-y class="index-list">
      <div class="index-list-item">
        <div class="index-list-item-img" @click="startQuiz(1)">
          <img src="https://gw.alicdn.com/tfs/TB1.Wl8nFzqK1RjSZSgXXcpAVXa-608-208.png">
        </div>
      </div>
      <div class="index-list-item">
        <div class="index-list-item-img" @click="startQuiz(2)">
          <img src="https://gw.alicdn.com/tfs/TB1Wx5XnNTpK1RjSZFMXXbG_VXa-608-208.png">
          <div class="index-list-item-lock" v-if="score<1">
            <img src="https://gw.alicdn.com/tfs/TB19UOdnRLoK1RjSZFuXXXn0XXa-23-29.png">
          </div>
        </div>
      </div>
      <div class="index-list-item">
        <div class="index-list-item-img" @click="startQuiz(3)">
          <img src="https://gw.alicdn.com/tfs/TB1bOh6nIbpK1RjSZFyXXX_qFXa-608-208.png">
          <div class="index-list-item-lock" v-if="score<2">
            <img src="https://gw.alicdn.com/tfs/TB19UOdnRLoK1RjSZFuXXXn0XXa-23-29.png">
          </div>
        </div>
      </div>
      <div class="index-list-item">
        <div class="index-list-item-img" @click="startQuiz(4)">
          <img src="https://gw.alicdn.com/tfs/TB1kNN.nQvoK1RjSZFDXXXY3pXa-608-208.png">
          <div class="index-list-item-lock" v-if="score<3">
            <img src="https://gw.alicdn.com/tfs/TB19UOdnRLoK1RjSZFuXXXn0XXa-23-29.png">
          </div>
        </div>
      </div>
      <div class="index-list-item">
        <div class="index-list-item-img" @click="startQuiz(5)">
          <img src="https://gw.alicdn.com/tfs/TB1An43nNTpK1RjSZR0XXbEwXXa-608-208.png">
          <div class="index-list-item-lock" v-if="score<4">
            <img src="https://gw.alicdn.com/tfs/TB19UOdnRLoK1RjSZFuXXXn0XXa-23-29.png">
          </div>
        </div>
      </div>
    </scroll-view>
    <div class="cover" v-if="showCover"></div>
    <div class="ruleLayer" v-if="ruleLayer">
      <div class="close" @click="closeLayer"></div>
    </div>
    <div class="shareLayer" v-if="shareLayer">
      <div class="shareBtn" @click="closeLayer"></div>
      <div class="close" @click="closeLayer"></div>
    </div>
  </div>
</template>

<script>
import { config } from "../../utils/index";
export default {
  data() {
    return {
      userCode: "",
      score: "",
      count: 0,
      coin: 0,
      showCover: false,
      ruleLayer: false,
      shareLayer: false
    };
  },

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
    bindTab(e) {
      wx.navigateTo({ url: "../index/main" });
    },
    startQuiz(id) {
      if (this.score < id - 1) {
        return;
      }
      wx.navigateTo({
        url: "../quizdetail/main?checkpoint=" + id + "&count=" + this.count
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
          const userCode = res.data.data;
          this.setStorage("userCode", userCode);
          this.loadCheckPoint(userCode);
          this.userCode = userCode;
        },
        fail: err => {
          console.log("hasError", err);
        }
      });
    },
    loadCheckPoint(userCode) {
      wx.request({
        url: config.base + "quiz/getcheckpoint",
        data: {
          LineId: config.lineId,
          token: userCode
        },
        method: "GET",
        dataType: "json",
        success: res => {
          console.log(res.data);
          this.count = res.data.data.count || 0;
          this.score = res.data.data.score || 0;
          this.coin = res.data.data.coin || 0;
        },
        fail: () => {},
        complete: () => {}
      });
    },
    showRule() {
      this.showCover = true;
      this.ruleLayer = true;
    },
    closeLayer() {
      this.showCover = false;
      this.ruleLayer = false;
      this.shareLayer = false;
    },
    addCount() {
      wx.request({
        url: config.base + "quiz/addCount", //开发者服务器接口地址",
        data: {
          LineId: config.lineId
        }, //请求的参数",
        method: "post",
        header: {
          token: this.userCode
        },
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data);
          if (res.data.res_code == 0) {
            this.count = res.data.data.count;
          } else {
            wx.showToast({
              title: res.data.res_msg, //提示的内容,
              icon: "none", //图标,
              duration: 1000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          }
        }
      });
    }
  },

  created() {},
  mounted() {},
  onShow() {
    wx.login({
      success: res => {
        console.log(res);
        this.login(res.code);
      }
    });
    // this.userCode = wx.getStorageSync('userCode');
  },
  onShareAppMessage(result) {
    let title = "青谷研习径";
    let path = "/pages/index/main";
    let imageUrl =
      "https://gw.alicdn.com/tfs/TB1uLyAnxjaK1RjSZKzXXXVwXXa-80-80.png";
    return {
      title,
      path,
      imageUrl,
      // desc,
      success: res => {
        console.log("success", res);
        this.showCover = true;
        this.shareLayer = true;
        this.addCount();
      },
      fail(e) {
        console.log(e);
      }
    };
  }
};
</script>

<style scoped lang="less">
.top {
  height: 270rpx;
  background: #6998cc;
  border-radius: 10rpx;
  margin: 0 6rpx 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-btn {
    width: 90%;
    color: #fff;
    font-size: 24rpx;
    display: flex;
    justify-content: space-between;
    &-item {
      width: 164rpx;
      height: 46rpx;
      border-radius: 20rpx;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      span {
        width: 30rpx;
        height: 30rpx;
        line-height: 30rpx;
        text-align: center;
        display: block;
        background: #fff;
        color: #496a8e;
        border-radius: 50%;
        margin: 0 10rpx;
      }
    }
  }
}
.userPic {
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid #fff;
  margin-bottom: 10rpx;
}
.userName {
  color: #fff;
  font-size: 30rpx;
}
.share {
  border: none;
  width: 126rpx;
  height: 66rpx;
  position: absolute;
  right: 0;
  top: 80rpx;
  background: url("https://gw.alicdn.com/tfs/TB1m0X7nHPpK1RjSZFFXXa5PpXa-113-60.png")
    no-repeat top/cover;
  &::after {
    border: none;
  }
}
.container {
  position: relative;
  padding: 20rpx;
  background: url("https://gw.alicdn.com/tfs/TB1.nJ1nVzqK1RjSZFvXXcB7VXa-640-1008.png")
    no-repeat top/cover;
}
.index-list {
  width: 100%;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
  &-item {
    position: relative;
    &-img {
      width: 100%;
      height: 234rpx;
      margin: 0 0 20rpx;
    }
    &-lock {
      img {
        width: 26rpx;
        height: 32rpx;
      }
      width: 76rpx;
      height: 70rpx;
      position: absolute;
      top: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.5);
      border-bottom-left-radius: 40rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
.ruleLayer {
  width: 500rpx;
  height: 760rpx;
  position: fixed;
  z-index: 81;
  top: 20%;
  left: 0;
  right: 0;
  margin: auto;
  background: url("https://gw.alicdn.com/tfs/TB1.U9SnMHqK1RjSZJnXXbNLpXa-460-700.png")
    no-repeat top/cover;
}
.shareLayer {
  width: 500rpx;
  height: 764rpx;
  position: fixed;
  z-index: 81;
  top: 20%;
  left: 0;
  right: 0;
  margin: auto;
  background: url("https://gw.alicdn.com/tfs/TB1YThon4TpK1RjSZR0XXbEwXXa-460-700.png")
    no-repeat top/contain;
}
.shareBtn {
  position: absolute;
  bottom: 40rpx;
  left: 0;
  right: 0;
  margin: auto;
  width: 360rpx;
  height: 85rpx;
  background: url("https://gw.alicdn.com/tfs/TB1qxG6nNYaK1RjSZFnXXa80pXa-340-80.png")
    no-repeat top/cover;
}
.close {
  width: 70rpx;
  height: 142rpx;
  background: url("https://gw.alicdn.com/tfs/TB14yqPnNTpK1RjSZFKXXa2wXXa-60-132.png")
    no-repeat top/cover;
  position: absolute;
  right: 0;
  top: -130rpx;
  z-index: 81;
}
</style>
