<template>
  <movable-area class="container">
    <movable-view class="index-bg" :scale="false" :x="x" :y="y" :animation="false" scale-max="1.2" scale-min="1" direction="all"  @scale="startScale" @change="startTouch" >
      <img class="mapImg" src="https://gw.alicdn.com/tfs/TB1JlSPn7zoK1RjSZFlXXai4VXa-2835-2835.jpg" alt="" >
      <div class="spot-icon"  :class="activeSpot == index?'changeBG':''" v-for="(item,index) in spotList" :key="item.sortNo"
            @click="showWindow(index)" :style="{top:item.top+'rpx',left:item.left+'rpx',transform:'scale('+spotScale+')'}">
        <span >{{item.sortNo}}</span>
        <div class="spot-item-window" :class="'window-'+item.sortNo" v-if="activeWindow == index" @click="viewDetail(item)">
          <img class="spot-item-window-pic" :src="prefix + item.spot_coverurl" v-if=item.spot_coverurl>
          <div class="spot-item-window-text">
            <div class="spot-item-window-title">{{item.spot_title}}</div>
            <div class="spot-item-window-desc">{{item.spot_describe}}</div>
          </div>
        </div>
      </div>
    </movable-view>
    <div class="index-tab">
      <!-- <div class="index-tab-item icon-map" @click="bindTab('../index/main')" >
        <img src="https://gw.alicdn.com/tfs/TB1hOhEmMDqK1RjSZSyXXaxEVXa-90-101.png" alt="">
      </div> -->
      <div class="index-tab-item icon-list" @click="bindTab('../index/main')">
        <img src="https://gw.alicdn.com/tfs/TB1gqFKmHvpK1RjSZFqXXcXUVXa-91-101.png">
      </div>
      <div class="index-tab-item icon-scan" @click="bindTab('../scan/main')">
        <img src="https://gw.alicdn.com/tfs/TB1gWBKmHvpK1RjSZFqXXcXUVXa-91-101.png" alt="">
      </div>
      <div class="index-tab-item icon-audio" @click="playAudio" v-if="false">
        <img src="https://gw.alicdn.com/tfs/TB1PStFmSzqK1RjSZFLXXcn2XXa-91-101.png" alt="">
      </div>
      <div class="index-tab-item icon-quiz" @click="bindTab('../quiz/main')">
        <img src="https://gw.alicdn.com/tfs/TB1mz8HmQvoK1RjSZFNXXcxMVXa-91-101.png" alt="">
      </div>
      <div class="index-tab-item icon-rule" @click="bindTab('../my-rule/main')">
        <img src="https://gw.alicdn.com/tfs/TB1QrFHmSzqK1RjSZFHXXb3CpXa-91-100.png" alt="">
      </div>
      <div class="index-tab-item icon-my" @click="bindTab('../my/main')">
        <img src="https://gw.alicdn.com/tfs/TB1TXlImMHqK1RjSZFgXXa7JXXa-92-99.png" alt="">
      </div>
      <div class="index-tab-line"></div>
    </div>
  </movable-area>
</template>

<script>
import { config } from "../../utils/index";

