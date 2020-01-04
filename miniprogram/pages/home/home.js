const app = getApp()
const host = app.globalData.requestHost
const applicationBase = app.globalData.applicationBase
const position = app.globalData.position
const mainBase = app.globalData.mainBase

Page({
  data: {
    imgBase: app.globalData.imgBase,
    todayCalories: 0,
    todaySteps: 0,
    backgroundColor: '',
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    index: 0,
    bmi: 0,
    height: 0,
    weight: 0,
    name: "",
    sex: "",
    profile: "",
    //判断小程序的API，回调，参数，组件等是否在当前版本可用
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onLoad(options) {
    console.log(app.globalData.todayCalories)
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res)
              console.log(app.globalData)
              app.globalData.userInfo = res.userInfo
              this.setData({
                PageCur: 'my',
                todayCalories: app.globalData.todayCalories,
                name: app.globalData.userInfo.nickName,
                profile: app.globalData.userInfo.avatarUrl,
                todaySteps: app.globalData.step
              })

              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    this.setData({
      PageCur: 'my',
      todayCalories:app.globalData.todayCalories,
      todaySteps:app.globalData.step
    })
    //计算BMI
    let bmi = 0;
    let height = app.globalData.userHeight / 100;
    bmi = (app.globalData.userWeight / (height * height)).toFixed(2);
    this.setData({
      bmi: bmi
    })
  },

  onShow(options){
    var that=this
    wx.request({
      url: 'https://csquare.wang/user',
      method: 'POST',
      data: {
        openId: app.globalData.openId,        //需传入用户openid
        reqParam: {
          //name: app.globalData.userInfo.nickName,
          //sex: app.globalData.userInfo.gender,
          //profile: app.globalData.userInfo.avatarUrl,
          height: app.globalData.userHeight,
          weight: app.globalData.userWeight,
          bmi: this.data.bmi,
        }
      },
      header: {
        'content-type': 'application/json'
      },
    })

    wx.request({
      url: 'https://csquare.wang/user',
      method: 'GET',
      data: {
        "openId": app.globalData.openId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        that.setData({
          //name: res.data.resData.name,
          //sex: res.data.resData.sex,
          //profile: res.data.resData.profile,
          height: res.data.resData.height,
          weight: res.data.resData.weight,
          bmi: res.data.resData.bmi.toFixed(2),
        })
      }
    })
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  bindGetUserInfo: function (e) {
    console.log(app.globalData.loginSuccess)
    console.log(app.globalData.wechatStepsAuthorizationSuccess)
    if(app.globalData.loginSuccess && app.globalData.wechatStepsAuthorizationSuccess){
      wx.showToast({
        title: '您已登录',
        icon: 'success'
      })
    }
    else{
      if (e.detail.userInfo) {
        //用户按了允许授权按钮
        var that = this;
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的信息如下：");
        console.log(e.detail.userInfo);
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: function (res) {
                  // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                  // 根据自己的需求有其他操作再补充
                  // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                  wx.login({
                    success: res => {
                      app.globalData.loginSuccess = true;
                      // 获取到用户的 code 之后：res.code
                      console.log("用户的code:" + res.code);
                      //获取用户openid 虽然我觉得传secret会被微信暴打
                      wx.request({
                        url: 'https://csquare.wang/openid',
                        data: {
                          "appid": "wxfdbdf9572f3ae678",
                          "secret": "5fecb5d7093bb4a17d7d77cb19cf37a2",
                          "js_code": res.code,
                          "grant_type": "authorization_code"
                        },
                        header: {
                          'content_type': "application/json"
                        },
                        method: "GET",
                        success(res) {
                          console.log(res.data.openid)
                          app.globalData.openId = res.data.openid
                        },
                        fail(res) {
                          console.log(res)
                        }
                      })
                    }
                  });
                }
              });
              wx.login({
                success: function () {
                  wx.getWeRunData({
                    success(res) {
                      app.globalData.wechatStepsAuthorizationSuccess = true
                      app.globalData.mycloudId = res.cloudID;
                      console.log("success:" + app.globalData.mycloudId);
                      wx.cloud.callFunction({
                        name: 'getSteps',
                        data: {
                          weRunData: wx.cloud.CloudID(app.globalData.mycloudId), // 这个 CloudID 值到云函数端会被替换
                          obj: {
                            shareInfo: wx.cloud.CloudID(app.globalData.mycloudId), // 非顶层字段的 CloudID 不会被替换，会原样字符串展示
                          }
                        }
                      }).then(res => {
                        console.log(res);
                        app.globalData.step = res.result.weRunData.data.stepInfoList[30].step;
                        console.log("步数" + app.globalData.step);
                        wx.redirectTo({
                          url: '/pages/home/home',
                        })
                      })
                    }, fail() {
                      console.log("fail");
                    }
                  })
                }, fail() {
                  console.log("失败");
                  wx.showToast({
                    title: '授权失败,请在微信中删除本小程序（清空缓存）后重新添加进入',
                    string: 'none',
                    duration: 3000
                  })
                }
              })
            } else {
              // 用户没有授权
            }
          }
        });
      } else {
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，小程序无法为您提供进一步服务，请重新授权！',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            // 用户没有授权成功，不需要改变 isHide 的值
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
    }
  },

  NavChange(e) {
    console.log(e.currentTarget.dataset.cur)
    if (e.currentTarget.dataset.cur == "analysis") {
      if(app.globalData.loginSuccess && app.globalData.wechatStepsAuthorizationSuccess){
        wx.redirectTo({
          url: '/pages/analysis/analysis',
        })
        this.setData({
          PageCur: e.currentTarget.dataset.cur
        })
      }
      else{
        wx.showToast({
          title: '请先在我的页面中授权登录后，方可体验进一步服务',
          icon: 'none',
          duration: 3000
        })
      }
    }
    else if (e.currentTarget.dataset.cur == "shot") {
      wx.redirectTo({
        url: '/pages/shot/shot',
      })
      this.setData({
        PageCur: e.currentTarget.dataset.cur
      })
    }
    else {
      wx.redirectTo({
        url: '/pages/home/home',
      })
      this.setData({
        PageCur: e.currentTarget.dataset.cur
      })
    }
  },

  NavToInfo(e) {
    if(app.globalData.wechatStepsAuthorizationSuccess && app.globalData.loginSuccess){
      wx.navigateTo({
        url: '../others/info/info'
      })
    }
    else{
      wx.showToast({
        title: '请先在我的页面中授权登录',
        icon: 'none',
        duration: 3000
      })
    }
  }
})