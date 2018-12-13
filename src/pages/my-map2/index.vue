<template>
  <div class="container">
    <!-- <map id="map" :longitude="lng" :latitude="lat" scale="16" 
    :controls="controls" @controltap="controltap" 
    :markers="markers" @markertap="markertap" 
    :polyline="polyline" @regionchange="regionchange" 
    show-location 
    style="width: 100%; height: 100%;"
    ></map> -->
    <view class="flex-style">
      <view class="flex-item active" bindtouchstart="goToCar">驾车</view>
      <view class="flex-item" bindtouchstart="goToWalk">步行</view>
      <view class="flex-item" bindtouchstart="goToBus">公交</view>
      <view class="flex-item" bindtouchstart="goToRide">骑行</view>
    </view>
    <view class="map_box">
      <map id="navi_map" longitude="116.451028" latitude="39.949643" scale="12" :markers="markers" :polyline="polyline"></map>
    </view>

    <view class="text_box">
      <view class="text">{{distance}}</view>
      <view class="text">{{cost}}</view>
      <view class="detail_button" bindtouchstart="goDetail">详情</view>
    </view>
  </div>
</template>

<script>
import { config } from "../../utils/index";
var amapFile = require('../../utils/amap-wx.js') 

export default {
  data() {
    return {
      //  longitude: 113.3245211,
      //   latitude: 23.10229
      lng: 114.32751775,
      lat: 22.63737202,
      controls: [],
      markers: [{
        iconPath: "https://gw.alicdn.com/tfs/TB18fNUqSzqK1RjSZPcXXbTepXa-74-67.png",
        id: 0,
        latitude: 39.989643,
        longitude: 116.481028,
        width: 23,
        height: 33
      },{
        iconPath: "https://gw.alicdn.com/tfs/TB1Z6iGn6TpK1RjSZKPXXa3UpXa-74-66.png",
        id: 0,
        latitude: 39.90816,
        longitude: 116.434446,
        width: 24,
        height: 34
      }],
      distance: '',
      cost: '',
      polyline: []
    };
  },
  computed: {},

  components: {},

  methods: {
    startScale(e) {
      let detail = e.mp.detail;
      let scale = detail.scale;
      console.log("start scale", scale);
      this._x = detail.x;
      this._y = detail.y;
      this._spotScale = 1 / scale;

      if (this._tScale) {
        clearTimeout(this._tScale);
      }
      this._tScale = setTimeout(() => {
        this.spotScale = this._spotScale;
        this.x = this._x;
        this.y = this._y;
      }, 100);
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
      let width = 3753;
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
      let processData = data => {
        this.markers = data.map((item, index) => {
          // console.log(index);
          return {
            id: index,
            title: item.spot_title,
            longitude: item.longitude,
            latitude: item.latitude,
            // callout: {
            //   content: item.spot_title
            // },
            label: {
              content: item.spot_name
            }
          };
        });
      };
      if (storageData) {
        processData(storageData);
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
          processData(data);
        },
        fail: () => {},
        complete: () => {}
      });
    }
  },
  created() {
    console.log("create");
    // this.getSpot();
  },
  onLoad() {

    var that = this;
    var key = 'f8a1f49bfc110fe1fb27f66d31ae51e6';//web key
    var myAmapFun = new amapFile.AMapWX({key: '77e91d24d844c4829f423939f5df930b'});
    myAmapFun.ImageLayer({
      url:'https://gw.alicdn.com/tfs/TB1JlSPn7zoK1RjSZFlXXai4VXa-2835-2835.jpg',
      bounds: myAmapFun.Bounds(
        [116.451028, 39.949643],   //左下角
        [116.471028, 39.929643]    //右上角
      ),
      zooms: [15, 18]
    })
  },
  onReady() {
    this.x = -1400;
    this.y = -900;
  }
};
</script>

<style scoped lang="less">
.flex-style{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}
.flex-item{
  height: 35px; 
  line-height: 35px;
  text-align: center;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1
}
.flex-item.active{
  color:#0091ff;
}
.map_box{
  height:80%;
  position:absolute;
  top: 35px;
  bottom: 90px;
  left: 0px;
  right: 0px;
}
#navi_map{
  width: 100%;
  height: 100%;
}
.text_box{
  position:absolute;
  height: 90px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
.text_box .text{
  margin: 15px;
}
.detail_button{
  position:absolute;
  bottom: 30px;
  right: 10px;
  padding: 3px 5px;
  color: #fff;
  background: #0091ff;
  width:50px;
  text-align:center;
  border-radius:5px;
}
</style>
