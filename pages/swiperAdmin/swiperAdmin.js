// pages/swiperAdmin/swiperAdmin.js
const app = getApp()

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    informationList: [
      {
        _id: '123124fsa',
        path: '/static/images/swiperAdmin/xtt.jpg',
        upload_date: '22-08-21',
        remarks: '少年不惧岁月长，彼方尚有荣光在'
      },
      {
        _id: 'adadsadw',
        path: '/static/images/swiperAdmin/xtt.jpg',
        upload_date: '21-03-20',
        remarks: '劝君莫惜金缕衣，劝君须取少年时'
      }
    ]
  },

  // 跳转到添加资讯
  toAddSwiper() {
    wx.navigateTo({
      url: '/pages/addSwiper/addSwiper'
    })
  }
})
