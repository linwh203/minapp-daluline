<template>
<div class="mainContainer">
  <div class="container" v-if="!showCountdown">
    <div class="quiz-top">
      <div class="quiz-top-mid">挑战 第{{(index+1)>stageNum?stageNum:(index+1)}}/{{stageNum}}关</div>
    </div>
    <div class="user">
      <open-data type="userAvatarUrl" class="userPic"></open-data>
      <open-data type="userNickName" class="userName"></open-data>
    </div>
    <div class="quiz-status">已连续答对 {{rightCount}}/{{stageNum}}题</div>
    <div class="quiz-title" v-if="!quizSuccess && !quizFail">{{currentQuiz.title}}</div>
    <div class="quiz-choice" v-if="!quizSuccess && !quizFail">
      <div class="quiz-choice-body" v-if="currentQuiz.answer_list.length>0">
        <div class="quiz-choice-body-item" 
            :class="[showRight == 0?'rightAnswer':'',showWrong == 0?'wrongAnswer':'']" 
            @click="chooseItem(0,currentQuiz.answer_list[0])">
          <span class="quiz-choice-body-item-icon right" v-if="showRight == 0"></span>
          <span class="quiz-choice-body-item-icon wrong" v-if="showWrong == 0"></span>
          <span class="quiz-choice-body-item-text">{{currentQuiz.answer_list[0].answer}}</span> 
        </div>
        <div class="quiz-choice-body-item" 
            :class="[showRight == 1?'rightAnswer':'',showWrong == 1?'wrongAnswer':'']" 
            @click="chooseItem(1,currentQuiz.answer_list[1])">
          <span class="quiz-choice-body-item-icon right" v-if="showRight == 1"></span>
          <span class="quiz-choice-body-item-icon wrong" v-if="showWrong == 1"></span>
          <span class="quiz-choice-body-item-text">{{currentQuiz.answer_list[1].answer}}</span> 
        </div>
        <div class="quiz-choice-body-item" 
            :class="[showRight == 2?'rightAnswer':'',showWrong == 2?'wrongAnswer':'']" 
            @click="chooseItem(2,currentQuiz.answer_list[2])">
          <span class="quiz-choice-body-item-icon right" v-if="showRight == 2"></span>
          <span class="quiz-choice-body-item-icon wrong" v-if="showWrong == 2"></span>
          <span class="quiz-choice-body-item-text">{{currentQuiz.answer_list[2].answer}} </span> 
        </div>
        <div class="quiz-choice-body-item" 
            :class="[showRight == 3?'rightAnswer':'',showWrong == 3?'wrongAnswer':'']" 
            @click="chooseItem(3,currentQuiz.answer_list[3])">
          <span class="quiz-choice-body-item-icon right" v-if="showRight == 3"></span>
          <span class="quiz-choice-body-item-icon wrong" v-if="showWrong == 3"></span>
          <span class="quiz-choice-body-item-text">{{currentQuiz.answer_list[3].answer}}</span> 
        </div>
      </div>
    </div>
    <div class="quiz-success" v-if="quizSuccess">
      <img class="resultIcon" src="https://gw.alicdn.com/tfs/TB1iq1VnMTqK1RjSZPhXXXfOFXa-328-251.png">
      <div class="quiz-result">
        <img class="coin" src="https://gw.alicdn.com/tfs/TB1fLeZnQvoK1RjSZFwXXciCFXa-43-44.png">  
        <span>+ {{bonus}}</span>
      </div> 
       <div class="result-line"></div> 
       <div class="quiz-result-btn-top" @click="bindTab('../quiz/main')">继续挑战</div>
       <div class="quiz-result-btn-btm" @click="bindTab('../my-reward/main')">查看成就</div>
    </div>
    <div class="quiz-fail" v-if="quizFail">
      <img class="resultIcon" src="https://gw.alicdn.com/tfs/TB1Lg9UnHPpK1RjSZFFXXa5PpXa-328-251.png">
      <div class="quiz-result">
        <img class="coin" src="https://gw.alicdn.com/tfs/TB1fLeZnQvoK1RjSZFwXXciCFXa-43-44.png">  
        <span>+ 0</span>
      </div>
      <div class="result-line"></div> 
      <div class="quiz-result-btn-top" @click="restart">再来一局</div>
      <button open-type="share" class="quiz-result-btn-btm">分享知识获取机会</button>
      <div class="quiz-result-tip">分享知识给微信好友群可获得1次挑战机会</div>
    </div>
    <div class="cover" v-if="showCover"></div>
    <div class="ruleLayer" v-if="ruleLayer">
      <button open-type="share" class="ruleLayer-btn"></button>
      <div class="close" @click="closeLayer"></div>
    </div>
    <div class="endLayer" v-if="endLayer">
      <div class="close" @click="closeLayer"></div>
    </div>
  </div>
  <div class="countdown" v-if="showCountdown">
    <div class="user">
      <open-data type="userAvatarUrl" class="userPic"></open-data>
      <open-data type="userNickName" class="userName"></open-data>
    </div>
    <div class="text">
      <span class="text-icon"></span>即将开始<span class="text-icon"></span>
    </div>
    <div class="count">
      {{countNumber}}
    </div>
  </div>
