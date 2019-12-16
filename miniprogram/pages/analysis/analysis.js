// pages/analysis/analysis.js
const app = getApp()
var util = require('../../utils/util.js')
var wxCharts = require('../../ec-canvas/wxcharts-min.js');
import * as echarts from '../../ec-canvas/echarts.min.js';
const host = app.globalData.requestHost
var chart = null;
var chart1 = null;
var lineChart = null
var windowWidth = wx.getSystemInfoSync().windowWidth;

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    windowHeight: app.globalData.windowHeight,
    starttime: 0,
    endtime: 0,
    todayStep: 0, //今日步数
    todayCalories: 0.0, //今日卡路里
    todayRatio: [], //今日食物占比
    big_ratio_food: "", //最大占比食物名称
    small_ratio_food: "", //最小占比食物名称
    ec: {},
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

  onLoad: function() {
    this.setData({
      PageCur: 'analysis'
    })
    console.log("onload")
    var that = this;
    var _this = this
    var endtimestamp = Date.parse(new Date());
    var starttimestamp = endtimestamp - 24 * 60 * 60 * 1000;
    _this.setData({
      starttime: starttimestamp + 8 * 60 * 60 * 1000,
      endtime: endtimestamp + 8 * 60 * 60 * 1000
    });
    // this.drawPieDiagram()
    var _this = this
    //获取当日步数
    wx.request({
      url: 'https://csquare.wang/steps/daily',
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
        if (res.data.success == true) {
          that.setData({
            todayStep: res.data.resData[res.data.resData.length - 1].steps
          })
          console.log("今日步数：" + that.data.todayStep)
        }
      }
    })

    var _this = this
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
        console.log(res.data);
        if (res.data.success == true) {
          that.setData({
            todayCalories: res.data.resData[res.data.resData.length - 1].calories
          })
        }
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
              ratio: values[i]
            })
            arr.push({
              name: keys[i],
              data: values[i]
            })
          }
          //实际记得注释
          todayRatio.push({
            name: "热干面",
            data: 680
          })
          todayRatio.push({
            name: "西红柿鸡蛋炒面",
            data: 1300
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

          console.log(that.data.todayRatio.length)
          //准备图表数据 + 求最大、最小占比的食物
          var max_food = that.data.todayRatio[0].name
          var max_ratio = that.data.todayRatio[0].ratio
          var min_food = that.data.todayRatio[0].name
          var min_ratio = that.data.todayRatio[0].ratio
          for (var i = 0; i < that.data.todayRatio.length; i++) {
            console.log("1")
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
      success(res){
        console.log(res.data)
        var realDataArray = [];
        var periodData = res.data.resData;
        var time_categories = [];
        for (var i = 0; i < periodData.length; i++) {
          realDataArray.push(periodData[i].calories)
          time_categories.push(periodData[i].time.substr(5, 5))
        }
        console.log(realDataArray)
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
            format: function (val, name) {
              return val.toFixed(2) + '万';
            }
          },
          {
            name: '建议摄入量',
            data: [5000, 5000, 5500, 5600, 5700, 5800, 5900],
            format: function (val, name) {
              return (val + 3).toFixed(2) + '万';
            }
          }],
          xAxis: {
            disableGrid: false
          },
          yAxis: {
            title: '摄入热量 (千卡)',
            format: function (val) {
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
    console.log(chart1)
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
        url: '/pages/my/my',
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

  createSimulationData: function () {
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


  initChart(canvas, width, height) {
    console.log('init')
    chart1 = echarts.init(canvas, null, {
      width: width,
      height: height,
      canvasId: 'echartCanvas'
    });
    canvas.setChart(chart1);
    this.chart1 = chart1
    var option = {
      color: ['#37a2da', '#32c5e9', '#67e0e3'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['热度', '正面', '负面']
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      xAxis: [{
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }],
      yAxis: [{
        type: 'category',
        axisTick: {
          show: false
        },
        data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }],
      series: [{
          name: '热度',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: [300, 270, 340, 344, 300, 320, 310],
          itemStyle: {
            // emphasis: {
            //   color: '#37a2da'
            // }
          }
        },
        {
          name: '正面',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true
            }
          },
          data: [120, 102, 141, 174, 190, 250, 220],
          itemStyle: {
            // emphasis: {
            //   color: '#32c5e9'
            // }
          }
        },
        {
          name: '负面',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'left'
            }
          },
          data: [-20, -32, -21, -34, -90, -130, -110],
          itemStyle: {
            // emphasis: {
            //   color: '#67e0e3'
            // }
          }
        }
      ]
    };

    chart1.setOption(option);
    return chart1;
  },

  touchHandler: function (e) {
    lineChart.scrollStart(e);
    var index = lineChart.getCurrentDataIndex(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
})