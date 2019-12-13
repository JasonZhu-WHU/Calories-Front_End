// pages/my/my.js
const app = getApp()

Page({
  /**
  * 页面的初始数据
  */
  data: {
    index: 0,
    bmi: 0,
    inputHeight:0,
    inputWeight:0,
    height: 0,
    weight: 0,
  },
  onLoad: function () {
    var that = this
    wx.request({
      url: 'https://csquare.wang/user',
      method: 'GET',
      data: {
        openId: app.globalData.openid,        //需传入用户openid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          inputHeight: res.data.height,
          inputweight: res.data.weight,
          bmi: res.data.bmi,
        })
      }
    })
  },

  onShow: function () {
    var that = this
    wx.request({
      url: 'https://csquare.wang/user',
      method: 'GET',
      data: {
        openId: app.globalData.openid,        //需传入用户openid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          inputHeight: res.data.height,
          inputweight: res.data.weight,
          bmi: res.data.bmi,
        })
      }
    })
  },

  onHide: function () {
    var that = this;
    wx.request({
      url: 'https://csquare.wang/user',
      method: 'GET',
      data: {
        openId: app.globalData.openid,        //需传入用户openid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          inputHeight: res.data.height,
          inputweight: res.data.weight,
          bmi: res.data.bmi,
        })
      }
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
          height: this.data.height,
          weight: this.data.weight,
          bmi: this.data.bmi,
          weight: this.data.dishWeigh,
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
    bmi = (this.data.weight / (height * height)).toFixed(1);
    this.setData({
      bmi: bmi
    })
  },

  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    var that = this
    wx.request({
      url: 'https://csquare.wang/user',
      method: 'GET',
      data: {
        openId: app.globalData.openid,        //需传入用户openid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          inputHeight: res.data.height,
          inputweight: res.data.weight,
          bmi: res.data.bmi,
        })
      }
    })
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

})