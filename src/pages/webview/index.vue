<template>
  <div class="container">
    <div class="webview">
      <web-view :src="webviewUrl"/>
    </div>
  </div>
</template>

<script>
import { config } from "../../utils/index";

export default {
  data() {
    return {
      webviewUrl: ""
    };
  },

  components: {},

  methods: {},

  created() {},
  mounted() {},
  onLoad(option) {
    let webviewUrl = (this.webviewUrl = decodeURIComponent(option.webviewUrl));
    console.log(webviewUrl);
  },
  onShow() {}
};
</script>

<style scoped lang="less">
.container {
  position: relative;
}
</style>
