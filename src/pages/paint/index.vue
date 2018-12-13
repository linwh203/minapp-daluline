<template>
  <div class="container">
    <scroll-view scroll-x class="index-list">
      <div class="index-list-box">
        <div class="index-list-item" v-for="(item, index) in paintList" :key="index">
          <img :src="prefix+item.pic_icon_active" @load="setWidth(index,$event)" data-index=index v-bind:style="{ width: index==2?'185rpx':'145rpx'}" class="index-list-item-img" @click="changeArticle(index,item)" v-if="activeIndex == index">
          <img :src="prefix+item.pic_icon" @load="setWidth(index,$event)" data-index=index v-bind:style="{ width: index==2?'185rpx':'145rpx'}" class="index-list-item-img" @click="changeArticle(index,item)" v-else>
        </div>
      </div>
    </scroll-view>
    <scroll-view scroll-x class="paint-bg">
      <img :src="prefix+mainPic" @load="imageLoad" lazy-load v-bind:style="{ width: imgWidth + 'rpx'}">
    </scroll-view>
  </div>
</template>

<script>
import { config } from '../../utils/index'
export default {
  data() {
    return {
      // mainPic:'https://gw.alicdn.com/tfs/TB1jQgHiXzqK1RjSZFCXXbbxVXa-3657-2717.jpg',
      mainPic:'',
      imgWidth:'',
      activeIndex:0,
      tabList:[
        {src:"https://gw.alicdn.com/tfs/TB1mPsKimzqK1RjSZFHXXb3CpXa-143-145.png"},
        {src:"https://gw.alicdn.com/tfs/TB1QqUKimzqK1RjSZFjXXblCFXa-187-146.png"},
        {src:"https://gw.alicdn.com/tfs/TB1QqUKimzqK1RjSZFjXXblCFXa-187-146.png"},
        {src:"https://gw.alicdn.com/tfs/TB1QqUKimzqK1RjSZFjXXblCFXa-187-146.png"},
        {src:"https://gw.alicdn.com/tfs/TB1QqUKimzqK1RjSZFjXXblCFXa-187-146.png"},
        {src:"https://gw.alicdn.com/tfs/TB1QqUKimzqK1RjSZFjXXblCFXa-187-146.png"},
        {src:"https://gw.alicdn.com/tfs/TB1QqUKimzqK1RjSZFjXXblCFXa-187-146.png"},
        {src:"https://gw.alicdn.com/tfs/TB1QqUKimzqK1RjSZFjXXblCFXa-187-146.png"},
        {src:"https://gw.alicdn.com/tfs/TB1QqUKimzqK1RjSZFjXXblCFXa-187-146.png"},
        {src:"https://gw.alicdn.com/tfs/TB1QqUKimzqK1RjSZFjXXblCFXa-187-146.png"}
      ],
      paintList:[],
      prefix:config.prefix
    };
  },

  components: {},

  methods: {
    bindTab(url) {
      wx.navigateTo({ url: url });
    },
    setWidth(index,e) {
      const ratio = e.target.width/e.target.height
      this.tabList[index].width = parseInt(145*ratio)
      console.log(index,this.tabList[index].width)
    },
    imageLoad(e) {
      const height = 1206
      const ratio = e.target.width/e.target.height
      this.imgWidth = parseInt(height*ratio)
    },
    changeArticle(id,item) {
      const currentId = parseInt(id)
      this.activeIndex = currentId
      this.mainPic = item.pic_image
      /* switch (currentId) {
        case 0:
          this.mainPic = "https://gw.alicdn.com/tfs/TB1jQgHiXzqK1RjSZFCXXbbxVXa-3657-2717.jpg"
          break
        case 1:
          this.mainPic = "https://gw.alicdn.com/tfs/TB1Q47Cib2pK1RjSZFsXXaNlXXa-2835-2015.jpg"
          break
        case 2:
          this.mainPic = "https://gw.alicdn.com/tfs/TB1jQgHiXzqK1RjSZFCXXbbxVXa-3657-2717.jpg"
          break
        case 3:
          this.mainPic = "https://gw.alicdn.com/tfs/TB1Q47Cib2pK1RjSZFsXXaNlXXa-2835-2015.jpg"
          break
        case 4:
          this.mainPic = "https://gw.alicdn.com/tfs/TB1jQgHiXzqK1RjSZFCXXbbxVXa-3657-2717.jpg"
          break
        case 5:
          this.mainPic = "https://gw.alicdn.com/tfs/TB1Q47Cib2pK1RjSZFsXXaNlXXa-2835-2015.jpg"
          break
        case 6:
          this.mainPic = "https://gw.alicdn.com/tfs/TB1jQgHiXzqK1RjSZFCXXbbxVXa-3657-2717.jpg"
          break
        case 7:
          this.mainPic = "https://gw.alicdn.com/tfs/TB1Q47Cib2pK1RjSZFsXXaNlXXa-2835-2015.jpg"
          break
        case 8:
          this.mainPic = "https://gw.alicdn.com/tfs/TB1jQgHiXzqK1RjSZFCXXbbxVXa-3657-2717.jpg"
          break
        case 9:
          this.mainPic = "https://gw.alicdn.com/tfs/TB1Q47Cib2pK1RjSZFsXXaNlXXa-2835-2015.jpg"
          break
      } */
    }
  },

  created() {
    
  },
  mounted() {
    wx.request({
      url: config.base + 'pic/list', //开发者服务器接口地址",
      data: {
        lineId: config.lineId
      }, //请求的参数",
      method: 'GET',
      dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        // console.log(res.data)
        this.paintList = res.data.data
        this.mainPic = this.paintList[0].pic_image
      },
      fail: () => {},
      complete: () => {}
    });
  },
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
}
.index-list {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 22;
  &-box {
    height: 160rpx;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-left: 20px;
  }
  &-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    &-img {
      width: 143rpx;
      height: 145rpx;
    }
  }
}
.paint-bg {
  width: auto;
  height: 100%;
  display: block;
  img{
    width: 1620rpx;
    height: 100%;
  }
}
</style>
