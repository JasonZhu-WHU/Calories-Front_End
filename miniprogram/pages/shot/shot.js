// pages/shot/shot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carWin_img_hidden: true, //展示照片的view是否隐藏
    carWin_img: '' ,//存放照片路径的
    resultBase64ImageB:'',//转成编码
  },
  clickpics: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
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
    wx.getFileSystemManager().readFile({
      filePath: this.carWin_img, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: resultBase => { //成功的回调
        that.setData({
          resultBase64ImageB: resultBase.data
        });
      }
    })
   
    this.analysis()
  },
  analysis:function(){
    //调用接口返回识别内容
    var access_token = "24.d86fa2092e41a9897f6e64efd77f1c36.2592000.1578540493.282335-17974307"
   
   wx.request({
     url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=24.d86fa2092e41a9897f6e64efd77f1c36.2592000.1578540493.282335-17974307',
     header: {'content-type':'application/x-www-form-urlencoded'},
     method:'POST',
     data:{
       image: encoding(this.resultBase64ImageB)
     },
     success:function(res){
       console.log(res.data);
     }
   })
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