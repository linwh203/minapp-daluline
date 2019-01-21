<template>
  <div class="container">
    <map
      id="map"
      longitude="114.52489"
      latitude="22.54483"
      scale="20"
      :controls="controls"
      :markers="markers"
      :polyline="polyline"
      :polygons="polygons"
      show-location
      style="width: 100%; height:calc(100% - 176rpx)"
      @click="touchMap"
      @markertap="touchMarker"
    >
      <!-- <cover-view>
        <cover-image src="https://gw.alicdn.com/tfs/TB1JlSPn7zoK1RjSZFlXXai4VXa-2835-2835.jpg"></cover-image>
      </cover-view>-->
      <cover-view class="message" v-if="isShowOutTip">
        <cover-view>您当前不在研习径范围内,</cover-view>
        <cover-view>不能进行定位讲解</cover-view>
      </cover-view>
      <cover-view class="reset" @click="resetPosition">
        <cover-image
          class="img"
          src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/Other/map-position.png"
        />
      </cover-view>
      <!-- <img class="img" src="../../assets/reset.png">
      <img class="img" src="../../assets/spot-gray.png">
      <img class="img" src="../../assets/spot-highlight.png">-->
    </map>
    <div class="modal">
      <img
        mode="widthFix"
        v-if="!currSpot"
        class="def"
        src="https://dl-line.oss-cn-shenzhen.aliyuncs.com/Other/map_legend.png"
      >
      <div
        v-if="currSpot"
        class="spot-item-window"
        :class="'window-'+currSpot.sortNo"
        @click="viewDetail(currSpot)"
      >
        <img
          class="left"
          mode="aspectFit"
          src="https://gw.alicdn.com/tfs/TB1HPbzvQvoK1RjSZFwXXciCFXa-20-140.png"
          alt
        >
        <div class="middle">
          <img
            class="spot-item-window-pic"
            :src="prefix + currSpot.spot_coverurl"
            v-if="currSpot.spot_coverurl"
          >
          <div class="spot-item-window-text">
            <div class="spot-item-window-title">{{currSpot.spot_title}}</div>
            <div class="spot-item-window-desc">{{currSpot.spot_describe}}</div>
          </div>
        </div>
        <img
          class="right"
          src="https://gw.alicdn.com/tfs/TB1nEsevNjaK1RjSZKzXXXVwXXa-54-140.png"
          alt
        >
      </div>
    </div>
  </div>
</template>

<script>
import { config } from "../../utils/index";
var amapFile = require("../../utils/amap-wx.js");

