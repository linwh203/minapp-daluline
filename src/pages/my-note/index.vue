<template>
  <div class="container">
    <div class="note-area">
      <div class="textarea">
        <textarea 
          :placeholder="holderText"
          :placeholder-style="style"
          @focus="onFocus" auto-height fixed v-model="text"/>
      </div>
      <div class="submit" @click="submit">发布</div>
      <cover-view class="note-area-icon" v-if="showHolder">
        <cover-image src="https://gw.alicdn.com/tfs/TB1GU03xlLoK1RjSZFuXXXn0XXa-30-32.png"></cover-image>
      </cover-view>
    </div>
    <div class="main">
      <div class="main-item" v-for="(item,index) in noteList" :key=item.id>
        <div class="main-item-left">
          <img class="main-item-left-icon" src="https://gw.alicdn.com/tfs/TB13VGlxkPoK1RjSZKbXXX1IXXa-35-18.png">
          <div class="main-item-left-number">{{index+1}}</div>
          <div class="main-item-left-line" v-if="index!=noteList.length-1"></div>
        </div>
        <div class="main-item-right">
          <div class="main-item-right-container">
            <div class="main-item-right-up">
              {{item.content}}
            </div>
            <div class="main-item-right-down">
              <div class="main-item-right-down-time">{{item.time}}</div>
              <div class="main-item-right-down-del" @click="openDialog(item.id)">删除</div>
            </div>
          </div>
          <div class="main-item-right-margin"></div>
        </div>
      </div>
    </div>
    <div class="dialog" v-if="dialog">
      <div class="dialog-box">
        <div class="dialog-box-first">您确定要删除</div>
        <div class="dialog-box-second">此笔记吗？</div>
        <div class="dialog-box-btns">
          <div class="dialog-box-btns-item confirm" @click="confirmDel">确定</div>
          <div class="dialog-box-btns-item cancel" @click="dialog=false">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { config, formatDate } from "../../utils/index";

export default {
  data() {
    return {
      text: "",
      contact: "",
      noteList: [],
      userCode: "",
      isFoucs: false,
      currentId:"",
      dialog:false,
      showHolder:true,
      holderText:"__ 留下笔记"
    };
  },

  components: {},

  methods: {
    touchTextarea() {
      console.log("touch textarea");
      this.isFoucs = true;
    },
    openDialog(id) {
      this.currentId = id;
      this.dialog = true;
    },
    onFocus() {
      console.log("focus");
      this.showHolder = false;
      this.holderText = "";
    },
    confirmDel() {
      const token = wx.getStorageSync("userCode");
      const delUrl = `${config.base}Note/deleteNoteList?token=${token}&id=${this.currentId}`;
      wx.request({
        // url: config.base + 'Note/deleteNoteList', //开发者服务器接口地址"
        url: delUrl, //开发者服务器接口地址"
        method: 'DELETE',
        // data: {
        //   token: token,
        //   id: this.currentId
        // },
        dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          wx.showToast({
            title: "删除成功", //提示的内容,
            icon: "success", //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
          });
          this.dialog = false;
          this.getNoteList();
        },
        fail: () => {},
        complete: () => {}
      });
    },
    submit() {
      if (!this.text) {
        wx.showToast({
          title: "请输入内容", //提示的内容,
          icon: "none", //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        return;
      }
      const token = wx.getStorageSync("userCode");
      wx.request({
        url: config.base + "note/AddNoteList", //开发者服务器接口地址",
        data: {
          content: this.text
        }, //请求的参数",
        method: "post",
        header: {
          token: token
        },
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data);
          if (res.data.res_code == 0) {
            wx.showToast({
              title: "发布成功", //提示的内容,
              icon: "success", //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
            this.text = "";
            this.getNoteList();
          } else {
            wx.showToast({
              title: "反馈失败，请稍后再试", //提示的内容,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          }
        },
        fail: () => {},
        complete: () => {}
      });
    },
    getNoteList() {
      const token = wx.getStorageSync("userCode");
      wx.request({
        url: config.base + 'note/noteList', //开发者服务器接口地址",
        // data: {
        //   token:token
        // }, //请求的参数",
        header: {
          token: token
        },
        method: 'GET',
        dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log('note',res.data)
          this.noteList = res.data && res.data.data;
          this.noteList.forEach(item => {
            item.time = formatDate(item.time);
          })
        },
        fail: () => {},
        complete: () => {}
      });
    }
  },

  onLoad() {
    this.userCode = wx.getStorageSync("userCode");
    this.getNoteList();
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.container {
  background: #f3f3f3;
}
.main{
  padding: 48rpx 20rpx 90rpx;
  background: #f3f3f3;
  &-item{
    display: flex;
    &-left{
      margin-right: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      &-number{
        width: 66rpx;
        line-height: 66rpx;
        text-align: center;
        background: #292770;
        color:#fff;
        border-radius: 50%;
      }
      &-line{
        height: 100%;
        width: 2px;
        background: #292770;
      }
      &-icon{
        width: 36rpx;
        height: 18rpx;
        position: absolute;
        top: -14rpx;
        left: 0;
        right: 0;
        margin:auto;
      }
    }
    &-right{
      width: 100%;
      font-size: 28rpx;
      &-up{
        padding:20rpx;
      }
      &-container{
        background: #fff;
        border:1px solid #eaebea;
        min-height:240rpx;
        border-radius: 8rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      &-margin{
        height: 48rpx;
      }
      &-down{
        height: 60rpx;
        border-top:1px dashed #dcdcdc;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-time{
          color:#cacaca;
          margin-left: 20rpx;
        }
        &-del{
          width: 78rpx;
          line-height: 38rpx;
          text-align: center;
          border-radius: 10rpx;
          color:#6f6f6f;
          border:1px dashed #868686;
          margin-right: 20rpx;
        }
      }
    }
  }
}
.note-area{
  display: flex;
  align-items: center;
  position:fixed;
  bottom: 0rpx;
  left: 0rpx;right: 0rpx;
  padding:20rpx;
  border-top:1px solid #dcdcdc;
  background: #f3f3f3;
  z-index: 88;
  &-icon{
    position: fixed;
    left: 38rpx;
    bottom: 62rpx;
    width: 40rpx;
    height: 40rpx;
  }
}
.textarea {
  min-height:36rpx;
  font-size: 30rpx;
  border-radius: 12rpx;
  border:1px solid #dcdcdc;
  width: 78%;
  background: #fff;
  padding: 24rpx;
  textarea{
    width: 100%;
  }
}

.submit {
  width: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: #2b9f62;
  border-radius: 12rpx;
  color: #fff;
  font-size: 30rpx;
  margin-left: 16rpx;
}
.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}
.dialog{
  position: fixed;z-index: 999;
  top: 0;bottom: 0;left: 0;right: 0; background: rgba(0,0,0,.5);
  display: flex;justify-content: center;align-items:center;
  &-box{
    width: 380rpx;
    height: 380rpx;
    padding:20rpx;
    border-radius: 20rpx;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 36rpx;
    &-first{
      margin-top: 80rpx;
      margin-bottom: 20rpx;
    }
    &-second{
      margin-bottom: 96rpx;
    }
    &-btns{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-item{
        width: 160rpx;
        line-height: 80rpx;
        color:#fff;
        text-align: center;
        border-radius: 10rpx;
      }
    }
  }
}
.confirm{
  background: #292770;
}
.cancel{
  background: #6f6f6f;
}
</style>
