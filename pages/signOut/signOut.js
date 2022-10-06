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
    wx.removeStorageSync('currentUser')
    wx.showToast({
      title: '清理成功!',
      icon: 'success',
      duration: 2000
    })
    setTimeout(()=> {
      wx.switchTab({url: '/pages/index/index'})
    }, 2000)
  },

  // 退出登录
  onSignOut() {
    console.log('退出登录')
  }
})