</div>
</template>

<script>
import { config } from "../../utils/index";
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      prefix:config.prefix,
      stageNum:6,
      count:0,
      countNumber:3,
      showCountdown:true,
      rightCount:0,
      showRight:-1,
      showWrong:-1,
      choiceIndex: -1,
      quizSuccess:false,
      quizFail:false,
      userCode: "",
      index: 0,
      wrongAnswer: false,
      showCover: false,
      ruleLayer: false,
      endLayer: false,
      currentQuiz: {
        id: null,
        title: '1.大陆河边有什么鸟',
        type: null,
        tooltip: null,
        quiz: null,
        answer_list: [{answer:'鸽子'},{answer:'鹭鸟'},{answer:'麻雀'},{answer:'丹顶鹤'}],
        right_answer: 1,
        is_right: null
      },
      questionList: [
        {
          id: 1,
          title: "",
          type: 1,
          tooltip: "",
          quiz: "",
          answer_list: ["A ", "B ", "C", "D "],
          right_answer: -1,
          is_right: false
        }
      ]
    };
  },
  computed: {
    rightAnswer(){
      return this.currentQuiz.right_answer-1
    },
    bonus(){
      if(this.checkpoint==1){
        return 100
      }
      if(this.checkpoint==2){
        return 180
      }
      if(this.checkpoint==3){
        return 260
      }
      if(this.checkpoint==4){
        return 380
      }
      if(this.checkpoint==5){
        return 460
      }
    }
  },
  methods: {
    bindTab(url) {
      wx.redirectTo({ url: url });
    },
    chooseItem(index, item) {
      this.choiceIndex = index;
      if(this.choiceIndex == this.rightAnswer){
        this.showRight = this.choiceIndex
        this.showWrong = -1
        this.index ++
        if(this.index == this.stageNum){
          this.rightCount ++
          this.quizSuccess = true
          return
        }
        setTimeout(()=>{
          this.currentQuiz = this.questionList[this.index];
          this.init()
        },800)
      } else {
        this.showRight = this.rightAnswer
        this.showWrong = this.choiceIndex
        setTimeout(()=>{
          this.quizFail = true
          this.count --
        },800)
      }
      this.requestAnswer(this.currentQuiz.id, this.choiceIndex + 1);
    },
    closeLayer() {
      this.showCover = false;
      this.ruleLayer = false;
    },
    init(){
      this.choiceIndex = -1
      this.showRight = -1
      this.rightCount ++
    },
    requestAnswer(id, answernum) {
      if (answernum > 8) return;
      wx.request({
        url: config.base + "quiz/answer", //开发者服务器接口地址",
        data: {
          lineId: config.lineId,
          id: id,
          answer: answernum
        }, //请求的参数",
        header: {
          token: this.userCode
        },
        method: "POST",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data);
        },
        fail: () => {},
        complete: () => {}
      });
    },
    getList() {
      function selectSort(arr) {
        var len = arr.length;
        for (let i = 0; i < len - 1; i++) {
          for (let j = i; j < len; j++) {
            if (arr[j].answernum < arr[i].answernum) {
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
          }
        }
        return arr;
      }
      const token = wx.getStorageSync("userCode");
      wx.request({
        url: config.base + "quiz/list", //开发者服务器接口地址",
        data: {
          lineId: config.lineId,
          token: token,
          checkpoint: this.checkpoint,
          newExtract: 0
        }, //请求的参数",
        method: "GET",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          if (res.data.res_code == 0) {
            this.questionList = res.data.data;
            if (this.questionList.length>0){
              this.questionList.forEach(item => {
                item.answer_list = selectSort(item.answer_list);
                this.currentQuiz = this.questionList[0];
              });
            }
          } else {
            wx.showToast({
              title: res.data.res_msg, 
              duration: 1000, 
              mask: true,
              success: res=>{
                
              }
            });
          }
        },
        fail: () => {},
        complete: () => {}
      });
    },
    restart() {
      if(this.count == 0) {
        this.showCover = true
        this.ruleLayer = true
        return
      }
      this.quizFail = false
      this.choiceIndex = -1
      this.showRight = -1
      this.showWrong = -1
      this.rightCount = 0
      this.index = 0
      this.currentQuiz = this.questionList[0];
    },
    addCount() {
      wx.request({
        url: config.base + 'quiz/addCount', //开发者服务器接口地址",
        data: {
          LineId: config.lineId
        }, //请求的参数",
        method: 'post',
        header: {
          token: this.userCode,
        },
        dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data)
          if(res.data.res_code==0) {
            this.count = res.data.data.count
          }else {
            wx.showToast({
              title: res.data.res_msg, //提示的内容,
              icon: 'none', //图标,
              duration: 1000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          }
        }
      });
    }
  },
  onLoad(option) {
    console.log(option.checkpoint);
    this.checkpoint = option.checkpoint;
    this.count = option.count;
  },
  onShow(option) {
    this.userCode = wx.getStorageSync("userCode");
    this.getList()
    setInterval(()=>{
      if(this.countNumber > 0){
        this.countNumber-- 
      } else {
        this.showCountdown = false
        return
      } 
    },1000)
  },
  onHide() {
    this.index = 0;
    this.choiceIndex = -1;
    this.currentQuiz = {
      id: null,
      title: null,
      type: null,
      tooltip: null,
      quiz: null,
      answer_list: [],
      right_answer: null,
      is_right: null
    };
    this.wrongAnswer = false;
  },
  onUnload() {
    this.index = 0;
    this.choiceIndex = -1;
    this.currentQuiz = {
      id: null,
      title: null,
      type: null,
      tooltip: null,
      quiz: null,
      answer_list: [],
      right_answer: null,
      is_right: null
    };
    this.wrongAnswer = false;
  },
  onShareAppMessage(result) {
    let title = "青谷研习径";
    let path = "/pages/index/main";
    let imageUrl = "https://gw.alicdn.com/tfs/TB1uLyAnxjaK1RjSZKzXXXVwXXa-80-80.png";
    return {
      title,
      path,
      imageUrl,
      // desc,
      success: res => {
        console.log("success", res);
        this.closeLayer();
        this.addCount();
      },
      fail(e) {
        console.log(e);
      }
    };
  }
};
</script>

