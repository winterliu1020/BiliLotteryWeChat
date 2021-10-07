// pages/lottery/lottery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      inputValue: '',
      iosDialogSearchThingInvalid: false,
      androidDialogSearchThingInvalid: false,
  },

  getInputValue: function(e) {
      console.log(e.value);
      this.setData({
        inputValue: e.detail.value
      });
  },

  entranceLottery: function() {
    var config = (wx.getStorageSync('config'))
    console.log("点击1");
    // 开始请求该条patternId对应的数据
    var that = this;
    // 将id传给后端查询该条视频的数据并显示
    wx.request({
      url: config.bearer_url,
      // url: "127.0.0.1:8080/api/bearer",
      // url: "https://bililottery.liuwentao.top/api/bearer",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      data: {
        pattern: that.data.inputValue
      },
      // https://www.bilibili.com/video/BV1Dy4y177st
      // content-type: 
      success: function(res) {
        console.log("res:" + JSON.stringify(res));
        if (res.data.code == 0) {
          console.log('成功' + res.data.data.bearer.pubTime);
          // 跳转到executeLottery页面，并把bear数据传过去
          var lotteryRes = res;
          wx.navigateTo({
            url: '../executeLottery/executeLottery',
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
              res.eventChannel.emit('acceptDataFromOpenerPage', { data: lotteryRes.data.data})
            },
            fail: function(res) {
              console.log("跳转到抽奖结果显示页面失败...")
            } 
          })

        } else if (res.data.code == 1) {
          console.log("发起的patternId无效")
          // 显示弹框
          that.setData({
            iosDialogSearchThingInvalid: true,
            androidDialogSearchThingInvalid: true
          })
        }
      },
      fail: (res) => {
        console.log("发起api/bearer请求失败..." + JSON.stringify(res))
      }
    })
  },

  // 关闭弹框函数
  close: function () {
    this.setData({
      iosDialogSearchThingInvalid: false,
      androidDialogSearchThingInvalid: false,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})