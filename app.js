var host = "https://bililottery.liuwentao.top/"
// var host = "http://127.0.0.1:8080/"
var config = {
  host,
  bearer_url: host + "api/bearer/",
  Lottery_url: host + "api/Lottery/",
  getLotteryResult_url: host + "api/getLotteryResult/",
  getAllLottery_url: host + "api/getAllLottery/",
  login: host + "login/"
}
// app.js
App({
  
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.setStorageSync('config', config)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
