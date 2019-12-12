// pages/analysis/analysis.js
const app = getApp()
var util = require('../../utils/util.js')
var wxCharts = require('../../ec-canvas/wxcharts-min.js');
const host = app.globalData.requestHost
var chart = null;
var windowWidth = wx.getSystemInfoSync().windowWidth;

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    starttime: 0,
    endtime: 0,
    todayStep: 0, //今日步数
    todayCalories: 0.0, //今日卡路里
    todayRatio: [{
      name: "牛肉",
      ratio: 0.3
    }, {
      name: "米饭",
      ratio: 0.5
    }, {
      name: "蔬菜",
      ratio: 0.2
    }], //今日食物占比
    big_ratio_food: "", //最大占比食物名称
    small_ratio_food: "", //最小占比食物名称
    recommends: [{
      imageSrc: "../../images/汉堡.png",
      foodName: "汉堡",
      caloPer: "1900"
    }, {
      imageSrc: "../../images/米饭.png",
      foodName: "米饭",
      caloPer: "500"
    }, {
      imageSrc: "../../images/鸡腿.png",
      foodName: "鸡腿",
      caloPer: "1900"
    }]
  },

  lifetimes: {
    attached: function() {
      var that = this;
      var starttimestamp = Date.parse(new Date());
      var endtimestamp = starttimestamp - 24 * 60 * 60 * 1000;
      this.setData({
        starttime: starttimestamp,
        endtime: endtimestamp
      });
      console.log(this);
      var pages = getCurrentPages() 
      console.log(pages)
      this.touchHandler1();
      chart = new wxCharts({
        animation: true,
        canvasId: 'chartCanvas',
        type: 'pie',
        series: [{
          name: '成交量1',
          data: 15,
        }, {
          name: '成交量2',
          data: 35,
        }, {
          name: '成交量3',
          data: 78,
        }, {
          name: '成交量4',
          data: 63,
        }, {
          name: '成交量2',
          data: 35,
        }, {
          name: '成交量3',
          data: 78,
        }, {
          name: '成交量4',
          data: 63,
        }, {
          name: '成交量2',
          data: 35,
        }, {
          name: '成交量3',
          data: 78,
        }, {
          name: '成交量3',
          data: 78,
        }],
        width: windowWidth,
        height: 500,
        dataLabel: true,
      });

      //获取当日步数
      wx.request({
        url: 'https://csquare.wang/steps/daily',
        method: 'GET',
        data: {
          openId: app.globalData.openid, //需传入用户openid
          startTime: this.data.starttime,
          endTime: this.data.endtime
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          that.setData({
            todayStep: res.data[res.data.length - 1].steps
          })
        }
      })

      //获取当日卡路里
      wx.request({
        url: 'https://csquare.wang/food/daily',
        method: 'GET',
        data: {
          openId:app.globalData.openid,        //需传入用户openid
          startTime: this.data.starttime,
          endTime: this.data.endtime
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          that.setData({
            todayCalories: res.data[res.data.length - 1].calories
          })
        }
      })

      //获取当日食物占比 画图表
      wx.request({
        url: 'https://csquare.wang/food/ratio',
        method: 'GET',
        data: {
          openId: app.globalData.openid, //需传入用户openid
          time: this.data.starttime
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res.data);
          var todayRotio = res.data;

          var food_array = [];
          var ratio_array = [];

          //准备图表数据 + 求最大、最小占比的食物
          for (var i = 0; i < that.data.todayRatio.length; i++) {
            //求最大、最小占比的食物
            var ratiof = that.data.todayRatio[i]
            if (ratiof.ratio > max_ratio) {
              max_food = ratiof.name
              max_ratio = ratiof.ratio
            } else if (ratiof.ratio < min_ratio) {
              min_food = ratiof.name
              min_ratio = ratiof.ratio
            }
            //准备图表需要的数据
            food_array.push(ratiof.ratio)
            ratio_array.push(ratiof.ratio)
          }
          that.setData({
            todayRatio: res.data
          })
          //画图表
        }
      })

      //最大、最小占比的食物
      var max_food = this.data.todayRatio[0].name
      var max_ratio = this.data.todayRatio[0].ratio
      var min_food = this.data.todayRatio[0].name
      var min_ratio = this.data.todayRatio[0].ratio
      for (var i = 0; i < this.data.todayRatio.length; i++) {
        var ratiof = this.data.todayRatio[i]
        if (ratiof.ratio > max_ratio) {
          max_food = ratiof.name
          max_ratio = ratiof.ratio
        } else if (ratiof.ratio < min_ratio) {
          min_food = ratiof.name
          min_ratio = ratiof.ratio
        }
      }
      this.setData({
        big_ratio_food: max_food,
        small_ratio_food: min_food
      })
    },

    methods: {
      touchHandler1() {
        console.log("called")
      }
    }
  }
})