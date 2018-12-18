<template>
  <div class="container">
    <div class="user">
      <open-data type="userAvatarUrl" class="userPic"></open-data>
    </div>
    <open-data type="userNickName" class="userName"></open-data>
    <div class="my-tab">
      <div class="my-tab-body">
        <div class="my-tab-body-item" @click="bindTab('../my-reward/main')">
        <!-- <div class="my-tab-body-item" @click="bindTab('../developing/main')"> -->
          <img src="https://gw.alicdn.com/tfs/TB1UADZwFYqK1RjSZLeXXbXppXa-68-61.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">个人成就</div>
        </div>
        <div class="my-tab-body-item" @click="bindTab('../my-rule/main')">
          <img src="https://gw.alicdn.com/tfs/TB1S6ruwSzqK1RjSZPcXXbTepXa-67-57.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">行山礼仪</div>
        </div>
      </div>
      <div class="my-tab-body">
        <div class="my-tab-body-item" @click="bindTab('../my-msg/main')">
          <img src="https://gw.alicdn.com/tfs/TB1sP_WwH2pK1RjSZFsXXaNlXXa-71-60.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">消息中心</div>
        </div>
        <div class="my-tab-body-item" @click="bindTab('../my-statement/main')">
          <img src="https://gw.alicdn.com/tfs/TB1inTWwH2pK1RjSZFsXXaNlXXa-68-60.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">法律声明</div>
        </div>
      </div>
      <div class="my-tab-body">
        <div class="my-tab-body-item" @click="bindTab('../my-suggest/main')">
          <img src="https://gw.alicdn.com/tfs/TB1cR2UwSzqK1RjSZPxXXc4tVXa-68-60.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">意见反馈</div>
        </div>
        <div class="my-tab-body-item" @click="bindTab('../my-about/main')">
          <img src="https://gw.alicdn.com/tfs/TB1yX6ZwFzqK1RjSZFvXXcB7VXa-68-59.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">关于我们</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { config } from '../../utils/index';

export default {
  data() {
    return {
      
    };
  },

  components: {},

  methods: {
    bindTab(url) {
      wx.navigateTo({ url: url });
    },
    login(code) {
      wx.request({
        url: config.base + 'wxlogin/login',
        data: {
          code: code,
          lineId: config.lineId
        }, 
        method: 'GET',
        dataType: 'json', 
        success: res => {
          // console.log('login',res.data.data)
          this.setStorage('userCode',res.data.data)
        },
        fail: err => {
          console.log('hasError',err)
        }
      });
    },
    setStorage(key, val) {
      try {
        wx.setStorageSync(key,val)
      } catch(e) {
        wx.setStorage(key,val)
      }
    },
  },

   onLoad() {
    wx.login({
      success: (res) => {
        console.log(res)
        this.login(res.code);
      }
    }); 
  },
};
</script>

<style scoped lang="less">
.center{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.container {
  width: 100%;
  height: 100%;
  position: relative;
  background: url('https://gw.alicdn.com/tfs/TB1.MbVwSzqK1RjSZFLXXcn2XXa-640-1008.png') no-repeat top/cover;
  .center();
}
.userPic{
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid #fff;
}
.user{
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  background: rgba(255,255,255,.2);
  border:1px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
  margin-top: 20rpx;
}
.userName{
  color:#fff;
  font-size: 30rpx;
}
.my-tab{
  position: absolute;
  top: 32%;
  width: 100%;
  &-body{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 6% 25rpx;
    &-item{
      display: flex;
      align-items: center;
      width: 330rpx;
      height: 120rpx;
      margin-bottom: 20rpx;
      margin-top: 20rpx;
      background: url('https://gw.alicdn.com/tfs/TB1OCOLn6TpK1RjSZKPXXa3UpXa-290-130.png') no-repeat top/cover;
      &-icon{
        width: 72rpx;
        height: 65rpx;
        display: block;
        margin:0 40rpx 0 25rpx;
      }
      &-name{
        font-size:30rpx;
        color:#000;
      }
    }
  }
}
</style>
