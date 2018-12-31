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
          src="https://qg-line.oss-cn-shenzhen.aliyuncs.com/map/map-position.png"
        />
      </cover-view>
      <!-- <img class="img" src="../../assets/reset.png">
      <img class="img" src="../../assets/spot-gray.png">
      <img class="img" src="../../assets/spot-highlight.png">-->
    </map>
    <div class="modal">
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
          // data = [
          //   { longitude: 114.519778490067, latitude: 22.54718542099 },
          //   { longitude: 114.519917964935, latitude: 22.5478506088257 },
          //   { longitude: 114.520003795624, latitude: 22.5484943389893 },
          //   { longitude: 114.520003795624, latitude: 22.5491595268249 },
          //   { longitude: 114.52006816864, latitude: 22.5501465797424 },
          //   { longitude: 114.520046710968, latitude: 22.5504040718079 },
          //   { longitude: 114.519789218903, latitude: 22.5511980056763 },
          //   { longitude: 114.519188404083, latitude: 22.5514554977417 },
          //   { longitude: 114.518673419952, latitude: 22.5520348548889 },
          //   { longitude: 114.518394470215, latitude: 22.5528287887573 },
          //   { longitude: 114.518802165985, latitude: 22.5530219078064 },
          //   { longitude: 114.519059658051, latitude: 22.5535583496094 },
          //   { longitude: 114.518780708313, latitude: 22.5548672676086 },
          //   { longitude: 114.5192527771, latitude: 22.5555539131165 },
          //   { longitude: 114.519681930542, latitude: 22.5556826591492 },
          //   { longitude: 114.520239830017, latitude: 22.5560688972473 },
          //   { longitude: 114.519917964935, latitude: 22.5567770004273 },
          //   { longitude: 114.520690441132, latitude: 22.557270526886 },
          //   { longitude: 114.522643089294, latitude: 22.5575280189514 },
          //   { longitude: 114.523780345917, latitude: 22.5583219528198 },
          //   { longitude: 114.524745941162, latitude: 22.5591158866882 },
          //   { longitude: 114.525668621063, latitude: 22.5602531433105 },
          //   { longitude: 114.52543258667, latitude: 22.5610899925232 },
          //   { longitude: 114.525475502014, latitude: 22.5616264343262 },
          //   { longitude: 114.525454044342, latitude: 22.5633859634399 },
          //   { longitude: 114.525346755981, latitude: 22.5647592544556 },
          //   { longitude: 114.525625705719, latitude: 22.5651454925537 },
          //   { longitude: 114.525668621063, latitude: 22.5656175613403 },
          //   { longitude: 114.525368213654, latitude: 22.5659394264221 },
          //   { longitude: 114.524896144867, latitude: 22.5664973258972 },
          //   { longitude: 114.524745941162, latitude: 22.5673127174377 },
          //   { longitude: 114.525218009949, latitude: 22.5681924819946 },
          //   { longitude: 114.526526927948, latitude: 22.5685572624207 },
          //   { longitude: 114.527771472931, latitude: 22.5688362121582 },
          //   { longitude: 114.529402256012, latitude: 22.5688147544861 },
          //   { longitude: 114.530131816864, latitude: 22.5681066513062 },
          //   { longitude: 114.530839920044, latitude: 22.5678491592407 },
          //   { longitude: 114.531805515289, latitude: 22.5674843788147 },
          //   { longitude: 114.533693790436, latitude: 22.5663471221924 },
          //   { longitude: 114.534358978271, latitude: 22.5661110877991 },
          //   { longitude: 114.53485250473, latitude: 22.5666904449463 },
          //   { longitude: 114.534873962402, latitude: 22.5676560401917 },
          //   { longitude: 114.534788131714, latitude: 22.5687289237976 },
          //   { longitude: 114.534766674042, latitude: 22.570230960846 },
          //   { longitude: 114.536998271942, latitude: 22.5706601142883 },
          //   { longitude: 114.538629055023, latitude: 22.5701665878296 },
          //   { longitude: 114.54021692276, latitude: 22.5684070587158 },
          //   { longitude: 114.541354179382, latitude: 22.5682139396667 },
          //   { longitude: 114.541847705841, latitude: 22.5686430931091 },
          //   { longitude: 114.542577266693, latitude: 22.5690078735352 },
          //   { longitude: 114.542148113251, latitude: 22.5702524185181 },
          //   { longitude: 114.542384147644, latitude: 22.5711321830749 },
          //   { longitude: 114.543907642365, latitude: 22.5714540481567 },
          //   { longitude: 114.545924663544, latitude: 22.5708103179932 },
          //   { longitude: 114.546890258789, latitude: 22.5707244873047 },
          //   { longitude: 114.548885822296, latitude: 22.5690293312073 },
          //   { longitude: 114.549701213837, latitude: 22.567720413208 },
          //   { longitude: 114.549872875214, latitude: 22.5663042068481 },
          //   { longitude: 114.549701213837, latitude: 22.5640726089477 },
          //   { longitude: 114.549100399017, latitude: 22.5632572174072 },
          //   { longitude: 114.549121856689, latitude: 22.5622701644897 },
          //   { longitude: 114.550108909607, latitude: 22.5604248046875 },
          //   { longitude: 114.55135345459, latitude: 22.5587940216064 },
          //   { longitude: 114.552404880524, latitude: 22.5586438179016 },
          //   { longitude: 114.553134441376, latitude: 22.5592231750488 },
          //   { longitude: 114.553370475769, latitude: 22.5602960586548 },
          //   { longitude: 114.555516242981, latitude: 22.5609612464905 },
          //   { longitude: 114.556953907013, latitude: 22.5604462623596 },
          //   { longitude: 114.559807777405, latitude: 22.5584077835083 },
          //   { longitude: 114.560730457306, latitude: 22.5567126274109 },
          //   { longitude: 114.55995798111, latitude: 22.5557470321655 },
          //   { longitude: 114.559636116028, latitude: 22.5553822517395 },
          //   { longitude: 114.561910629272, latitude: 22.5531721115112 },
          //   { longitude: 114.562940597534, latitude: 22.5515627861023 },
          //   { longitude: 114.563777446747, latitude: 22.5502753257751 },
          //   { longitude: 114.565172195435, latitude: 22.548987865448 },
          //   { longitude: 114.566695690155, latitude: 22.5483870506287 },
          //   { longitude: 114.567210674286, latitude: 22.5496315956116 },
          //   { longitude: 114.568841457367, latitude: 22.5499320030212 },
          //   { longitude: 114.56978559494, latitude: 22.5487732887268 },
          //   { longitude: 114.571223258972, latitude: 22.548258304596 },
          //   { longitude: 114.57302570343, latitude: 22.5479364395141 },
          //   { longitude: 114.57515001297, latitude: 22.5477433204651 },
          //   { longitude: 114.576416015625, latitude: 22.5467562675476 },
          //   { longitude: 114.575257301331, latitude: 22.5450181961059 },
          //   { longitude: 114.573841094971, latitude: 22.5439882278442 },
          //   { longitude: 114.57079410553, latitude: 22.5426578521728 },
          //   { longitude: 114.568691253662, latitude: 22.5425291061401 },
          //   { longitude: 114.565000534058, latitude: 22.5428295135498 },
          //   { longitude: 114.563498497009, latitude: 22.5416707992554 },
          //   { longitude: 114.560022354126, latitude: 22.5402975082397 },
          //   { longitude: 114.557576179504, latitude: 22.5390529632568 },
          //   { longitude: 114.554100036621, latitude: 22.5395250320435 },
          //   { longitude: 114.549679756165, latitude: 22.5404691696167 },
          //   { longitude: 114.545559883118, latitude: 22.541069984436 },
          //   { longitude: 114.540882110596, latitude: 22.5413274765015 },
          //   { longitude: 114.536418914795, latitude: 22.5411128997803 },
          //   { longitude: 114.530925750732, latitude: 22.5411987304687 },
          //   { longitude: 114.527492523193, latitude: 22.5414133071899 },
          //   { longitude: 114.525346755981, latitude: 22.543044090271 },
          //   { longitude: 114.522128105164, latitude: 22.5449752807617 },
          //   { longitude: 114.519885778427, latitude: 22.5466114282608 },
          //   { longitude: 114.519778490067, latitude: 22.5471183657646 }
          // ];
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
              strokeColor: "#258a57AA",
              // fillColor: "#258a57AA"
              fillColor: "#22258a57"
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
          this.innerAudioContext.src = config.prefix + audioUrl;
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
        return `../../assets/map-poetry/${number}.png`;
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
      margin: 12rpx 12rpx 0 32rpx;
    }
    &-text {
      // width: 280rpx;
      flex: 1;
      display: flex;
      flex-direction: column;
      color: #101010;
      text-align: left;
      overflow: hidden;
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
  bottom: 10rpx;
  right: 20rpx;
  transform: scale(0.8);
  img {
    width: 48rpx;
    height: 48rpx;
  }
}
#map {
  height: 80vh;
}
</style>
