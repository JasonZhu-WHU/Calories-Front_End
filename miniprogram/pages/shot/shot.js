// pages/shot/shot.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carWin_img_hidden: true, //展示照片的view是否隐藏
    carWin_img: '' ,//存放照片路径的
    resultBase64ImageB:'',//转成编码
    choose:false,
    result:[],
    userDish:'',//菜的名称
    userCal:0.0,//单位卡路里
    dishWeight:0.0,//吃的重量
    getWeight:false,
    date:null//上传的日期
    
  },
  clickpics: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        // 无论用户是从相册选择还是直接用相机拍摄，路径都是在这里面
      const file = res.tempFilePaths[0];
        //将刚才选的照片/拍的 放到下面view视图中
        that.setData({
          carWin_img: file, //把照片路径存到变量中，
          carWin_img_hidden: false, //让展示照片的view显示
          
        });
        wx.getFileSystemManager().readFile({
          filePath: that.data.carWin_img, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            that.setData({
              resultBase64ImageB: encodeURI(res.data)
            });
            console.log(that.data.resultBase64ImageB);
            that.analysis();

          }
        })

       
      }

      })
   
    },
  analysis:function(){
    //调用接口返回识别内容
    //const access_token = "24.d86fa2092e41a9897f6e64efd77f1c36.2592000.1578540493.282335-17974307"
   var that = this;
   wx.request({
     url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=24.d86fa2092e41a9897f6e64efd77f1c36.2592000.1578540493.282335-17974307',
     header: {'content-type':'application/x-www-form-urlencoded'},
     method:'POST',
     data:{
       image: that.data.resultBase64ImageB,
       filter_threshold:0.95
     },
     success:function(res){
      
      //console.log(res.data.result[0].calorie);
      that.setData({
        choose:true,
       result:res.data.result
      });
      console.log(that.data.result);
     }
   })
  },
//隐藏选择框
  hideModal: function () {
    this.setData({
      choose: false,
      getWeight:false
    });
  },
  
  preventTouchMove: function () { },
  
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      PageCur: 'shot'
    })
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
  //下面是选择食物的函数，需要弹出另外一个框填入吃的重量
choose:function(e){
  var viewId = e.target.id;
   if(viewId=="d1"){
     this.setData(
       {
         userDish :this.data.result[0].name,
         userCal :this.data.result[0].calorie
       }
     );
   }else if(viewId=="d2"){
     this.setData(
       {
         userDish: this.data.result[1].name,
         userCal: this.data.result[1].calorie
       });
   }else if(viewId=="d3"){
     this.setData(
       {
         userDish: this.data.result[2].name,
         userCal: this.data.result[2].calorie
       });
   }else if(viewId=="d4"){
     this.setData(
       {
         userDish: this.data.result[3].name,
         userCal: this.data.result[3].calorie
       });
   }else if(viewId=="d5"){
     this.setData(
       {
         userDish: this.data.result[4].name,
         userCal: this.data.result[4].calorie
       });
   }
  this.buf();
},
buf:function(){
  this.setData({
    choose: false,
    getWeight: true
  });        
},
ins:function(e){
  this.setData({
    dishWeight:e.detail.value
  });
 
},
confirm:function(){
  this.setData({
    getWeight:false
  });
  console.log(this.data.dishWeight);
  //获取提交时间
  var timestamp = Date.parse(new Date()).valueOf();
  //确认后就将信息上传给后台
  wx.request({
    url: 'https://csquare.wang/food',
    method:'POST',
    data: {
      openId:app.globalData.openId,        //需传入用户openid
      reqParam: {
        name: this.data.userDish,
        time: timestamp,
        calories: this.data.userCal,
        weight: this.data.dishWeight,
      }
    },
    header: {
      'content-type': 'application/json'
    },
  })

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
  
  // 拍摄或从相册选取上传
  
  
  
})