// pages/my/my.js
Page({
  /**
  * 页面的初始数据
  */
  data: {
    index: 0,
    score: 0,
    height: 0,
    weight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
    this.weightStandardCalculate();
    this.physicalConditionCalculate();
  },

  //计算IBM值
  calculate: function () {
    let score = 0;
    let height = this.data.height / 100;
    score = (this.data.weight / (height * height)).toFixed(1);
    this.setData({
      score: score
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

})