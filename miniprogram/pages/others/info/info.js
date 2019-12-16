// pages/others/info/info.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    picker1: ['150', '151', '152', '153', '154', '155', '156', '157', '158', '159',
      '160', '161', '162', '163', '164', '165', '166', '167', '168', '169', 
      '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', 
      '180', '181', '182', '183', '184', '185', '186', '187', '188', '189', 
      '190', '191', '192', '193', '194', '195', '196', '197', '198', '199', '200'],
    index1: 15,
    haveChoose1:null,
    picker2: ['50', '50.5', '51', '51.5', '52', '52.5', '53', '53.5', '54', '54.5', '55', '55.5',
      '56', '56.5', '57', '57.5', '58', '58.5', '59', '59.5', '60', '60.5', '61', '61.5',
      '62', '62.5', '63', '63.5', '64', '64.5', '65', '65.5', '66', '66.5', '67', '67.5',
      '68', '68.5', '69', '69.5', '70', '70.5', '71', '71.5', '72', '72.5', '73', '73.5', 
      '74', '74.5', '75', '75.5', '76', '76.5', '77', '77.5', '78', '78.5', '79', '79.5', '80'],
    index2: 10,
    haveChoose2:null,

    updatedHeight:null,
    updatedWeight:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  pageBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  PickerChange(e) {
    var _this=this
    _this.setData({
      index1: e.detail.value,
      haveChoose1:e.detail.value,
    })
    _this.setData({
      updatedHeight: parseFloat(_this.data.picker1[_this.data.index1])
    })
    app.globalData.userHeight=_this.data.updatedHeight
    console.log(app.globalData.userHeight)
  },

  PickerChangeWeight(e) {
    var _this=this
    _this.setData({
      index2: e.detail.value,
      haveChoose2: e.detail.value
    })
    _this.setData({
      updatedWeight: parseFloat(_this.data.picker2[_this.data.index2])
    })
    app.globalData.userWeight = _this.data.updatedWeight
    console.log(app.globalData.userWeight)
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