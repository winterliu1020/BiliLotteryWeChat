// pages/lotteryResult/lotteryResult.js
var util= require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      iosDialog1: false,
      iosDialog2: false,
      androidDialog1: false,
      androidDialog2: false,

      biliWrapper: Object,
      lotteryResult: Array,

      pageData: Object,

      // 这次抽奖的最终结果；如果抽奖名单>0，说明抽奖成功，等于0，msg会存储：还未开奖/抽奖失败原因
      msg: "",

      // 天、小时、分钟、秒数
      time: {
        day: '00',
        hour: '00',
        minute: '00',
        second: '00'
      },

      // toast警告内容
      warnMsg: "",

      waitTimes:0, //超时变量
      timeList:[], //定时器列表

      id: "", // 当前抽奖结果对应的id号

      prizeCount: 0, // 总的抽奖人数
      
      // 页面倒计时，存储setInterval返回的timer对象
      timer: Object

  },
  close: function () {
      this.setData({
          iosDialog1: false,
          iosDialog2: false,
          androidDialog1: false,
          androidDialog2: false,
      })
  },
  openIOS1: function() {
      this.setData({
          iosDialog1: true
      });
  },
  openIOS2: function() {
      this.setData({
          iosDialog2: true
      });
  },
  openAndroid1: function() {
      this.setData({
          androidDialog1: true
      });
  },
  openAndroid2: function() {
      this.setData({
          androidDialog2: true
      });
  },
  openToast: function() {
      this.setData({
          toast: true
      });
      setTimeout(() => {
          this.setData({
              hideToast: true
          });
          setTimeout(() => {
              this.setData({
                  toast: false,
                  hideToast: false,
              });
          }, 300);
      }, 3000);
  },
  openWarnToast: function() {
      this.setData({
          warnToast: true
      });
      setTimeout(() => {
          this.setData({
              hidewarnToast: true
          });
          setTimeout(() => {
              this.setData({
                  warnToast: false,
                  hidewarnToast: false,
              });
          }, 300);
      }, 3000);
  },
  openTextMoreToast: function() {
      this.setData({
          textMoreToast: true
      });
      setTimeout(() => {
          this.setData({
              hideTextMoreToast: true
          });
          setTimeout(() => {
              this.setData({
                  textMoreToast: false,
                  hideTextMoreToast: false,
              });
          }, 300);
      }, 3000);
  },
  openTextToast: function() {
      this.setData({
          textToast: true
      });
      setTimeout(() => {
          this.setData({
              hideTextToast: true
          });
          setTimeout(() => {
              this.setData({
                  textToast: false,
                  hideTextToast: false,
              });
          }, 300);
      }, 3000);
  },
  openLoading: function() {
      this.setData({
          loading: true
      });
      setTimeout(() => {
          this.setData({
              hideLoading: true
          });
          setTimeout(() => {
              this.setData({
                  loading: false,
                  hideLoading: false,
              });
          }, 300);
      }, 3000);
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("这个页面展示的中奖结果对应是：" + options.id);
    var config = (wx.getStorageSync('config'))
    that.setData({
      id: options.id
    })
    wx.getStorage({
        key: 'session',
        success (res) {
          console.log("lotteryResult获取到本地session是：" + res.data);
          // 通过session向后端请求页面数据
          wx.request({
            url: config.getLotteryResult_url,
            method: "POST",
            data: {
              session: res.data,
              id: options.id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' 
            },
            
            success: function(res) {
              if (res.data.code == 0) {
                console.log('获取lotteryResult页面数据成功，开始初始化lotteryResult界面数据，页面数据如下：' + res.data.data);
                console.log(JSON.stringify(res))
                that.setData({
                  pageData: res.data.data,
                  prizeCount: res.data.count,
                  msg: res.data.msg
                })
                // 执行倒计时
                var nowTimeMilliSecond = new Date().getTime();
                if (nowTimeMilliSecond < res.data.data.postLottery.lotteryDateAndTime) {
                  that.countDown(res.data.data.postLottery.lotteryDateAndTime);
                  console.log("开始倒计时..." + res.data.data.postLottery.lotteryDateAndTime)
                  
                } else {
                  console.log("已经开奖，不用倒计时...")
                }
              } else if (res.data.code == 3){
                console.log("本地session过期，请重新登录")
                that.setData({
                  warnMsg: "用户数据授权失败，请同步账号昵称数据"
                })
                that.openWarnToast();
                // 将本地过期session删除
                wx.removeStorage({
                  key: 'session',
                  success (res) {
                    console.log("清除本地过期session成功" + JSON.stringify(res))
                    // 将haveSession变成false
                    that.setData({
                      haveSession: false
                    });
                    // 跳转到my页面
                    wx.switchTab({
                      url: '../my/my',
                      events: {
                      },
                      success: function(res) {
                        // 通过eventChannel向被打开页面传送数据
                        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: lotteryRes.data.data})
                        console.log("lotteryResult页面删除本地过期session，并成功跳转到my页面..." + JSON.stringify(res))
                      },
                      fail: function(res) {
                        console.log("lotteryResult页面跳转到my页面失败..." + JSON.stringify(res))
                      } 
                    })
                    
                  }
                })

              } else {
                console.log("获取lotteryResult结果失败" + JSON.stringify(res))
                that.setData({
                  warnMsg: "获取lotteryResult结果失败"
                })
                that.openWarnToast();
              }
            }
          });
        },
        fail (res) {
          console.log("获取本地session失败");
          that.setData({
            haveSession: false
          })
          that.setData({
            warnMsg: "获取本地session失败，请刷新重试"
          })
          that.openWarnToast();
        }
    })
    // const eventChannel = this.getOpenerEventChannel()
    // // 写会一些数据到上一个页面
    // eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
    // eventChannel.emit('someEvent', {data: 'test'});
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('acceptDataFromOpenerPage', function(data) {
    //   console.log("接收到的数据如下：");
    //   console.log(data);
    //   that.setData({
    //     lotteryResult: data.data
    //   });
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面卸载，需要把timer倒计时对象删掉
    clearInterval(this.data.timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  dateTransform: function (seconds) {
    let [day, hour, minute, second] = [0, 0, 0, 0] // 初始化
    if (seconds > 0) {
      day = Math.floor(seconds / (60 * 60 * 24))
      hour = Math.floor(seconds / (60 * 60)) - day * 24
      minute = Math.floor(seconds / 60) - day * 24 * 60 - hour * 60
      second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60
    }
    // 小于10的，在前面加0
    day = day < 10 ? '0' + day : day
    hour = hour < 10 ? '0' + hour : hour
    minute = minute < 10 ? '0' + minute : minute
    second = second < 10 ? '0' + second : second
    var obj = {
      day: day,
      hour: hour,
      minute: minute,
      second: second
    }
    this.setData({
      time: obj
    })
    console.log("当前倒计时：" + JSON.stringify(obj));
    // return day + '天' + hour + '小时' + minute + '分' + second + '秒'
  },

  countDown: function(endTimeMilliSecond) { // 传毫秒数
    
    console.log("传来的毫秒数：" + endTimeMilliSecond)
    var endTimeSeconds = endTimeMilliSecond / 1000; // 倒计时总秒数
    
    var currentTimeSecond = (new Date().getTime() / 1000) // 当前时间戳
    var gapSeconds = endTimeSeconds - currentTimeSecond; // seconds：还剩余的秒数

    console.log("剩余秒数：" + gapSeconds)
  
    // 如果目标时间小于等于当前时间，不需要继续进行了
    if (gapSeconds <= 0) return
  
    // 定时器
    let timer = setInterval(() => {
      gapSeconds--
      this.dateTransform(gapSeconds)
  
      if (gapSeconds <= 0) {
        clearInterval(timer)
        console.log('倒计时结束，清除定时器，避免内存溢出')
        // 关闭当前页面，延迟一秒重新跳转到这个页面
        // setTimeout(function(){ console.log("延时1秒，等后端抽奖完成再请求") }, 1000);
        // 采用轮询机制向后端请求数据，直到拿到数据，或者请求次数超过10次结束
        this.startWaiting()
      } 
    }, 1000)

    // 将timer赋值给data，当页面unload时，需要将这个timer删掉
    this.setData({
      timer: timer
    })
  },

  myUpdate() {
      var config = (wx.getStorageSync('config'))
      var that = this;
      var maxWait = 100 //超时次数
      var newWait = this.data.waitTimes + 1 //执行的次数
      if (newWait >= maxWait) { //超时了
          console.log(util.formatTime(new Date()), '向后端轮询达到最大次数')
          that.setData({
            warnMsg: "后台服务器仍在为您抽奖，请稍后在「我的」中查看抽奖结果"
          })
          that.openWarnToast();
      } else { //未超时
          var time = setTimeout(this.myUpdate, 500)
          this.data.timeList.push(time) // 存储定时器
          console.log(util.formatTime(new Date()), '第', newWait, '次轮询中...')
          // 向后端发请求，看是否拿到数据
          wx.getStorage({
            key: 'session',
            success (res) {
              console.log("lotteryResult获取到本地session是：" + res.data);
              // 通过session向后端请求页面数据
              wx.request({
                url: config.getLotteryResult_url,
                method: "POST",
                data: {
                  session: res.data,
                  id: that.data.id
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' 
                },
                
                success: function(res) {
                  if (res.data.code == 0 && res.data.data.lotteryResultAndPrizeNameList.length > 0) {
                    // 说明拿到了抽奖结果
                    console.log('轮询获取lotteryResult页面数据成功，开始初始化lotteryResult界面数据，页面数据如下：');
                    console.log(JSON.stringify(res))
                    that.setData({
                      pageData: res.data.data,
                      prizeCount: res.data.count,
                      msg: res.data.msg
                    })
                    console.log(util.formatTime(new Date()), '拿到了所需数据！轮询停止')
                    that.stopWaiting()
                  } else if (res.data.code == 3){
                    console.log("本地session过期，请重新登录")
                    that.stopWaiting() // 结束轮询
                    that.setData({
                      warnMsg: "用户数据授权失败，请同步账号昵称数据"
                    })
                    that.openWarnToast();
                    // 将本地过期session删除
                    wx.removeStorage({
                      key: 'session',
                      success (res) {
                        console.log("清除本地过期session成功" + JSON.stringify(res))
                        // 将haveSession变成false
                        that.setData({
                          haveSession: false
                        });
                        // 跳转到my页面
                        wx.switchTab({
                          url: '../my/my',
                          events: {
                          },
                          success: function(res) {
                            // 通过eventChannel向被打开页面传送数据
                            // res.eventChannel.emit('acceptDataFromOpenerPage', { data: lotteryRes.data.data})
                            console.log("lotteryResult页面删除本地过期session，并成功跳转到my页面..." + JSON.stringify(res))
                          },
                          fail: function(res) {
                            console.log("lotteryResult页面跳转到my页面失败..." + JSON.stringify(res))
                          } 
                        })
                      },
                      fail: function(res) {
                        console.log("移除本地session失败")
                      }
                    })
                  } else if (res.data.code == 1) {
                    // 后端返回错误，结束轮询
                    console.log(util.formatTime(new Date()), ' 后端返回错误！轮询停止')
                    that.stopWaiting()
                    that.setData({
                      warnMsg: res.data.msg
                    })
                    that.openWarnToast();
                  } else { // 后端没有返回数据，或者查到的抽奖人数为0，继续轮询
                    console.log("获取lotteryResult结果失败，继续轮询" + JSON.stringify(res))
                    that.setData({
                        waitTimes: newWait
                    })
                  }
                },
                fail: function(res) {
                  console.log("轮询达到微信网络请求时间上限，请求超时，请稍后在「我的」中查看抽奖结果");
                  that.setData({
                    warnMsg: "请求超时，请稍后在「我的」中查看抽奖结果"
                  })
                  that.openWarnToast();
                }
              });
            },
            fail (res) {
              console.log("获取本地session失败");
              that.setData({
                haveSession: false
              })
              that.setData({
                warnMsg: "获取本地session失败，请刷新重试"
              })
              that.openWarnToast();
            }
          });
      }
  },
  startWaiting() {
    wx.showLoading({
      title: '正在抽奖，请稍后...',
    });
      setTimeout(this.myUpdate, 500) // 500毫秒执行一次，超时次数设定为100次
  },
  stopWaiting() {
    wx.hideLoading();
    for (var i = 0; i < this.data.timeList.length; i++) {
        clearTimeout(this.data.timeList[i]); //清除了所有定时器
    }
  },
})