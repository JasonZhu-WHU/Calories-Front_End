// component/recommend/recommend.js
const app = getApp()

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    imageSrc:{
      type:String,
      value:"../../images/running.png"
    },
    foodName:{
      type:String,
      value:"牛肉"
    },
    caloPer:{
      type:Number,
      value:190
    }
  },

  data: {
    componentWidth:0
  },

  lifetimes: {
    attached: function () {
      var _this = this
      _this.setData({
        componentWidth:app.globalData.windowWidth/2-35
      })
    }
  },

  methods: {

  }
})
