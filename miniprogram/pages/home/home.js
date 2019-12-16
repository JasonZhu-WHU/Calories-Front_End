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
      PageCur: 'my'
    })
    var that = this
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

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  bindKeyHightInput: function (e) {
    this.setData({
      height: e.detail.value
    })
  },

  bindKeyWeightInput: function (e) {
    this.setData({
      weight: e.detail.value
    })
  },

  calculateBtn: function (e) {
    if (!this.data.height) {
      wx.showToast({
        title: '请输入身高'
      })
      return false;
    }

    if (!this.data.weight) {
      wx.showToast({
        title: '请输入体重'
      })
      return false;
    }
    this.calculate();

    wx.request({
      url: 'https://csquare.wang/user',
      method: 'POST',
      data: {
        openId: app.globalData.openId,        //需传入用户openid
        reqParam: {
          name: this.data.name,
          sex: this.data.sex,
          profile: this.data.profile,
          height: this.data.height,
          weight: this.data.weight,
          bmi: this.data.bmi,
        }
      },

      header: {
        'content-type': 'application/json'
      },
    })

  },

  //计算BMI值
  calculate: function () {
    let bmi = 0;
    let height = this.data.height / 100;
    bmi = (this.data.weight / (height * height)).toFixed(2);
    this.setData({
      bmi: bmi
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
    wx.showToast({
      title: '页面正在开发中，敬请期待',
      icon: 'none',
      duration: 3000
    })
  }

})