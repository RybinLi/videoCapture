/*
 * @Author: Rybin 
 * @Date: 2019-01-10 15:32:30 
 * @Last Modified by: Rybin
 * @Last Modified time: 2019-01-14 09:18:54
 * @description: {} 
 */
// 正则表达替换2位小数： (0\.\d{2}$)  => "$1"
// 正则表达2位小数去掉： (\.\d+)%  => %
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
      // 截取缩小比例
      scaleRate: 0.6,
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

    // const key_down = this.throttle((e) => {
    //   let keyNum = window.event ? e.keyCode : e.which;
    //   if (keyNum === 32) {
    //     console.log('key down');
    //     // 如果还在等待请求中，则无操作
    //     if (that.isRequesting) return;       
    //     if (that.showResult) {
    //       // 如果是显示结果状态，则返回视频页面
    //       that.openVideo();
    //     } else {
    //       // 如果不是显示结果状态，则截取画面上传
    //       that.captureImg();
    //       // that.showResult = true;
    //     }
    //   }
    // }, 1000);

    // 节流防抖
    function throttle(fn, interval) {
      // last为上一次触发回调的时间
      let last = 0;
      let count = 0;
      // 将throttle处理结果当作函数返回
      return (...args) => {
        // 保留调用时的this上下文
        let context = this;
        // 保留调用时传入的参数
        // let args = arguments
        // 记录本次触发回调的时间
        let now = Date.now();
        count++;
        console.log('count 1: ', count);
        // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
        if (now - last >= interval) {
          // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
          last = now;
          console.log('count 2: ', count);
          fn.apply(context, args);
        }
      }
    }

    // NOTE: 加了防抖的 监听空格键，切换结果页面和抓取页面
    document.addEventListener('keydown', throttle(e => {
      let keyNum = window.event ? e.keyCode : e.which;
      if (keyNum === 32) {
        console.log('key down');
        // 如果还在等待请求中，则无操作
        if (that.isRequesting) return;

        if (that.showResult) {
          // 如果是显示结果状态，则返回视频页面
          that.openVideo();
        } else {
          // 如果不是显示结果状态，则截取画面上传
          that.captureImg();
          // that.showResult = true;
        }
      }
    }, 1000));

    // NOTE: 没加防抖的
    // document.onkeydown = (e) => {
    //   let keyNum = window.event ? e.keyCode : e.which;
    //   if (keyNum === 32) {
    //     console.log('key down');
    //     // 如果还在等待请求中，则无操作
    //     if (that.isRequesting) return;
       
    //     if (that.showResult) {
    //       // 如果是显示结果状态，则返回视频页面
    //       that.openVideo();
    //     } else {
    //       // 如果不是显示结果状态，则截取画面上传
    //       that.captureImg();
    //       // that.showResult = true;
    //     }
    //   }
    // }
  },
  computed: {
    similayForm: function() {
      let resNum = parseFloat(this.similarity) + 0.1;
      resNum = resNum * 100;
      resNum = resNum > 100 ? 100 : resNum;
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
          video: {
            width: { min: 640, ideal: 1920, max: 1920 },
            height: { min: 480, ideal: 1080, max: 1080 }
          },
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

    // 重新打开拍摄页面
    openVideo: function() {
      console.log('openVideo');
      this.video.play();
      this.showResult = false;
      // setTimeout(() => {
      //   this.captureImg();
      // }, 100);      
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
      let s1 = data.length1 / 300 * this.scaleRate;
      let s2 = data.length2 / 300 * this.scaleRate;

      let offset_x1 = data.x1 * s1 - (300 - data.length1 * s1) / 2;
      let offset_y1 = data.y1 * s1 - (300 - data.length1 * s1) / 2;
      let offset_x2 = data.x2 * s2 - (300 - data.length2 * s2) / 2;
      let offset_y2 = data.y2 * s2 - (300 - data.length2 * s2) / 2;

      offset_x1 = offset_x1 < 0 ? 0 : offset_x1;
      offset_y1 = offset_y1 < 0 ? 0 : offset_y1;
      offset_x2 = offset_x2 < 0 ? 0 : offset_x2;
      offset_y2 = offset_y2 < 0 ? 0 : offset_y2;

      let scaleLength1 = 1920 * s1;
      let scaleLength2 = 1920 * s2;

      this.womanAvatar[0].style.backgroundSize = `${scaleLength1}px auto`;
      this.womanAvatar[0].style.backgroundImage = `url(${url})`;
      this.womanAvatar[0].style.backgroundPosition = `-${offset_x1}px -${offset_y1}px`;
      this.manAvatar[0].style.backgroundSize = `${scaleLength2}px auto`;
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
      console.log('captureImg');
      let captureCanvas = document.createElement('canvas');
      captureCanvas.width = this.video.videoWidth;
      captureCanvas.height = this.video.videoHeight;
      captureCanvas.getContext('2d').drawImage(this.video, 0, 0, captureCanvas.width, captureCanvas.height);
      console.log(captureCanvas.width, captureCanvas.height);
      // let view = document.getElementById('videoContent');
      // console.log(view.clientWidth, view.clientHeight);

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
                // NOTE: 现在不做任何操作 这里返回的结果不符合要求重新截图。
                // that.captureImg();
                return that.fail(resJson.data);
              }              
            } else {
              // NOTE: 现在不做任何操作 失败，重新截图:
              // that.captureImg();
              return that.fail(xhr.status);
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