export default {
  data() {
    return {
      spotList: [],
      activeSpot: 0,
      activeWindow: -1,
      x: 0,
      y: 0,
      left:0,
      top:0,
      mapStart: {
        lng: 114.32751775,
        lat: 22.63737202
      },
      mapEnd: {
        lng: 114.36443567,
        lat: 22.60346353
      },
      Xstart: {
        lng: 114.32751775,
        lat: 22.63737202
      },
      Xend: {
        lng: 114.32751775,
        lat: 22.60346353
      },
      Ystart: {
        lng: 114.32751775,
        lat: 22.63737202
      },
      Yend: {
        lng: 114.36443567,
        lat: 22.63737202
      },
      nearSpot: 0,
      prefix: config.prefix,
      // 当前地图的spot的缩放比例,跟地图的scale成为反比
      spotScale: 1,
      _tScale: undefined
    };
  },
  computed: {},

  components: {},

  methods: {
    startScale(e) {
      console.log("start scale", e);
      let detail = e.mp.detail;
      let scale = detail.scale;
      if(scale > 1) {
        // this.x = e.x;
        // this.y = e.y;
      }
      return;
    },
    startTouch(e) {
      let detail = e.mp.detail;
      this._x = detail.x;
      this._y = detail.y;
    },
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
    distance(item) {
      let x = this.locate(this.Xstart, this.Xend);
      let y = this.locate(this.Ystart, this.Yend);
      let width = 5630;
      let spotX = {},
        spotY = {};
      spotX.lng = this.Xstart.lng;
      spotX.lat = item.latitude;
      let left = this.locate(this.Xstart, spotX);
      spotY.lng = item.longitude;
      spotY.lat = this.Ystart.lat;
      let top = this.locate(this.Ystart, spotY);
      let result = {
        top: left * width / x,
        left: top * width / y
      };
      return result;
    },
    bindTab(url) {
      wx.navigateTo({ url: url });
    },
    viewDetail(item) {
      const index = this.activeSpot < 0 ? 0 : this.activeSpot;
      wx.navigateTo({ url: "../list/main?spot_index=" + index });
    },
    showWindow(index) {
      this.activeWindow == index
        ? (this.activeWindow = -1)
        : (this.activeWindow = index);
      this.activeSpot == index
        ? (this.activeSpot = -1)
        : (this.activeSpot = index);
      this.x = this._x;
      this.y = this._y;
      console.log(this.spotList);
      console.log(this.spotList[index]);
      return;
      if (index < 12) {
        this.x = -1400;
        this.y = -900;
      } else if (index < 15 && index > 11) {
        this.x = -300;
        this.y = -1900;
      } else if (index == 15) {
        this.x = -1199;
        this.y = -247;
      } else if (index > 15 && index <= 33) {
        this.x = -176;
        this.y = -455;
      } else if (index > 33 && index <= 40) {
        this.x = -307;
        this.y = -138;
      } else if (index > 40 && index <= 51) {
        this.x = -485;
        this.y = -276;
      } else if (index > 51 && index <= 59) {
        this.x = -590;
        this.y = -676;
      } else if (index > 59 && index <= 66) {
        this.x = -772;
        this.y = -739;
      } else if (index > 66 && index <= 73) {
        this.x = -1022;
        this.y = -384;
      } else if (index > 73 && index <= 81) {
        this.x = -1199;
        this.y = -247;
      } else if (index == 82) {
        this.x = -176;
        this.y = -455;
      }
    },
    locate(point1, point2) {
      function rad(d) {
        return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
      }
      let radLat1 = rad(point1.lat);
      let radLat2 = rad(point2.lat);
      let a = radLat1 - radLat2;
      let b = rad(point1.lng) - rad(point2.lng);
      let s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * 6378.137;
      // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000;
      // console.log(s)
      return s;
    },
    getSpot() {
      const self = this;
      const storageData = wx.getStorageSync("NatureList");
      if (storageData) {
        storageData.forEach((item, index) => {
          let result = this.distance(item);
          item.top = result.top;
          item.left = result.left;
        });
        this.spotList = storageData;
        return;
      }
      wx.request({
        url: config.base + "attraction/NaturalList", //开发者服务器接口地址",
        data: {
          lineId: config.lineId
        }, //请求的参数",
        method: "GET",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          // console.log(res)
          let data = res.data.data;
          this.setStorage("NatureList", data);
          data.forEach(item => {
            let result = this.distance(item);
            item.top = result.top;
            item.left = result.left;
          });
          this.spotList = data;
        },
        fail: () => {},
        complete: () => {}
      });
    }
  },
  created() {
    this.getSpot();
  },
  mounted() {},
  onReady() {
    this.x = -1400;
    this.y = -900;
  }
};
</script>

<style scoped lang="less">
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#mid {
  width: 10px;
  height: 10px;
  background: red;
  position: absolute;
  top: 1000rpx;
  left: 430rpx;
  z-index: 99999;
}
.container {
  width: 100%;
  position: relative;
  z-index: 2;
  margin-top: 20rpx;
}
.map-tab {
  height: 150rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #d5aa80;
  z-index: 99;
  &-item {
    width: 100rpx;
    height: 110rpx;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
.index-bg {
  width: auto;
  height: auto;
  background: #d1a77f;
  .mapImg {
    width: 5630rpx;
    height: 5630rpx;
  }
}

.active-spot {
  width: 40rpx;
  height: 30rpx;
  margin: auto;
}
.spot-icon {
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  background: yellow;
  position: absolute;
  z-index: 888;
  text-align: center;
  color: #292770;
  font-size: 28rpx;
  border-radius: 50%;
  border: 1px solid #a8368e;
}
.changeBG {
  background: #a8368e;
  color: #fff;
  border: yellow;
  z-index:1000;
}
.index-tab {
  position: fixed;
  top: 15rpx;
  right: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  z-index: 21;
  &-item {
    width: 100rpx;
    height: 110rpx;
    margin-bottom: 36rpx;
    position: relative;
    z-index: 23;
  }
  &-line {
    width: 1px;
    height: 90%;
    background-image: url("https://gw.alicdn.com/tfs/TB1B10KmFzqK1RjSZSgXXcpAVXa-2-762.png");
    background-repeat: repeat-y;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 10rpx;
    right: 32rpx;
    z-index: 22;
  }
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.spot-item-window {
  width: 522rpx;
  height: 176rpx;
  border-bottom: 1px solid #c7c7c7;
  background: url("https://gw.alicdn.com/tfs/TB1PHRpnCzqK1RjSZPxXXc4tVXa-1809-607.png")
    no-repeat center/contain;
  position: absolute;
  bottom: 40rpx;
  left: -90rpx;
  z-index: 999;
  display: flex;
  &-pic {
    width: 136rpx;
    height: 134rpx;
    background: #fff;
    margin: 12rpx 12rpx 0 32rpx;
  }
  &-text {
    width: 280rpx;
    display: flex;
    flex-direction: column;
    color: #101010;
    text-align: left;
    overflow: hidden;
  }
  &-title {
    margin-top: 45rpx;
    font-size: 28rpx;
    line-height: 40rpx;
    white-space: nowrap;
    overflow: hidden;
  }
  &-desc {
    font-size: 20rpx;
    color: #6f6f6f;
    line-height: 30rpx;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 2; /** 显示的行数 **/
    overflow: hidden; /** 隐藏超出的内容 **/
  }
}
</style>
