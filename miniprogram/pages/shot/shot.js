// pages/shot/shot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carWin_img_hidden: true, //展示照片的view是否隐藏
    carWin_img: '' ,//存放照片路径的
    actionSheetHidden:true,
    actionSheetItems:[
      {bindtap:'camara',txt:'相机'},
      {bindtap:'album',txt:'从相册中选取' },
      
    ],
   
    
  },
  clickpics: function (way) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: way, // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 无论用户是从相册选择还是直接用相机拍摄，路径都是在这里面
        var filePath = res.tempFilePaths[0];
        //将刚才选的照片/拍的 放到下面view视图中
        that.setData({
          carWin_img: filePath, //把照片路径存到变量中，
          carWin_img_hidden: false //让展示照片的view显示
        });
      }
    })
  },
  actionSheetTap: function () {

    this.setData({

      actionSheetHidden: !this.data.actionSheetHidden

    })

  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindcamara: function () {
    var way = "camera";
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
    this.clickpics(way);
  },
  bindalbum: function () {
    this.setData({
      way:"album",
      actionSheetHidden: !this.data.actionSheetHidden
    });
    this.clickpics(way);
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      carWin_img_hidden: true,
      carWin_img: ''
    });
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

  },
  
  // 拍摄或从相册选取上传
  
  
  
})