export default {
  data() {
    return {
      // 调试
      // isMock: true,
      isMock: false,
      // 地图上下文
      mapIns: undefined,
      // 人的位置
      lng: 0,
      lat: 0,

      prefix: config.prefix,
      // 查询的类型,"自然线"或者"诗歌线"
      queryType: 0,
      // 当前spot
      currSpot: undefined,
      controls: [],
      markers: [],
      distance: "",
      cost: "",
      polyline: [],
      polygons: [],
      spotList: [],
      // audio
      innerAudioContext: undefined,
      // 是否是主动播放
      isActivePlay: false,
      // 尝试主动播放的标记
      isTryActivePlay: false,
      // 是否在播放
      isPlaying: false,

      // position
      tForPosition: 0,
      hasShowOutTip: false,
      isShowOutTip: false,
      mapStart: {
        lng: 114.49358,
        lat: 22.61034
      },
      mapEnd: {
        lng: 114.50023,
        lat: 22.59959
      },
      person: undefined,
      geo: undefined
    };
  },
  computed: {},

  components: {},

  methods: {
    // 去浏览spot的详细界面
    viewDetail(spot) {
      wx.navigateTo({ url: "../list/main?spot_index=" + spot.sortNo });
    },
    getSpot(queryType) {
      console.log("getSpot....");
      let queryUrl = config.base + "attraction/List";
      return new Promise(resolve => {
        let storageName = "DaluList";
        const storageData = wx.getStorageSync(storageName);
        if (storageData) {
          resolve(storageData);
          return;
        }
        wx.request({
          url: queryUrl, //开发者服务器接口地址",
          data: {
            lineId: config.lineId
          }, //请求的参数",
          method: "GET",
          dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
          success: res => {
            // console.log(res)
            let data = res.data.data;
            data = typeof data === "string" ? JSON.parse(data) : data;
            wx.setStorageSync(storageName, data);
            resolve(data);
          },
          fail: () => {},
          complete: () => {}
        });
      });
    },
    createMarkers(spotList) {
      console.log("create Markers");
      this.markers = spotList.map(n => {
        let iconPath = this.getIconPath(n.sortNo);
        return {
          id: n.sortNo,
          title: n.spot_name,
          longitude: n.realLng,
          latitude: n.realLat,
          iconPath
        };
      });
    },
    createPolygons() {
      let geo = (this.geo = this.geo || this.initGeoTrans());
      let url = config.base + "Attraction/map";
      wx.request({
        url,
        success: res => {
          let data = res.data.data;

          data = data.map(n => {
            let format = geo.gcj_encrypt(n.latitude, n.longitude);
            return {
              latitude: format.lat,
              longitude: format.lon
            };
          });
          console.log(data);

          this.polygons = [
            {
              points: data,
              strokeColor: "#50B028AA",
              strokeWidth: 4,
              fillColor: "#A3D49257"
            }
          ];
        }
      });
    },
    touchMap(e) {
      this.stopAudio();
    },
    touchMarker(e) {
      console.log("touch marker");
      let markerId = e.mp.markerId;

      this.isTryActivePlay = true;
      this.activeSpot(markerId);
    },
    activeSpot(spotId) {
      // 反激活
      if (this.currSpot) {
        let ma = this.markers.find(n => n.id == this.currSpot.sortNo);
        ma.iconPath = this.getIconPath(this.currSpot.sortNo);
      }

      // 激活
      this.currSpot = this.spotList.find(n => n.sortNo == spotId);
      let ma = this.markers.find(n => n.id == spotId);
      ma.iconPath = ma.iconPath = this.getIconPath(this.currSpot.sortNo, -1);

      // 激活audio的播放
      this.playAudio(this.currSpot.spot_id);
    },
    // 播放音频
    playAudio(spotId) {
      new Promise(resolve => {
        wx.request({
          url: config.base + "attraction/listdetail", //开发者服务器接口地址",
          data: {
            spot_id: spotId
          }, //请求的参数",
          method: "GET",
          dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
          success: res => {
            console.log(res.data.data);
            let data = res.data.data;
            resolve(data.audio_url);
          },
          fail: () => {
            resolve(null);
          },
          complete: () => {}
        });
      }).then(audioUrl => {
        if (audioUrl) {
          this.innerAudioContext.src = audioUrl;
          this.innerAudioContext.play();
          console.log(this.innerAudioContext.src, "play audio");
        }
      });
    },
    stopAudio() {
      this.innerAudioContext && this.innerAudioContext.stop();
    },
    initAudio() {
      // 初始化audio
      this.innerAudioContext = wx.createInnerAudioContext();
      console.log(this.innerAudioContext);
      this.innerAudioContext.onPlay(() => {
        console.log("audio event: play");
        this.isPlaying = true;
        if (this.isTryActivePlay) {
          this.isActivePlay = true;
          this.isTryActivePlay = false;
        }
      });

      this.innerAudioContext.onStop(() => {
        console.log("audio event: stop");
        this.isPlaying = false;
        this.isTryActivePlay = false;
        if (this.isActivePlay) {
          this.isActivePlay = false;
        }
      });

      this.innerAudioContext.onEnded(() => {
        console.log("audio event: ended");
        this.isPlaying = false;
        this.isTryActivePlay = false;
        if (this.isActivePlay) {
          this.isActivePlay = false;
        }
      });
    },
    getPosition() {
      return new Promise(resolve => {
        wx.getLocation({
          type: "gcj02", //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标,
          success: res => {
            resolve({ lng: res.longitude, lat: res.latitude });
          },
          fail: () => {
            resolve(null);
          }
        });
      });
    },
    isPositionOut(lng, lat) {
      return (
        lat < Math.min(this.mapStart.lat, this.mapEnd.lat) ||
        lat > Math.max(this.mapStart.lat, this.mapEnd.lat) ||
        lng < Math.min(this.mapStart.lng, this.mapEnd.lng) ||
        lng > Math.max(this.mapStart.lng, this.mapEnd.lng)
      );
    },

    // 寻找最新点
    findNearSpot(posi) {
      // 30米的经纬度差距
      const LNG_INTERVAL = 0.00029505;
      const LAT_INTERVAL = 0.00029608;
      const DIST = 30;
      let getDistance = (lng1, lat1, lng2, lat2) => {
        let d1 = Math.abs(lng1 - lng2) / LNG_INTERVAL * DIST;
        let d2 = Math.abs(lat1 - lat2) / LAT_INTERVAL * DIST;
        return Math.sqrt(d1 * d1 + d2 * d2);
      };
      //       我设置的起点是114.496872, 22.605782
      // 得到的30米偏差的经纬度坐标114.496602505415, 22.6055332100731
      // console.log(
      //   "getDistance",
      //   getDistance(114.496872, 22.605782, 114.496602505415, 22.6055332100731)
      // );

      if (this.spotList) {
        this.spotList.find(n => {
          let { longitude, latitude, sortNo } = n;
          if (
            this.lng &&
            this.lat &&
            getDistance(this.lng, this.lat, longitude, latitude) <= DIST &&
            1
          ) {
            // 激活最近点
            console.log("尝试激活最近点", sortNo - 1);
            if (this.isActivePlay) {
              return;
            }
            if (this.currSpot && this.currSpot.sortNo === sortNo) {
              return;
            }
            console.log("激活最近点", sortNo);
            this.activeSpot(sortNo);
            return true;
          }
        });
      }
    },
    resetPosition() {
      this.mapIns.moveToLocation();
    },
    initMap() {
      this.mapIns = wx.createMapContext("map");
      console.log("map instance:", this.mapIns);
    },
    initGeoTrans() {
      var GPS = {
        PI: 3.14159265358979324,
        x_pi: 3.14159265358979324 * 3000.0 / 180.0,
        delta: function(lat, lon) {
          // Krasovsky 1940
          // // a = 6378245.0, 1/f = 298.3
          // b = a * (1 - f)
          // ee = (a^2 - b^2) / a^2;
          var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
          var ee = 0.00669342162296594323;
          //  ee: 椭球的偏心率。
          var dLat = this.transformLat(lon - 105.0, lat - 35.0);
          var dLon = this.transformLon(lon - 105.0, lat - 35.0);
          var radLat = lat / 180.0 * this.PI;
          var magic = Math.sin(radLat);
          magic = 1 - ee * magic * magic;
          var sqrtMagic = Math.sqrt(magic);
          dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * this.PI);
          dLon = dLon * 180.0 / (a / sqrtMagic * Math.cos(radLat) * this.PI);
          return { lat: dLat, lon: dLon };
        },
        //GPS---高德
        gcj_encrypt: function(wgsLat, wgsLon) {
          if (this.outOfChina(wgsLat, wgsLon))
            return { lat: wgsLat, lon: wgsLon };
          var d = this.delta(wgsLat, wgsLon);
          return { lat: wgsLat + d.lat, lon: wgsLon + d.lon };
        },
        outOfChina: function(lat, lon) {
          if (lon < 72.004 || lon > 137.8347) return true;
          if (lat < 0.8293 || lat > 55.8271) return true;
          return false;
        },
        transformLat: function(x, y) {
          var ret =
            -100.0 +
            2.0 * x +
            3.0 * y +
            0.2 * y * y +
            0.1 * x * y +
            0.2 * Math.sqrt(Math.abs(x));
          ret +=
            (20.0 * Math.sin(6.0 * x * this.PI) +
              20.0 * Math.sin(2.0 * x * this.PI)) *
            2.0 /
            3.0;
          ret +=
            (20.0 * Math.sin(y * this.PI) +
              40.0 * Math.sin(y / 3.0 * this.PI)) *
            2.0 /
            3.0;
          ret +=
            (160.0 * Math.sin(y / 12.0 * this.PI) +
              320 * Math.sin(y * this.PI / 30.0)) *
            2.0 /
            3.0;
          return ret;
        },
        transformLon: function(x, y) {
          var ret =
            300.0 +
            x +
            2.0 * y +
            0.1 * x * x +
            0.1 * x * y +
            0.1 * Math.sqrt(Math.abs(x));
          ret +=
            (20.0 * Math.sin(6.0 * x * this.PI) +
              20.0 * Math.sin(2.0 * x * this.PI)) *
            2.0 /
            3.0;
          ret +=
            (20.0 * Math.sin(x * this.PI) +
              40.0 * Math.sin(x / 3.0 * this.PI)) *
            2.0 /
            3.0;
          ret +=
            (150.0 * Math.sin(x / 12.0 * this.PI) +
              300.0 * Math.sin(x / 30.0 * this.PI)) *
            2.0 /
            3.0;
          return ret;
        }
      };
      return GPS;
    },
    getIconPath(number, type) {
      if (type === -1) {
        return `../../assets/map-audio/${number}.png`;
      } else {
        return `../../assets/map-normal/${number}.png`;
      }
    }
  },
  onLoad(options) {
    console.log("onLoad", options);
    let geo = (this.geo = this.geo || this.initGeoTrans());

    this.queryType = options.queryType - 0;
    this.spotList = [];
    this.getSpot(this.queryType).then(data => {
      data = data.map(n => {
        let realPosi = geo.gcj_encrypt(n.latitude, n.longitude);
        n.realLng = realPosi.lon;
        n.realLat = realPosi.lat;
        return n;
      });
      this.spotList = data;
      console.log(this.spotList);
      this.createMarkers(this.spotList);
    });
    this.createPolygons();
  },
  onReady() {
    this.initMap();
    this.initAudio();
  },
  onShow() {
    let index = 0;
    // 轮询坐标
    this.tForPosition = setInterval(() => {
      this.getPosition().then(posi => {
        if (posi) {
          if (this.isMock) {
            posi.lng = 114.35762024;
            posi.lat = 22.61326927;
          }

          // mock
          if (!this.hasShowOutTip) {
            if (this.isPositionOut(posi.lng, posi.lat)) {
              this.isShowOutTip = true;
              this.hasShowOutTip = true;
              setTimeout(() => {
                this.isShowOutTip = false;
              }, 2000);
            }
          }

          this.findNearSpot(posi);
        }
      });
    }, 5000);
  },
  onHide() {
    // 清除轮询的句柄
    clearInterval(this.tForPosition);

    this.stopAudio();
  },
  onUnload() {
    // 清除轮询的句柄
    clearInterval(this.tForPosition);

    this.stopAudio();
  }
};
</script>

