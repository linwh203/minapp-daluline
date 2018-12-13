<template>
  <div class="container">
    <scroll-view scroll-y class="article-view">
      <div class="msg-item" v-for="(item,index) in msgList" :key="index">
        <div class="msg-item-pic">
          <img :src="prefix + item.image" style="width:100%;height:100%;display:block;">
        </div>
        <div class="msg-item-main">
          <div class="msg-item-main-top">
            <div class="msg-item-main-top-left">{{item.title}}</div>
            <div class="msg-item-main-top-right" v-if="item.time">{{item.time}}</div>
          </div>
          <div class="msg-item-main-btm">
            {{item.text}}
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import { config } from '../../utils/index'
export default {
  data() {
    return {
      userCode:'',
      msgList:[],
      prefix:config.prefix
    };
  },

  components: {},

  methods: {

  },

  created() {
    this.userCode = wx.getStorageSync('userCode');
  },
  mounted() {
    wx.request({
      url: config.base + 'message/list', //开发者服务器接口地址",
      data: {
        lineId:config.lineId
      }, //请求的参数",
      method: 'GET',
      dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        console.log(res.data)
        this.msgList = res.data.data
      },
      fail: () => {},
      complete: () => {}
    });
  }
};
</script>

<style scoped lang="less">
.container{
  background: #fff;
}
.article-view{
  width: 100%;
}
img{
  width: 100%;
}
.msg-item{
  width: 100%;
  margin-top: 26rpx;
  // height: 160rpx;
  display: flex;
  &-pic{
    width: 116rpx;
    height: 116rpx;
    border-radius: 50%;
    border:1px solid #e0e0e0;
    overflow: hidden;
    background: #e0e0e0;
    margin-left: 23rpx;
    margin-right: 15rpx;
  }
  &-main{
    width: 80%;
    border-bottom:1px solid #e0e0e0;
    &-top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right:25rpx;
      &-left{
        font-size: 34rpx;
      }
      &-right{
        font-size: 24rpx;
        color:#909090;
      }
    }
    &-btm{
      margin-right:25rpx;
      margin-bottom:24rpx;
      font-size: 24rpx;
      color:#909090;
    }
  }
}
.ellipsis{
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}
</style>
