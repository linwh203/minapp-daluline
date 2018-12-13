<template>
  <div class="container">
    <div class="first-visit">
      <img src="https://gw.alicdn.com/tfs/TB1QpJimSrqK1RjSZK9XXXyypXa-640-1136.png" alt>
      <div class="close-btn" @click="bindNext"></div>
    </div>
    <div class="modal" v-if="motto">
      <div class="modal-container">
        <img src="https://gw.alicdn.com/tfs/TB1UNN3qCzqK1RjSZFpXXakSXXa-544-700.png" alt>
        <button
          class="auth-confirm"
          open-type="getUserInfo"
          @getuserinfo="bindGetUserInfo"
          @click="getUserInfo1"
        >授权登录</button>
        <!-- <button class="auth-cancel" @click="cancelAuth">拒绝授权</button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMock: false,
      // isMock: true,
      motto: false
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
    bindNext() {
      wx.setStorageSync("firsttime", true);
      const url = "../index/main";
      wx.redirectTo({ url: url });
    },
    getUser() {
      if (this.isMock) {
        this.motto = true;
        return;
      }
      var that = this;
      // 查看是否授权
      wx.getSetting({
        success(res) {
          console.log("success");
          if (res.authSetting["scope.userInfo"]) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                console.log("first page", res.userInfo);
              }
            });
          } else {
            that.motto = true;
          }
        },
        fail(res) {
          console.log("fail");
          console.log(res);
        }
      });
    },
    getUserInfo1() {
      console.log("click事件首先触发");
      // 判断小程序的API，回调，参数，组件等是否在当前版本可用。  为false 提醒用户升级微信版本
      // console.log(wx.canIUse('button.open-type.getUserInfo'))
      if (wx.canIUse("button.open-type.getUserInfo")) {
        // 用户版本可用
      } else {
        console.log("请升级微信版本");
      }
    },
    bindGetUserInfo(e) {
      console.log(e.mp.detail);
      if (e.mp.detail.rawData) {
        //用户按了允许授权按钮
        console.log("用户按了允许授权按钮");
        const userInfo = e.mp.detail.userInfo;
        const nickName = userInfo.nickName;
        const avatarUrl = userInfo.avatarUrl;
        const gender = userInfo.gender; //性别 0：未知、1：男、2：女
        const province = userInfo.province;
        const city = userInfo.city;
        const country = userInfo.country;
        // wx.setStorageSync("userInfo", userInfo);
        this.setStorage("userInfo", userInfo);
        this.motto = false;
      } else {
        //用户按了拒绝按钮
        console.log("用户按了拒绝按钮");
      }
    },
    cancelAuth() {
      this.motto = false;
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
    this.getUser();
  }
};
</script>

<style scoped lang="less">
// rate width 1.171,height 1.174
@rate: 1.17;
.first-visit {
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 0;
}
.close-btn {
  width: 46rpx;
  height: 46rpx;
  position: absolute;
  right: 29rpx;
  top: 29rpx;
  background: url("./../../assets/btn-close-1.png") no-repeat center/cover;
}
.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-container {
    width: 544rpx;
    height: 696rpx;
    position: relative;
  }
}
.auth-confirm {
  // width: 224rpx;
  width: 448rpx;
  height: 92rpx;
  position: absolute;
  right: 42rpx;
  bottom: 0;
  opacity: 0;
}
.auth-cancel {
  width: 224rpx;
  height: 92rpx;
  position: absolute;
  left: 42rpx;
  bottom: 0;
  opacity: 0;
}
img {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