<style scoped lang="less">
.container {
  .modal {
    position: fixed;
    bottom: 0rpx;
    width: 100%;
    height: 176rpx;

    .def {
      width: 100%;
    }
  }

  .spot-item-window {
    width: 100%;
    height: 176rpx;
    border-bottom: 1px solid #c7c7c7;
    position: absolute;
    z-index: 999;
    display: flex;
    .left {
      width: 26rpx;
      height: 100%;
    }
    .right {
      width: 60rpx;
      height: 100%;
    }
    .middle {
      flex: 1;
      background-color: #fff;
      display: flex;
      align-items: center;
    }
    &-pic {
      width: 136rpx;
      height: 134rpx;
      background: #fff;
      margin: 12rpx 20rpx 0 12rpx;
    }
    &-text {
      // width: 280rpx;
      flex: 1;
      display: flex;
      flex-direction: column;
      color: #101010;
      text-align: left;
      overflow: hidden;
      padding-right: 20rpx;
    }
    &-title {
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
}
.message {
  @w: 80vw;
  @h: 20vh;
  width: @w;
  height: @h;
  position: absolute;
  top: calc(50% - @h / 2);
  left: calc(50% - @w / 2);
  background-color: black;
  opacity: 0.6;
  color: white;
  padding: 5% 15% 0;
  box-sizing: border-box;
  text-align: center;
}
.reset {
  position: absolute;
  bottom: 30rpx;
  right: 30rpx;
  // transform: scale(0.5);
  width: 44px;
  img {
    width: 48rpx;
    height: 48rpx;
  }
}
#map {
  height: 80vh;
}
</style>
