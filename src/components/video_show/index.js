import DEFEAT_RESULTS from './defeat.json';
export default {
  name: 'VideoShow',
  data () {
    return {
      // exArray: [],
      // 视频元素
      video: null, 
      // 用于控制视频流，目前没用到
      mediaStreamTrack: null, 
      // 切换结果面
      showResult: false,    
      // 男女神的元素
      manAvatar: null,
      womanAvatar: null,
      // 是否真正发送请求
      isRequesting: false,
      // 相似度
      similarity: 0,
      // 打败比例
      defeatRate: '0.00%',
    }
  },
  created() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    // URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
  },
  mounted() {
    this.video = document.querySelector('video');
    this.womanAvatar = document.getElementsByClassName('woman-avatar');
    this.manAvatar = document.getElementsByClassName('man-avatar');
    const that = this;
    // 延迟1s自动启动摄像头
    setTimeout(() => {
      this.getMedia();
    }, 1000);

    // 监听空格键，切换结果页面和抓取页面
    document.onkeydown = (e) => {
      let keyNum = window.event ? e.keyCode : e.which;
      if (keyNum === 32) {
        // console.log('keydown 32');
        if (that.showResult && !that.isRequesting) {
          console.log('change showResult');
          this.openVideo();
        }
      }
    }
  },
  computed: {
    similayForm: function() {
      let resNum = parseFloat(this.similarity);
      resNum = resNum * 100;
      return resNum.toFixed(0);
    }
  },
  methods: {  

    // 打开摄像头
    getMedia: function() {
      const that = this;
      // 使用新方法打开摄像头
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        }).then(function (stream) {
          // console.log('new %o:', stream);         

          that.MediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[1];

          that.video.src = (window.URL || window.webkitURL).createObjectURL(stream);
          // that.video.play();
          that.openVideo();
        }).catch(function (err) {
          console.log(err);
        })
      }
      // 使用旧方法打开摄像头
      else if (navigator.getMedia) {
        navigator.getMedia({
          video: true
        }, function (stream) {
          // console.log('old %o:', stream);
          that.MediaStreamTrack = stream.getTracks()[0];

          that.video.src = (window.URL || window.webkitURL).createObjectURL(stream);
          // that.video.play();
          that.openVideo();
        }, function (err) {
          console.log(err);
        });
      }

    },

    // 重新打开摄像头, 并截图
    openVideo: function() {
      console.log('openVideo');
      this.video.play();
      this.showResult = false;
      setTimeout(() => {
        this.captureImg();
      }, 100);      
    },
    // 暂停播放，但是还没有找到关闭摄像头的代码
    closeVideo: function() {
      console.log('closeVideo');
      this.video.pause();
      // this.mediaStreamTrack && this.mediaStreamTrack.stop();
    },

    // 匹配出正确的结果渲染匹配结果 
    success: function(data, url) {
      console.log('success %o', data);
      this.similarity = data.similar.toFixed(2);
      this.defeatRate = DEFEAT_RESULTS[this.similarity];
      console.log(`defeatRate: ${this.defeatRate}`);
      let offset_x1 = data.x1 - (220 - data.length1) / 2;
      let offset_y1 = data.y1 - (220 - data.length1) / 2;
      let offset_x2 = data.x2 - (220 - data.length2) / 2;
      let offset_y2 = data.y2 - (220 - data.length2) / 2;

      offset_x1 = offset_x1 < 0 ? 0 : offset_x1;
      offset_y1 = offset_y1 < 0 ? 0 : offset_y1;
      offset_x2 = offset_x2 < 0 ? 0 : offset_x2;
      offset_y2 = offset_y2 < 0 ? 0 : offset_y2;

      this.womanAvatar[0].style.backgroundImage = `url(${url})`;
      this.womanAvatar[0].style.backgroundPosition = `-${offset_x1}px -${offset_y1}px`;
      this.manAvatar[0].style.backgroundImage = `url(${url})`;
      this.manAvatar[0].style.backgroundPosition = `-${offset_x2}px -${offset_y2}px`;
      // this.womanAvatar[0].style.backgroundImage = `url(${url})`;
      // this.womanAvatar[0].style.backgroundPosition = `-${data.x1}px -${data.y1}px`;
      // this.manAvatar[0].style.backgroundImage = `url(${url})`;
      // this.manAvatar[0].style.backgroundPosition = `-${data.x2}px -${data.y2}px`;

      // TODO: 待测试
      setTimeout(() => {
        (window.URL || window.webkitURL).revokeObjectURL(url);
        console.log(url);
      }, 200);
    },

    fail: function(code) {
      console.log('失败代码' + code);
    },

    // 截图并发送到服务后台
    captureImg: function () {
      // console.log('captureImg');
      let captureCanvas = document.createElement('canvas');
      captureCanvas.width = this.video.videoWidth;
      captureCanvas.height = this.video.videoHeight;
      captureCanvas.getContext('2d').drawImage(this.video, 0, 0, captureCanvas.width, captureCanvas.height);
      // console.log(captureCanvas.width, captureCanvas.height);

      const that = this;
      // 转化为二进制图片
      captureCanvas.toBlob((blob) => {

        // 通过FormData对象可以组装一组用 XMLHttpRequest发送请求的键/值对。
        let form = new FormData();
        form.append('img', blob);

        // 发送图片二进制数据
        that.isRequesting = true;

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () { 
          // 状态发生变化时，函数被回调
          if (xhr.readyState === 4) { // 成功完成
            that.isRequesting = false;
            // 判断响应结果:
            if (xhr.status === 200) {
              // 成功，通过responseText拿到响应的文本:
              let resJson = JSON.parse(xhr.responseText);
              if (resJson.code === '200') {
                let url = (window.URL || window.webkitURL).createObjectURL(blob);
                console.log(url);
                // 暂停摄像头
                that.closeVideo();
                // 显示结果
                that.showResult = true;                
                return that.success(resJson.data, url);
              } else {
                // 这里重新截图。不需要在打开摄像头了？
                that.captureImg();
              }              
            } else {
              // 失败，重新截图:
              that.captureImg();
            }           
          } else {
            // HTTP请求还在继续...
            // console.log('xhr.readyState: ' + xhr.readyState);
          }
        }
        if (process.env.NODE_ENV === 'development') {
          xhr.open('POST', '/face/compare', true);
        } else {   
          xhr.open('POST', 'http://127.0.0.1:5000/face/compare', true);
        }
        xhr.send(form);
      }, 'image/jpeg');
    }
  }    
}