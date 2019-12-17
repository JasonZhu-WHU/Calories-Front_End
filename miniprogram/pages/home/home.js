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

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onLoad(options) {
    this.setData({
      PageCur: 'my',
      todayCalories:app.globalData.todayCalories,
      name:app.globalData.userInfo.nickName,
      profile: app.globalData.userInfo.avatarUrl,
      todaySteps: app.globalData.step
    })

    //计算BMI
    let bmi = 0;
    let height = app.globalData.userHeight / 100;
    bmi = (app.globalData.userWeight / (height * height)).toFixed(2);
    this.setData({
      bmi: bmi
    })
    
    this.setData({
      name: app.globalData.userInfo.nickName,
      profile: app.globalData.userInfo.avatarUrl
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
          name: app.globalData.userInfo.nickName,
          sex: app.globalData.userInfo.gender,
          profile: app.globalData.userInfo.avatarUrl,
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
          name: res.data.resData.name,
          sex: res.data.resData.sex,
          profile: res.data.resData.profile,
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

  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
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
        url: '/pages/home/home',
      })
    }
  },

  NavToInfo(e) {
    wx.navigateTo({
      url: '../others/info/info'
    })
  }

})