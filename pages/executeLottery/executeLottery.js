// pages/executeLottery/executeLottery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: "2016-09-01",
    startTime: "12:01",
    endDate: "2016-09-01",
    endTime: "12:01",
    lotteryDate: "2017-09-01",
    lotteryTime: "13:01",
    // 默认隐藏定时抽奖
    hiddenTimeLottery: true,

    searchContent: '',
    pageData: Object,
    
    iosDialogPostTimeLotterySuccessfully: false,
    androidDialogPostTimeLotterySuccessfully: false,

    iosDialogExecuteLotteryMsg: false,
    androidDialogExecuteLotteryMsg: false,
    executeLotteryMsg: "",

    warnMsg: "",

    lotteryTypeArray: ['仅评论', '评论 + 关注', '支持者模式❤️'],
    lotteryTypeValue: 0
  },

  bindLotteryTypeChange: function(e) {
    this.setData({
      lotteryTypeValue: e.detail.value
    })
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
  onLoad: function(option){
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log("executeLottery接收到从lottery页面传来的数据：" + JSON.stringify(data))
      that.setData({
        pageData: data.data
      })
    })
  },

  closeSearchThingInvalid: function(){
    this.setData({
      iosDialogExecuteLotteryMsg: false,
      androidDialogExecuteLotteryMsg: false
    })
  },

  // 关闭弹框函数
  close: function (){
    this.setData({
      iosDialogPostTimeLotterySuccessfully: false,
      androidDialogPostTimeLotterySuccessfully: false,
    });

    // 关闭弹窗之后自动跳转到my页面
    console.log("准备进入my页面..");
    wx.reLaunch({
      url: '../my/my',
      events: {
        // // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        // acceptDataFromOpenedPage: function(data) {
        //   console.log(data)
        // },
        // someEvent: function(data) {
        //   console.log(data)
        // }
      },
      fail: function(res) {
        console.log("失败到my");
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: lotteryRes.data.data})
        console.log("成功到my");
      }
    })

  },

  // 点击发起抽奖按钮
  executeLottery: function(data) {
    console.log("---点击发起抽奖按钮---" + JSON.stringify(data));

    var that = this;

    wx.getStorage({
      key: 'session',
      success (res) {
        console.log("executeLottery页面获取到本地session是：" + res.data);
        // 通过session向后端请求页面数据
        // 发起抽奖
        wx.request({
          url: 'http://localhost:8080/api/Lottery/' + that.data.pageData.bearer.id,
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded' 
          },
          data: {
            session: res.data,
            upId: that.data.pageData.bearer.uid,
            Count: data.detail.value.lotteryCount,
            PrizeNotes: data.detail.value.prizeNotes,
            LotteryType: that.data.lotteryTypeValue, // 0-仅评论；1-评论+关注；2-支持者模式
            UnlimitedStart: data.detail.value.unlimitedStartTime,
            UnlimitedEnd: data.detail.value.unlimitedEndTime,
            GETStart: data.detail.value.containsStartTime,
            LETEnd: data.detail.value.containsEndTime,
            DuplicatedUID: false, // data.detail.value.duplicatedUid; 默认flase不允许，在页面先不展示，后序有相关需求再打开
            OnlySpecified: data.detail.value.onlyContainsKeywords,
            ContentSpecified: data.detail.value.keywords,
            Start: that.data.startDate + " " + that.data.startTime,
            End: that.data.endDate + " " + that.data.endTime,
            timeLottery: !that.data.hiddenTimeLottery,
            lotteryDateAndTime: that.data.lotteryDate + " " + that.data.lotteryTime
          },
          // https://www.bilibili.com/video/BV1Dy4y177st
          // content-type: 
          success: function(lotteryRes) {
            console.log("抽奖结果 lotteryRes:" + JSON.stringify(lotteryRes));
            // console.log('成功' + res.data.data.bearer.pubTime);
            console.log("准备进入抽奖结果页面...");

            // 如果是定时抽奖 code:2
            if (lotteryRes.data.code == 2) {
              console.log("定时抽奖");
              // 弹框：成功发起定时抽奖
              that.setData({
                androidDialogPostTimeLotterySuccessfully: true,
                iosDialogPostTimeLotterySuccessfully: true
              });
              return;
            } else if (lotteryRes.data.code == 3) {
              // session过期，删除本地session，跳转到登录界面
              wx.removeStorage({
                key: 'session',
                success (res) {
                  console.log("清除本地过期session成功" + JSON.stringify(res))
                  // 将haveSession变成false
                  that.setData({
                    haveSession: false
                  });
                  // 不用弹框，用toast显示
                  that.setData({
                    warnMsg: "session不存在或已过期，请重新登录"
                  })
                  that.openWarnToast();

                  // 页面跳转
                  wx.switchTab({
                    url: '../my/my',
                    success: function(res) {
                      // 通过eventChannel向被打开页面传送数据
                      // res.eventChannel.emit('acceptDataFromOpenerPage', { data: lotteryRes.data.data})
                    },
                    fail: function(res) {
                      console.log("当前抽奖没有session，然后跳转到my页面，但是跳转失败...")
                      that.setData({
                        warnMsg: "当前抽奖没有session，然后跳转到my页面，但是跳转失败..."
                      })
                      that.openWarnToast();
                    } 
                  })
                },
                fail: function(res) {
                  console.log("删除本地session失败");
                  // 不用弹框，用toast显示
                  that.setData({
                    warnMsg: "删除本地session失败"
                  })
                  that.openWarnToast();
                }
              })

            } else if (lotteryRes.data.code == 0) {
              wx.navigateTo({
                url: '../lotteryResult/lotteryResult?id=' + that.data.pageData.bearer.id,
                events: {
                  // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                  acceptDataFromOpenedPage: function(data) {
                    console.log(data)
                  },
                  someEvent: function(data) {
                    console.log(data)
                  }
                },
                success: function(res) {
                  // 通过eventChannel向被打开页面传送数据
                  // res.eventChannel.emit('acceptDataFromOpenerPage', { data: lotteryRes.data.data})
                  console.log("executeLottery页面到lotteryResult页面成功...")
                },
                fail: function(res) {
                  console.log("发起立即抽奖成功，但是跳转到抽奖结果显示页面失败...")
                } 
              })
            } else if (lotteryRes.data.code == 1) {
              // 执行抽奖失败，有多种情况
              // 弹框显示：lotteryRes.data.msg
              console.log("弹框")
              that.setData({
                executeLotteryMsg: lotteryRes.data.msg,
                iosDialogExecuteLotteryMsg: true,
                androidDialogExecuteLotteryMsg: true,
              })
            }
          },
          fail: function(res) {
            console.log("发起抽奖失败...")
          }
        });
      },
      fail (res) {
        console.log("获取本地session失败，本地session没有，跳转到登录页面");
        wx.switchTab({
          url: '../my/my',
          
          success: function(res) {
            // 通过eventChannel向被打开页面传送数据
            // res.eventChannel.emit('acceptDataFromOpenerPage', { data: lotteryRes.data.data})
            console.log("executeLottery页面没有session，跳转到my页面成功...")
          },
          fail: function(res) {
            console.log("executeLottery页面没有session，跳转到my页面失败...")
          } 
        })
      }
    })
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


  bindStartDateChange: function (e) {
      this.setData({
          startDate: e.detail.value
      })
  },
  bindStartTimeChange: function (e) {
      this.setData({
        startTime: e.detail.value
      })
  },

  bindEndDateChange: function (e) {
    this.setData({
        endDate: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
        endTime: e.detail.value
    })
  },

  bindLotteryDateChange: function(e) {
    this.setData({
      lotteryDate: e.detail.value
    })
  },
  bindLotteryTimeChange: function(e) {
    this.setData({
      lotteryTime: e.detail.value
    })
  },
  timeLotterySwitchChange: function(e) {
    this.setData({
      hiddenTimeLottery: !e.detail.value
    })
  }


})