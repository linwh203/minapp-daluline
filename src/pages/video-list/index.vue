<template>
  <div class="container">
    <div class="video-list">
      <div class="video-list-item" v-for="(item,index) in videoList" :key="index">
        <div class="video-list-item-preview" @click="jumpVideo(item)">
          <div class="video-list-item-preview-base">
            <img :src="item.src">  
          </div>  
          <div class="video-list-item-preview-cover">
            <img src="https://gw.alicdn.com/tfs/TB1ePUKypzqK1RjSZFCXXbbxVXa-290-200.png">  
          </div>  
          <div class="video-list-item-preview-time">10:12:12</div>  
        </div>
        <div class="video-list-item-name">
          红外相机镜头下的的野猪
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
      videoList:[
        {src:"https://gw.alicdn.com/tfs/TB1Pc7Pc3HqK1RjSZFPXXcwapXa-255-155.jpg"},
        {src:"https://gw.alicdn.com/tfs/TB1Pc7Pc3HqK1RjSZFPXXcwapXa-255-155.jpg"},
        {src:"https://gw.alicdn.com/tfs/TB1Pc7Pc3HqK1RjSZFPXXcwapXa-255-155.jpg"},
        {src:"https://gw.alicdn.com/tfs/TB1Pc7Pc3HqK1RjSZFPXXcwapXa-255-155.jpg"},
        {src:"https://gw.alicdn.com/tfs/TB1Pc7Pc3HqK1RjSZFPXXcwapXa-255-155.jpg"},
        {src:"https://gw.alicdn.com/tfs/TB1Pc7Pc3HqK1RjSZFPXXcwapXa-255-155.jpg"},
        {src:"https://gw.alicdn.com/tfs/TB1Pc7Pc3HqK1RjSZFPXXcwapXa-255-155.jpg"},
        {src:"https://gw.alicdn.com/tfs/TB1Pc7Pc3HqK1RjSZFPXXcwapXa-255-155.jpg"},
        {src:"https://gw.alicdn.com/tfs/TB1Pc7Pc3HqK1RjSZFPXXcwapXa-255-155.jpg"}
      ],
      coverSrc:
        "https://gw.alicdn.com/tfs/TB1EEXbnQvoK1RjSZFNXXcxMVXa-640-1008.png",
      videoSrc:''
        // "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
    };
  },

  methods: {
    jumpVideo(item) {
      wx.navigateTo({ url: `../video/main?id=${item.id||0}` });
    }
  },

  onLoad(option) {
    this.videoSrc = option.video_url;
    wx.request({
      url: config.base + 'Attraction/VideoList', //开发者服务器接口地址",
      data: 'data', //请求的参数",
      method: 'GET',
      dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        console.log(res)
      },
      fail: () => {},
      complete: () => {}
    });
  }
};
</script>

<style scoped lang="less">
.container {
  position: relative;
}
.video-list {
  padding: 0 20rpx;
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &-item {
    margin: 20rpx 0;
    &-preview {
      width: 340rpx;
      height: 234rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;
      &-base, &-cover {
        position: absolute;
        top: 0;left: 0;right: 0;bottom: 0;
        width: 100%;
        height: 100%;
      }
      &-time {
        position: absolute;
        right: 0;bottom: 0;
        width: 82rpx;
        height: 48rpx;
        line-height: 48rpx;
        background: #1b1f18;
        border-top-left-radius: 20rpx;
        font-size: 20rpx;
        text-align: center;
        color:#fff;
      }
    }
    &-name{
      font-size: 26rpx;
      width: 340rpx;
      overflow: hidden;
    }
  }
}
image {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
