const app = getApp()
Page({
  data: {
    PageCur: 'shot',
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    weRunData:"",
    shareInfo:"",
    pieChartData: null,
    histogramData: null
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
          title: '请先在我的页面中授权登录',
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

  onLoad: function () {
    wx.redirectTo({
      url: '/pages/shot/shot',
    })
    this.setData({
      PageCur: 'shot'
    })
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
              // 根据自己的需求有其他操作再补充
              // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
              app.globalData.loginSuccess = true
              wx.login({
                success: res => {
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
                      that.setTodayCalories()
                    },
                    fail(res) {
                      console.log(res)
                    }
                  })

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
                          })
                        }, fail() {
                          console.log("fail");
                        }
                      })
                    }, fail() {
                      console.log("失败");
                    }
                  })
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 不改变任何的值
          
        }
      }
    });
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
        app.globalData.bmi = res.data.resData.bmi.toFixed(2)
      }
    })
    var endtimestamp = Date.parse(new Date()) + 24 * 60 * 60 * 1000;
    var starttimestamp = endtimestamp - 24 * 60 * 60 * 1000;
    app.globalData.starttime = starttimestamp
    app.globalData.endtime = endtimestamp

    var _this = this

    //获取当日卡路里
    wx.request({
      url: 'https://csquare.wang/food/daily',
      method: 'GET',
      data: {
        "openId": app.globalData.openId, //需传入用户openId
        "startTime": app.globalData.starttime,
        "endTime": app.globalData.endtime
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        if (res.data.success == true) {
          app.globalData.todayCalories = res.data.resData[res.data.resData.length - 1].calories
        }
      }
    })
  },

  setTodayCalories: function(){
    var endtimestamp = Date.parse(new Date()) + 24 * 60 * 60 * 1000;
    var starttimestamp = endtimestamp

    wx.request({
      url: 'https://csquare.wang/food/daily',
      method: 'GET',
      data: {
        "openId": app.globalData.openId, //需传入用户openId
        "startTime": starttimestamp - 5 * 24 * 60 * 60 * 1000,
        "endTime": endtimestamp + 24 * 60 * 60 * 1000,
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        var realDataArray = [];
        var periodData = res.data.resData;
        var time_categories = [];
        for (var i = 0; i < periodData.length; i++) {
          realDataArray.push(periodData[i].calories)
          time_categories.push(periodData[i].time.substr(5, 5))
        }
        app.globalData.todayCalories = periodData[periodData.length - 2].calories
        console.log(app.globalData.todayCalories)
      }
    })
  }
})
