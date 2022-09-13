// pages/signOut/signOut.js
Page({
  data: {
    userInfo: {}
  },

  /**
   * 页面加载
   */
  onLoad() {
    let userInfo = wx.getStorageSync('currentUser')
    this.setData({ userInfo })
  },

  // 清理缓存
  onClear() {
    console.log('清理缓存')
  },

  // 退出登录
  onSignOut() {
    console.log('退出登录')
  }
})
