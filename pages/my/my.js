// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 本地是否有session
    haveSession: false,
    lotteryHaveBeenDrawn: Object,
    lotteryNotDrawYet: Object,

    userInfo: {},
    haveUserInfo: false,
    canIUseGetUserProfile: false,

    toast: false,
    warnToast: false,
    textMoreToast: false,
    textToast: false,
    loading: false,
    hideToast: false,
    hideWarnToast: false,
    hideTextMoreToast: false,
    hideTextToast: false,
    hideLoading: false,

    warnMsg: ""
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
  

  getLotteryResult: function(event) {
    console.log("点击：" + JSON.stringify(event))
    var that = this;
    wx.navigateTo({
      url: '../lotteryResult/lotteryResult?id=' + event.currentTarget.id,
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
        console.log("my页面跳转到lotteryResult成功" + JSON.stringify(res))
      },
      fail: function(res) {
        console.log("跳转到抽奖结果显示页面失败...")
        that.setData({
          warnMsg: "跳转到抽奖结果显示页面失败"
        })
        that.openWarnToast();
      } 
    })
  },

  myLogin: function(userInfo) {
    var config = (wx.getStorageSync('config'))
    var that = this;
    wx.login({
      success: function(res) {
        console.log(res);
        if (res.code) {
          //发起网络请求
          console.log("send request..." + res.code);
          var sendData;
          if (!!userInfo) {
            // userInfo有内容
            sendData = {code: res.code, avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName};
          } else {
            sendData = {
              code: res.code
            }
          }

          wx.request({
            url: config.login,
            method: "POST",
            data: sendData,
            
            header: {
              // content-type:"application/json charset=utf-8",
              // 微信默认以json格式发送，如果你是表单提交得加下面这行
              // 'content-type': 'application/x-www-form-urlencoded' 
            },
            
            success (res) {
              if (res.data.code == 0) {
                console.log('登录成功，跳转到my界面，初始化my界面数据...');
                console.log("后端返回的session：" + res.data.data);
                wx.setStorage({
                  key:"session",
                  data:res.data.data
                })
                that.onLoad();
                console.log("重新执行onLoad...")
              }
            },
            fail: (res) =>{
              console.log("向后端发起请求登录失败....")
              that.setData({
                warnMsg: "向后端发起请求登录失败"
              })
              that.openWarnToast();
            }
          });
        } else {
          console.log('调用wx.login()接口失败！' + res.errMsg)
          that.setData({
            warnMsg: "调用wx.login()接口失败！"
          })
          that.openWarnToast();
        }
      }
    });
  },

  login: function () {
    console.log("判断本地是否存有用户头像昵称...");
    var that = this;
    var userInfo;
    wx.getStorage({
      key: 'userInfo',
      success (res) {
        console.log("获取到本地userInfo是：" + res.data);
        userInfo = res.data;
        that.myLogin(userInfo);
      },
      fail (res) {
        console.log("本地不存在userInfo，向用户授权申请...");
        wx.getUserProfile({
          desc: '获取头像和昵称', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log("申请得到userInfo：" + res);
            userInfo = res.userInfo;
            that.setData({
              userInfo: res.userInfo,
            });
            // 把头像和昵称保存到本地
            wx.setStorage({
              key:"userInfo",
              data:userInfo
            });
            that.myLogin(userInfo);
          },
          fail (res) {
            console.log("获取用户头像昵称失败...")
            that.setData({
              warnMsg: "获取用户头像昵称失败"
            })
            that.openWarnToast();
            that.myLogin(userInfo);
          }
        })
      },
      complete(res) {
        console.log("都要执行wx.login");
      }
    })
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("sb..." + JSON.stringify(res))
        this.setData({
          userInfo: res.userInfo,
          haveUserInfo: true
        })
        wx.setStorage({
          key:"userInfo",
          data:res.userInfo
        })
      }, 
      fail: function(res) {
        console.log("用户数据授权失败" + JSON.stringify(res));
        that.setData({
          warnMsg: "用户数据授权失败，请同步账号昵称数据"
        })
        that.openWarnToast();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var config = (wx.getStorageSync('config'))
    console.log("my页面：成功进入" + JSON.stringify(options));
    var that = this;
    
    if (wx.getUserProfile) {
      console.log("sb.....")
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    wx.getStorage({
      key: 'userInfo',
      success (res) {
        console.log("能够拿到本地userInfo是：" + res.data + "  显示头像和昵称" + JSON.stringify(res));
        that.setData({
          userInfo: res.data,
          haveUserInfo: true
        })
      },
      fail (res) {
        console.log("本地userInfo不存在");
        // 显示同步账号昵称 按钮
        that.setData({
          haveUserInfo: false
        }),
        that.setData({
          warnMsg: "本地用户数据不存在，请同步账号昵称数据"
        })
        that.openWarnToast();
      }
    })

    
    // 一进入到my页面判断本地是否有session，没有就显示初始页面，有就拿着session向服务器端发请求
    wx.getStorage({
      key: 'session',
      success (res) {
        console.log("获取到本地session是：" + res.data);
        that.setData({
          haveSession: true
        })
        // 通过session向后端请求页面数据
        wx.request({
          url: config.getAllLottery_url,
          method: "POST",
          data: {
            session: res.data,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' 
          },
          
          success: function(res) {
            console.log("请求my页面返回结果：" + JSON.stringify(res));
            if (res.data.code == 0) {
              console.log('获取my页面数据成功，开始初始化my界面数据，页面数据如下：' + res.data.data);
              console.log(JSON.stringify(res))
              that.setData({
                lotteryHaveBeenDrawn: res.data.data.lotteryHaveBeenDrawn,
                lotteryNotDrawYet: res.data.data.lotteryNotDrawYet
              })
            } else if (res.data.code == 4){
              console.log("4表示：session不存在或已过期");
              // 不用弹框，用toast显示
              that.setData({
                warnMsg: "session不存在或已过期，请重新登录"
              })
              that.openWarnToast();

              // 需要将本地session清除
              wx.removeStorage({
                key: 'session',
                success (res) {
                  console.log("清除本地过期session成功" + JSON.stringify(res))
                  // 将haveSession变成false
                  that.setData({
                    haveSession: false
                  });
                  // 刷新页面
                  that.onLoad()
                }
              })
            } else {
              console.log('获取my页面数据失败，返回结果如下：' + JSON.stringify(res));
              that.setData({
                warnMsg: "页面数据加载失败，请重试"
              })
              that.openWarnToast();
            }
          },
          fail: function(res) {
            console.log("请求my页面的网络请求失败：" + JSON.stringify(res));
            that.setData({
              warnMsg: "当前页面数据的网络请求失败，请重试"
            })
            that.openWarnToast();
          }
        });

      },
      fail (res) {
        console.log("获取本地session失败");
        that.setData({
          warnMsg: "获取本地session失败，请重新登录"
        })
        that.openWarnToast();
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
    // 只要显示这个页面，如果有本地存储中有session，那个登录按钮隐藏，否则显示登录按钮
    console.log("my页面onShow函数执行");
    // this.onPullDownRefresh()
    var that = this;
    // 一进入到my页面判断本地是否有key，没有就显示初始页面，有就拿着session向服务器端发请求
    wx.getStorage({
      key: 'session',
      success (res) {
        console.log("能够拿到本地session是：" + res.data + "  所以不显示登录按钮");
        that.setData({
          haveSession: true
        })
      },
      fail (res) {
        console.log("本地session不存在");
        that.setData({
          warnMsg: "获取本地session失败，请登录"
        })
        that.openWarnToast();
      }
    })

    
  },

  syncUserInfo: function(res) {
    console.log("再次向用户请求头像昵称数据，并向后端同步")
    var that = this;
    wx.getUserProfile({
      desc: '获取头像和昵称', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("申请得到userInfo：" + res);
        // userInfo = res.userInfo;
        that.setData({
          userInfo: res.userInfo,
          haveUserInfo: true
        });
        // 把头像和昵称保存到本地
        wx.setStorage({
          key: "userInfo",
          data: res.userInfo
        })
      },
      fail (res) {
        console.log("获取用户头像昵称失败..." + JSON.stringify(res))
        that.setData({
          warnMsg: "获取用户头像昵称失败"
        })
        that.openWarnToast();
      }
    })
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
    // 用户下拉，需要重新请求当前页面数据
    // 判断本地是否有session，没有就显示初始页面，有就拿着session向服务器端发请求
    console.log("下拉动作...")
    wx.showNavigationBarLoading({
      success: (res) => {
        console.log("展示下拉动画..")
      },
    })
    var config = (wx.getStorageSync('config'))
    var that = this;
    wx.getStorage({
      key: 'session',
      success (res) {
        console.log("下拉获取到本地session是：" + res.data);
        // 通过session向后端请求页面数据
        wx.request({
          url: config.getAllLottery_url,
          method: "POST",
          data: {
            session: res.data,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' 
          },
          
          success: function(res) {
            if (res.data.code == 0) {
              console.log('下拉获取my页面数据成功，开始初始化my界面数据，页面数据如下：' + res.data.data);
              console.log(JSON.stringify(res))
              that.setData({
                lotteryHaveBeenDrawn: res.data.data.lotteryHaveBeenDrawn,
                lotteryNotDrawYet: res.data.data.lotteryNotDrawYet
              })
              wx.hideNavigationBarLoading({
                success: (res) => {
                  console.log("隐藏下拉动画...")
                },
              })
              wx.stopPullDownRefresh()
            }
          }
        });

      },
      fail (res) {
        console.log("下拉获取本地session失败，请先登录");
      }
    })

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