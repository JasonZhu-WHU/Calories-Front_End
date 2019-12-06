Page({
  data: {
    PageCur: 'shot'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  }
})