// pages/fingertip/fingertip.js
Page({
  data: {
    x1: 0,
    y1: 0
  },

  GetPoint(event) {
    console.log(event)
    this.setData({
      x1: event.touches[0].pageX,
      y1: event.touches[0].pageY
    })
  }
})