// pages/me/me.js
Page({
  data: {
    userInfo: {} // 用户信息
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 获取用户信息
    let userInfo = wx.getStorageSync('currentUser')
    this.setData({ userInfo })
  }
})
