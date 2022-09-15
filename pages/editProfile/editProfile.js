// pages/editProfile/editProfile.js
Page({
  data: {
    userInfo: {}
  },

  /**
   * 页面加载
   */
  onLoad() {
    this.setData({
      userInfo: wx.getStorageSync('currentUser')
    })
  }
})
