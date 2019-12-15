const app = getApp()

Page({
  data: {
    PageCur: 'shot',
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,

    pieChartData: null,
    histogramData: null
  },

  NavChange(e) {
    console.log(e.currentTarget.dataset.cur)
    if (e.currentTarget.dataset.cur == "analysis") {
      wx.redirectTo({
        url: '/pages/analysis/analysis',
      })
    }
    else if (e.currentTarget.dataset.cur == "shot") {
      wx.redirectTo({
        url: '/pages/shot/shot',
      })
    }
    else {
      wx.redirectTo({
        url: '/pages/my/my',
      })
    }
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },

  onLoad: function () {
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
              wx.login({
                success: res => {
                  // 获取到用户的 code 之后：res.code
                  console.log("用户的code:" + res.code);
                  //获取用户openid 虽然我觉得传secret会被微信暴打
                  wx.request({
                    url: 'https://csquare.wang/openid',
                    data:{
                      "appid": "wxfdbdf9572f3ae678",
                      "secret": "5fecb5d7093bb4a17d7d77cb19cf37a2",
                      "js_code": res.code,
                      "grant_type": "authorization_code"
                    },
                    header:{
                      'content_type': "application/json"
                    },
                    method: "GET",
                    success(res){
                      console.log(res.data.openid)
                      app.globalData.openId = res.data.openid
                    },
                    fail(res){
                      console.log(res)
                    }
                  })
                }
              });
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
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
  },

  getPieChartData(){
    var starttimestamp = Date.parse(new Date());
    var that = this;
    //获取当日食物占比 画图表
    wx.request({
      url: 'https://csquare.wang/food/ratio',
      method: 'GET',
      data: {
        openId: app.globalData.openid, //需传入用户openid
        time: starttimestamp
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data);
        var todayRatio = res.data;
        var food_array = [];
        var ratio_array = [];

        //准备今天吃了什么的图表数据
        for (var i = 0; i < that.data.todayRatio.length; i++) {
          var ratiof = that.data.todayRatio[i]
          //准备图表需要的数据
          food_array.push(ratiof.ratio)
          ratio_array.push(ratiof.ratio)
        }

        //可能会有异步问题，最好promise重写
        that.setData({
          pieChartData:{
            food_array: food_array,
            ratio_array: ratio_array
          }
        })
      }
    })
  },

  //这里到底是要画一个推荐的和实际的卡路里摄入histogram么
  getHistogramData() {
    
  }
})
