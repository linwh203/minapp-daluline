<template>
  <div class="container">
    <video id="myVideo" :src="videoSrc" :poster="coverSrc" controls objectFit="cover" class="video-container" v-if="!showModal"></video>
    <div class="video-list">
      <div class="video-list-item" v-for="(item,index) in videoList" :key="index">
        <div class="video-list-item-preview">
          <div class="video-list-item-preview-base">
            <img :src="item.src">  
          </div>  
          <div class="video-list-item-preview-cover">
            <img src="https://gw.alicdn.com/tfs/TB1D9.IyAvoK1RjSZFNXXcxMVXa-290-200.png" v-if="currentIndex == index">
            <img src="https://gw.alicdn.com/tfs/TB1ePUKypzqK1RjSZFCXXbbxVXa-290-200.png" v-else>  

          </div>  
          <div class="video-list-item-preview-time">10:12:12</div>  
        </div>
        <div class="video-list-item-name">
          红外相机镜头下的的野猪
        </div>
      </div>
    </div>
    <div class="modal" v-if="showModal">
      <div class="modal-top"><img src="../../assets/video-hint-1.png" alt=""></div>
      <div class="modal-mid"><img src="../../assets/video-hint-2.png" alt=""></div>
      <div class="modal-btm" @click="closeModal"><img src="../../assets/video-hint-3.png" alt=""></div>
    </div>
  </div>
</template>

<script>
import { config } from "../../utils/index";

export default {
  data() {
    return {
      videoCtx: null,
      fullSize: false,
      showModal: false,
      currentIndex: 0,
      videoId: "",
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
        "https://gw.alicdn.com/tfs/TB1oAI2yxnaK1RjSZFtXXbC2VXa-1136-640.png",
      videoSrc:""
        // "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
    };
  },

  components: {},

  methods: {
    closeModal() {
      wx.setStorageSync("firstvideo", true);
      this.showModal = false;
    },
  },

  created() {
    const isFirst = wx.getStorageSync("firstvideo");
    if (!isFirst) {
      this.showModal = true;
    }
  },
  onLoad(option) {
    this.videoId = option.id;
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
    wx.setNavigationBarTitle({
      title: '视频播放'
    })
  },
  onReady() {
    this.videoCtx = wx.createVideoContext("myVideo");
  }
};
</script>

<style scoped lang="less">
.container {
  position: relative;
  background: #fff;
  height: 100%;
}
.video-container {
  width: 100%;
  height: 38%;
  display: block;
}
.video-list {
  height: 62%;
  overflow: scroll;
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
.reverse {
  position: fixed;
  bottom: 10rpx;
  right: 0;
  z-index: 99;
  .img{
    width: 112rpx;
    height: 100rpx;
  }
}
.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.6);
  z-index: 999;
  &-top {
    position: absolute;
    width: 460rpx;
    height: 180rpx;
    top: 0;
    left: 40rpx;
  }
  &-mid {
    position: absolute;
    width: 452rpx;
    height: 132rpx;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  &-btm {
    position: absolute;
    width: 300rpx;
    height: 84rpx;
    bottom: 100rpx;
    left: 0;
    right: 0;
    margin: auto;
  }
}
image {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
