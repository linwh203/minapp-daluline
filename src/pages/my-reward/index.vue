<template>
  <div class="container">
    <div class="top">
      <open-data type="userAvatarUrl" class="userPic"></open-data>
      <open-data type="userNickName" class="userName"></open-data>
    </div>
    <div class="mid">
      <div class="mid-item">
        挑战机会
        <span><span style="font-size:40rpx">{{count}}</span>次</span>
      </div>
      <div class="mid-line"></div>
      <div class="mid-item">
        累计奖金
        <span><span style="font-size:40rpx">{{coin}}</span>币</span>
      </div>
    </div>
    <div class="share">
      Lv.{{level}}
    </div>
    <div class="main">
      <div class="main-share">
         <button class="main-share-item" open-type="share">
          <img src="https://gw.alicdn.com/tfs/TB1CAWCqNnaK1RjSZFtXXbC2VXa-36-33.png" alt=""> 炫耀战绩
         </button>
         <button class="main-share-item" open-type="share">
          <img src="https://gw.alicdn.com/tfs/TB1AiyeqQvoK1RjSZPfXXXPKFXa-27-32.png" alt=""> 分享到微信群
         </button>
      </div>
      <div class="main-body">
        <div class="main-body-head">
          奖励兑换区
        </div>
        <div class="main-body-list">
          <div class="main-body-list-item">
            <div class="main-body-list-item-left">
              <span>150个金币</span>
              <span>兑换1个勋章</span>
            </div>
            <div class="main-body-list-item-right">
              <span v-if="exchange1">兑换成功</span>
              <span v-else @click="openLayer(150)">立即兑换</span>
            </div>
          </div>
          <div class="main-body-list-item">
            <div class="main-body-list-item-left">
              <span>200个金币</span>
              <span>兑换3个勋章</span>
            </div>
            <div class="main-body-list-item-right">
              <span v-if="exchange2">兑换成功</span>
              <span v-else @click="openLayer(200)">立即兑换</span>
            </div>
          </div>
          <div class="main-body-list-item">
            <div class="main-body-list-item-left">
              <span>480个金币</span>
              <span>兑换10个勋章</span>
            </div>
            <div class="main-body-list-item-right">
              <span v-if="exchange3">兑换成功</span>
              <span v-else @click="openLayer(480)">立即兑换</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cover" v-if="showCover"></div>
    <div class="ruleLayer" v-if="ruleLayer">
      <div class="ruleLayer-head">获得{{msgTitle}}个勋章</div>
      <div class="ruleLayer-text">本次兑换消耗{{msgCoin}}个金币</div>
      <div class="ruleLayer-btn" @click="buyTitle(msgCoin)">确定兑换</div>
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
      score: 0,
      level: 1,
      count: 0,
      coin: 0,
      exchange1: false,
      exchange2: false,
      exchange3: false,
      ruleLayer: false,
      showCover: false,
      msgCoin: 0,
      msgTitle: 0
    };
  },

  components: {},

  methods: {
    bindTab(url) {
      wx.navigateTo({ url: url });
    },
    loadCheckPoint() {
      wx.request({
        url: config.base + "quiz/getcheckpoint",
        data: {
          LineId: config.lineId,
          token: this.userCode
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
    closeLayer() {
      this.ruleLayer = false;
      this.showCover = false;
    },
    openLayer(coin) {
      this.ruleLayer = true;
      this.showCover = true;
      this.msgCoin = coin;
      if (coin == 150) {
        this.msgTitle = 1;
      }
      if (coin == 200) {
        this.msgTitle = 3;
      }
      if (coin == 480) {
        this.msgTitle = 10;
      }
    },
    buyTitle(coin) {
      wx.request({
        url: config.base + "quiz/buyTitle", //开发者服务器接口地址",
        data: {
          coin: coin,
          LineId: config.lineId
        }, //请求的参数",
        method: "post",
        header: {
          token: this.userCode
        },
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data);
          this.closeLayer();
          if (res.data.res_code == 0) {
            this.level = res.data.data.count;
            if (coin == 150) {
              this.exchange1 = true;
              return;
            }
            if (coin == 200) {
              this.exchange2 = true;
              return;
            }
            if (coin == 480) {
              this.exchange3 = true;
              return;
            }
          } else {
            wx.showToast({
              title: res.data.res_msg, //提示的内容,
              icon: "none", //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          }
        }
      });
    },
    getLevel() {
      wx.request({
        url: config.base + "quiz/getTitle", //开发者服务器接口地址",
        data: {
          token: this.userCode,
          LineId: config.lineId
        }, //请求的参数",
        method: "get",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data);
          if (res.data.res_code == 0) {
            this.level = res.data.data.count;
          } else {
            wx.showToast({
              title: res.data.res_msg, //提示的内容,
              icon: "none", //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          }
        }
      });
    }
  },
  onReady() {},
  onShow() {
    this.userCode = wx.getStorageSync("userCode");
    this.loadCheckPoint();
    this.getLevel();
  },
  onShareAppMessage(result) {
    let title = `我已获得${this.level}个勋章`;
    let path = "/pages/index/main";
    let imageUrl =
      "https://etx.forestvisual.com/File/Download?fileName=poetry/share.png&fileType=QGLineFile";
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
.top {
  height: 270rpx;
  background: #2b9f62;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px dotted #fff;
}
.mid {
  height: 124rpx;
  display: flex;
  align-items: center;
  background: #2b9f62;
  &-item {
    width: 49%;
    color: #fff;
    font-size: 34rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      font-size: 18rpx;
    }
  }
  &-line {
    width: 1px;
    height: 84rpx;
    border-right: 1px dotted #fff;
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
  color: #2b9f62;
  font-size: 24rpx;
  padding-left: 66rpx;
  width: 60rpx;
  height: 66rpx;
  line-height: 66rpx;
  position: absolute;
  right: 0;
  top: 80rpx;
  background: url("https://gw.alicdn.com/tfs/TB1HBfVwMTqK1RjSZPhXXXfOFXa-114-60.png")
    no-repeat top/cover;
}
.container {
  background: #fff;
  position: relative;
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
  background: url("https://gw.alicdn.com/tfs/TB1Umz2wNTpK1RjSZR0XXbEwXXa-460-700.png")
    no-repeat top/cover;
  &-head {
    font-size: 30rpx;
    position: absolute;
    top: 408rpx;
    left: 0;
    right: 0;
    margin: auto;
    color: #fff;
    text-align: center;
  }
  &-text {
    font-size: 34rpx;
    position: absolute;
    top: 508rpx;
    left: 0;
    right: 0;
    margin: auto;
    color: #333;
    text-align: center;
  }
  &-btn {
    width: 300rpx;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    color: #fff;
    background: #2b9f62;
    border-radius: 20rpx;
    position: absolute;
    bottom: 60rpx;
    left: 0;
    right: 0;
    margin: auto;
  }
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
.main {
  padding: 0 20rpx;
  &-share {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-item {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      color: #fff;
      margin: 20rpx 0;
      width: 340rpx;
      height: 90rpx;
      background: url("https://gw.alicdn.com/tfs/TB1.0L5wOrpK1RjSZFhXXXSdXXa-290-80.png")
        no-repeat center/cover;
      img {
        width: 40rpx;
        height: 40rpx;
        margin: 0 10rpx;
      }
    }
  }
  &-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #0e7441;
    padding: 25rpx 38rpx;
    color: #fff;
    border-radius: 10rpx;
    &-head {
      width: 260rpx;
      height: 60rpx;
      line-height: 60rpx;
      border: 1px solid #fff;
      border-radius: 10rpx;
      text-align: center;
      font-size: 34rpx;
      margin-bottom: 50rpx;
    }
    &-list {
      display: flex;
      width: 100%;
      flex-direction: column;
      &-item {
        display: flex;
        align-items: center;
        width: 100%;
        height: 140rpx;
        margin-bottom: 40rpx;
        background: url("https://gw.alicdn.com/tfs/TB1wXOcqQzoK1RjSZFlXXai4VXa-520-125.png")
          no-repeat center/cover;
        &-right {
          width: 160rpx;
          height: 60rpx;
          line-height: 60rpx;
          text-align: center;
          background: #e74e3d;
          border-radius: 10rpx;
          font-size: 24rpx;
          margin-right: 60rpx;
        }
        &-left {
          width: 60%;
          display: flex;
          flex-direction: column;
          margin-left: 60rpx;
          span:nth-of-type(1) {
            color: #000;
            font-size: 36rpx;
          }
          span:nth-of-type(2) {
            color: #909090;
            font-size: 24rpx;
          }
        }
      }
    }
  }
}
</style>
