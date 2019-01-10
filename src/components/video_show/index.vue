<template>
  <div id="videoContent">
    <!-- <div class="sprite-test"></div> -->
    <div v-show="!showResult">
      <img class="title-img" src="../../assets/couple_title.png" />
      <!-- <div class="action-block">
        <input type="button" title="开启摄像头" value="开启摄像头" @click="getMedia()">
        <input type="button" title="关闭摄像头" value="关闭摄像头" @click="closeVideo()">
        <input type="button" title="截图" value="截图" @click="captureImg()">
      </div> -->
      <div class="video-canvas">
        <video class="video-content" width="100%" autoplay></video>
      </div>
      <div class="shadow-img">
        <img class="shadow-img__border" src="../../assets/photo_frame.png" />
      </div>
    </div>
    
    <!-- <canvas id="canvas2" height="120px"></canvas> -->
    <div v-show="showResult" class="result">
      <div class="result__block">
        <img class="result__title" src="../../assets/result_title.png"/>
        <div class="result__heart">
          <div class="result__heart__item">
            <div class="result__heart__item--avatar woman-avatar"></div>
            <div class="result__heart__item--text">女神</div>
          </div>
          <div class="result__heart__item">
            <div class="result__heart__item--avatar man-avatar"></div>
            <div class="result__heart__item--text">男神</div>
          </div>
        </div>
        <div class="result__similarity">
          <img class="result__similarity--img" src="../../assets/result_similarity.png"/>
          <span class="result__similarity--text">{{similayForm}}%</span>
        </div>
        <img class="result__defeat--img" src="../../assets/result_beat.png"/>
        <div class="result__defeat--text">{{defeatRate}}</div>
      </div>
    </div>
  </div>
</template>
<style lang="css" scoped>
  #videoContent {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  /* .sprite-test {
    width: 100px;
    height: 100px;
    background-image: url('../../assets/logo.png');
  } */
  .title-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 500;
  }
  .action-block {
    position: absolute;
    top: 20px;
    left: 45%;
    z-index: 505;
  }
  .video-canvas {
    z-index: 50;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .video-content {
    transform: rotateY(180deg);
    -webkit-transform:rotateY(180deg); /* Safari and Chrome */
    -moz-transform:rotateY(180deg);
  }
  .shadow-img {
    position: absolute;
    top: 280px;
    left: 0;
    width: 100%;
    text-align: center;
    z-index: 505;
  }
  .shadow-img .shadow-img__border {
    width: 80%;
  }
  /* .shadow-img .shadow-img__header {
    width: 65%;
    position: absolute;
        top: 10%;
    left: 18%;
  } */
  .result {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../../assets/result_background.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .result__block {
    position: absolute;
    top: 0;
    left: 370px;
    text-align: center;
    /* display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%; */
  }
  .result__title {
    margin-top: 90px;
    width: 728px;
  }
  .result__heart {
    margin-top: 60px;
    width: 670px;
    height: 498px;
    background-image: url('../../assets/result_heart.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-around;
    /* align-items: center; */
  }
  .result__heart__item {
    text-align: center;
  }
  .result__heart__item--avatar {
    margin-top: 88.5px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    border: 2px solid #fff;    
    background-repeat: no-repeat;
    background-size: auto;
  }
  .woman-avatar {
    background-image: url('../../assets/woman_default.png');
  }
  .man-avatar {
    background-image: url('../../assets/man_default.png');
  }
  .result__heart__item--text {
    margin-top: 20px;
    font-size: 20px;
    font-weight: 700;
  }
  .result__similarity {
    margin-top: 40px;
  }
  .result__similarity--img {
    width: 316px;
  }
  .result__similarity--text {
    margin-left: 18px;
    font-size: 58px;
    font-weight: 500;
    color: #E66462;
  }
  .result__defeat--img {
    margin-top: 40px;
    width: 511px;  
  }
  .result__defeat--text {
    margin-top: -70px;
    font-size: 80px;
    font-weight: 700;
    color: #E66462;
  }
</style>
<script lang="js" src="./index.js">

</script>