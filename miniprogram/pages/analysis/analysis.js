// pages/analysis/analysis.js
const app = getApp()
var util = require('../../utils/util.js')
var wxCharts = require('../../ec-canvas/wxcharts-min.js');
import * as echarts from '../../ec-canvas/echarts.min.js';
const host = app.globalData.requestHost
var chart = null;
var chart1 = null;
var lineChart = null
var radarChart = null;
var windowWidth = wx.getSystemInfoSync().windowWidth;
var advice = "";

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    starttime: 0,
    endtime: 0,
    advice,
    todayStep: 0, //今日步数
    todayCalories: 0.0, //今日卡路里
    todayRatio: [], //今日食物占比
    big_ratio_food: "", //最大占比食物名称
    small_ratio_food: "", //最小占比食物名称
    ec: {},
    recommends: [{
      imageSrc: app.globalData.imgBase + "/热干面.jpeg",
      foodName: "热干面",
      caloPer: "153"
    }, {
      imageSrc: app.globalData.imgBase + "/米饭.jpg",
      foodName: "米饭",
      caloPer: "97"
    }, {
      imageSrc: app.globalData.imgBase + "/番茄炒蛋.jpg",
      foodName: "番茄炒蛋",
      caloPer: "86"
    }]
  },

  onLoad: function() {
    this.setData({
      PageCur: 'analysis'
    })
    var that = this;
    var _this = this
    var endtimestamp = Date.parse(new Date());
    var starttimestamp = endtimestamp - 24 * 60 * 60 * 1000;
    _this.setData({
      starttime: starttimestamp + 24 * 60 * 60 * 1000,
      endtime: endtimestamp + 24 * 60 * 60 * 1000
    });
    // this.drawPieDiagram()
    var _this = this
    var steps = app.globalData.step;

    console.log(app.globalData)
    var steps_score = this.calculateStepScore(steps);
    var calories_score = 90;
    var BMI_score = this.calculateBMIScore();
    console.log(steps_score)
    console.log(calories_score)
    console.log(BMI_score)

    //获取当日卡路里
    wx.request({
      url: 'https://csquare.wang/food/daily',
      method: 'GET',
      data: {
        "openId": app.globalData.openId, //需传入用户openId
        "startTime": _this.data.starttime,
        "endTime": _this.data.endtime
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        var todayCalories = res.data.resData[res.data.resData.length - 1].calories
        if (res.data.success == true) {
          that.setData({
            todayCalories: todayCalories
          })
          app.globalData.todayCalories = todayCalories
        }
        calories_score = that.calculateCaloriesScore(todayCalories);
      }
    })

    //获取当日食物占比 画图表
    wx.request({
      url: 'https://csquare.wang/food/ratio',
      method: 'GET',
      data: {
        "openId": app.globalData.openId, //需传入用户openId
        "time": that.data.endtime
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data);
        // if (res.data.success == true) {
        if (true) {
          var todayRatioObject = res.data.resData
          var todayRatio = []
          var arr = []
          //把resData转成数组，存到todayRatio
          var keys = Object.keys(todayRatioObject)
          var values = Object.values(todayRatioObject)

          for (var i = 0; i < keys.length; i++) {
            todayRatio.push({
              name: keys[i],
              data: values[i]
            })
            arr.push({
              name: keys[i],
              data: values[i]
            })
          }
          //实际记得注释
          todayRatio.push({
            name: "热干面",
            data: 0.2
          })
          todayRatio.push({
            name: "西红柿鸡蛋炒面",
            data: 0.3
          })
          console.log(todayRatio)
          chart = new wxCharts({
            animation: true,
            canvasId: 'chartCanvas',
            type: 'pie',
            series: todayRatio,
            width: windowWidth,
            height: 300,
            dataLabel: true,
          });
          that.setData({
            todayRatio: todayRatio
          })
          //准备图表数据 + 求最大、最小占比的食物
          var max_food = that.data.todayRatio[0].name
          var max_ratio = that.data.todayRatio[0].ratio
          var min_food = that.data.todayRatio[0].name
          var min_ratio = that.data.todayRatio[0].ratio
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
          }
          that.setData({
            big_ratio_food: max_food,
            small_ratio_food: min_food
          })
        }

        //画图表
      }
    })
    radarChart = new wxCharts({
      canvasId: 'radarCanvas',
      type: 'radar',
      categories: ['热量摄入', '运动量', '身材'],
      series: [{
        name: '健康评估',
        data: [calories_score, steps_score, BMI_score]
      }],
      width: windowWidth,
      height: 200,
      extra: {
        radar: {
          max: 150
        }
      }
    });
    wx.request({
      url: 'https://csquare.wang/food/daily',
      method: 'GET',
      data: {
        "openId": app.globalData.openId, //需传入用户openId
        "startTime": that.data.starttime - 5 * 24 * 60 * 60 * 1000,
        "endTime": that.data.endtime + 24 * 60 * 60 * 1000,
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        var realDataArray = [];
        var periodData = res.data.resData;
        var time_categories = [];
        for (var i = 0; i < periodData.length; i++) {
          realDataArray.push(periodData[i].calories)
          time_categories.push(periodData[i].time.substr(5, 5))
        }
        var expectationData = that.createSimulationData();
        console.log(time_categories)
        lineChart = new wxCharts({
          canvasId: 'lineCanvas',
          type: 'line',
          categories: time_categories,
          animation: false,
          series: [{
              name: '实际摄入量',
              // data: realDataArray,
              data: realDataArray,
              format: function(val, name) {
                return val.toFixed(2) + '卡';
              }
            },
            {
              name: '建议摄入量',
              data: [1800, 1900, 1800, 1800, 1850, 1700, 1900],
              format: function(val, name) {
                return (val + 3).toFixed(2) + '卡';
              }
            }
          ],
          xAxis: {
            disableGrid: false
          },
          yAxis: {
            title: '摄入热量 (卡)',
            format: function(val) {
              return val.toFixed(2);
            },
            min: 0
          },
          width: windowWidth,
          height: 200,
          dataLabel: true,
          dataPointShape: true,
          enableScroll: true,
          extra: {
            lineStyle: 'curve'
          }
        });
      }
    })
  },

  onReady() {
    var that = this;
    this.setData({
      ec: {
        onInit: this.initChart
      },
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
    } else if (e.currentTarget.dataset.cur == "shot") {
      wx.redirectTo({
        url: '/pages/shot/shot',
      })
    } else {
      wx.redirectTo({
        url: '/pages/home/home',
      })
    }
  },

  drawPieDiagram: function() {
    wx.request({
      url: 'https://csquare.wang/food/ratio',
      method: 'GET',
      data: {
        "openId": app.globalData.openId, //需传入用户openId
        "time": that.data.endtime
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data);
        if (res.data.success == true) {
          var todayRatioObject = res.data.resData
          var todayRatio = []
          //把resData转成数组，存到todayRatio
          var keys = Object.keys(todayRatioObject)
          var values = Object.values(todayRatioObject)

          for (var i = 0; i < keys.length; i++) {
            todayRatio.push({
              name: keys[i],
              ratio: values[i]
            })
          }
          console.log(todayRatio)
          pieChart1 = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas1',
            type: 'pie',
            series: arr,
            width: windowWidth,
            height: 300,
            dataLabel: true,
          });
        }

        //画图表
      }
    })
  },

  createSimulationData: function() {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
      categories.push('201' + i);
      data.push(Math.random() * (20 - 10) + 10);
    }
    return {
      categories: categories,
      data: data
    }
  },

  //根据中国疾病预防控制中心慢病中心等7个机构，联合发布《科学健走腾冲宣言》编写的函数
  calculateStepScore: function(step) {
    if (step - 10000 > 0) {
      var score = step - 15000;
      if (score > 15000) {
        advice = "今天已经运动了" + step + "步啦，好好休息吧，科学锻炼，避免关节长期磨损哦^-^"
        score = (100 - score / 200)
      } else {
        advice = "今天已经运动了" + step + "步啦，运动量刚刚好"
        score = 100
      }
    } else {
      var score = 8000 - step;
      if (score > 8000) {
        advice = "今天已经运动了" + step + "步啦，运动量刚刚好"
        score = 100
      } else {
        advice = "今天已经运动了" + step + "步啦，还要多锻炼哦，医学建议每天8000步以上，加油呀！"
        score = (100 - score / 100)
      }
    }
    console.log(advice)
    this.setData({
      advice: advice
    })
    return score
  },
  calculateCaloriesScore: function(calories) {
    if (app.globalData.userInfo.gender == 0 || app.globalData.userInfo.gender == 1) {
      if (calories - 2340 > 0) {
        var score = calories - 2340;
        score = score / 50;
        score = 100 - score;
        return score
      } else if (calories > 1980) {
        var score = 100;
        return 100
      } else {
        var score = 1980 - calories;
        score = score / 30;
        return score
      }
    } else {
      if (calories - 1900 > 0) {
        var score = calories - 1900;
        score = score / 50;
        score = 100 - score;
        return score
      } else if (calories > 1800) {
        var score = 100;
        return 100
      } else {
        var score = 1800 - calories;
        score = score / 30;
        return score
      }
    }
  },

  calculateBMIScore: function() {
    var bmi = app.globalData.bmi
    if (bmi < 20) {
      return 10 * bmi - 100
    } else if (bmi < 25) {
      return 100
    } else {
      return 200 - 8 * bmi
    }
  },

  touchHandler: function(e) {
    lineChart.scrollStart(e);
    var index = lineChart.getCurrentDataIndex(e);
  },
  moveHandler: function(e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function(e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function(item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
})