<style scoped lang="less">
.mainContainer{
  width: 100%;
  height: 100%;
}
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("https://gw.alicdn.com/tfs/TB1ASuUnMHqK1RjSZJnXXbNLpXa-640-1084.png")
    no-repeat top/100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}
.quiz-status{
  margin-top: 30rpx;
  margin-bottom: 50rpx;
  padding:5rpx 25rpx;
  border-radius: 25rpx;
  font-size: 24rpx;
  background: rgba(0, 0, 0, 0.4)
}
.quiz-title{
  font-size: 36rpx;
  padding: 0 40rpx;
  text-align: center;
}
.quiz-top {
  width: 100%;
  display: flex;
  justify-content:center;
  margin-top: 28rpx;
  color:#292770;
  &-mid {
    width: 600rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    font-size: 30rpx;
    background: url('https://gw.alicdn.com/tfs/TB1IMx.n7voK1RjSZFNXXcxMVXa-599-60.png') no-repeat top/contain;
  }
}
.quiz-choice {
  margin-top: 60rpx;
  width: 380rpx;
  &-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color:#292770;
    &-item {
      width: 100%;
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36rpx;
      background: #fff;
      border-radius: 20rpx;
      margin-bottom: 40rpx;
      position: relative;
      &-icon {
        width: 35rpx;
        height: 23rpx;
        display: block;
        position: absolute;
        left: 30rpx;
        top: 30rpx;
      }
      &-icon.right{
        background: url("https://gw.alicdn.com/tfs/TB1_2ORnRLoK1RjSZFuXXXn0XXa-36-25.png") no-repeat top/cover;
      }
      &-icon.wrong{
        top: 24rpx;
        height: 34rpx;
        background: url("https://gw.alicdn.com/tfs/TB1c4eWnHrpK1RjSZTEXXcWAVXa-30-29.png") no-repeat top/cover;
      }
    }
    &-item.rightAnswer{
      background: #6998cc;
      color:#fff;
    }
    &-item.wrongAnswer{
      background: #a8368e;
      color:#fff;
    }
    &-item:nth-last-of-type(1) {
      border-bottom: none;
    }
  }
}
.quiz-success,.quiz-fail{
  display: flex;flex-direction: column;align-items: center;
}
.resultIcon{
  width: 328rpx;
  height: 251rpx;
}
.quiz-result{
  display: flex;justify-content: center;align-items: center;
  color:#fff;font-size: 40rpx;
  span{
    margin:0 12rpx;
  }
  &-tip{
    font-size: 24rpx;
  }
}
.coin{
  width: 44rpx;
  height: 44rpx;
}
.result-line{
  margin: 20rpx 0 40rpx;
  width: 600rpx;
  height: 4rpx;
  background: url('https://gw.alicdn.com/tfs/TB1IMx.n7voK1RjSZFNXXcxMVXa-599-60.png') no-repeat top/cover;
}
.quiz-result-btn-top{
  color:#292770;
  width: 380rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 36rpx;
  background: #fff;
  border-radius: 20rpx;
  margin-bottom: 40rpx;
}
.quiz-result-btn-btm{
  color:#fff;
  width: 380rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 36rpx;
  background: #ff0000;
  border-radius: 20rpx;
  margin-bottom: 40rpx;
}
.image-choice {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  border-radius: 16rpx;
  overflow: hidden;
  &-item {
    border: 1px solid #9e7044;
    position: relative;
    img {
      width: 267rpx;
      height: 100%;
    }
  }
}
.countdown{
  width: 100%;
  height: 100%;
  position: relative;
  padding:20rpx;
  background: url('https://gw.alicdn.com/tfs/TB1.nJ1nVzqK1RjSZFvXXcB7VXa-640-1008.png') no-repeat top/cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.text{
  margin-top: 50rpx;
  color:#fcff04;
  font-size: 36rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &-icon{
    width: 150rpx;
    height: 34rpx;
    display: block;
    background: url('https://gw.alicdn.com/tfs/TB1VLiZnNTpK1RjSZFMXXbG_VXa-96-21.png') no-repeat top/cover;
    margin: 0 20rpx 0 0;
  }
  &-icon:nth-of-type(2){
    margin: 0 0 0 20rpx;
    transform:rotate(180deg)
  }
}
.count{
  margin-top: 80rpx;
  width: 320rpx;
  height: 320rpx;
  line-height: 320rpx;
  text-align: center;
  color:#fff;
  font-size: 180rpx;
  background: url('https://gw.alicdn.com/tfs/TB1L2OWnQvoK1RjSZPfXXXPKFXa-292-292.png') no-repeat top/cover;
}
.user{
  margin-top: 44rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.userPic{
  width: 146rpx;
  height: 146rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid #fff;
  margin-bottom: 10rpx;
}
.userName{
  color:#fff;
  font-size: 30rpx;
}
.close{
  width: 70rpx;
  height: 142rpx;
  background: url('https://gw.alicdn.com/tfs/TB14yqPnNTpK1RjSZFKXXa2wXXa-60-132.png') no-repeat top/cover;
  position: absolute;
  right: 0;top: -130rpx;
  z-index: 81;
}
.cover{
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0,0,0,.5);
  z-index:80;
  top: 0;
  left: 0;
}
.ruleLayer{
  width: 500rpx;
  height: 760rpx;
  position: fixed;
  z-index:81;
  top: 20%;
  left: 0;right: 0;margin:auto;
  background: url('https://gw.alicdn.com/tfs/TB1RLqUnFzqK1RjSZFvXXcB7VXa-460-700.png') no-repeat top/cover;
  &-btn{
    width: 340rpx;
    height: 80rpx;
    position: absolute;
    bottom: 100rpx;
    left: 0;right: 0;margin: auto;
    background: url('https://gw.alicdn.com/tfs/TB1Rn9UnHvpK1RjSZPiXXbmwXXa-340-80.png') no-repeat top/cover;
  }
}
.endLayer{
  width: 500rpx;
  height: 760rpx;
  position: fixed;
  z-index:81;
  top: 20%;
  left: 0;right: 0;margin:auto;
  background: url('https://gw.alicdn.com/tfs/TB1tIq0nQvoK1RjSZFDXXXY3pXa-460-700.png') no-repeat top/cover;
}
</style>
