// pages/editProfile/editProfile.js
const db = wx.cloud.database()
const User = db.collection('User')

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
  },

  // 监听个性签名发生改变
  onChange(event) {
    this.setData({ 'userInfo.autograph': event.detail })
  },

  // 保存的回调函数
  async onClick() {
    let userInfo = this.data.userInfo
    await User.doc(userInfo._id).update({data: {autograph: userInfo.autograph}})
    wx.showToast({
      title: '保存成功！',
      icon: 'none',
      duration: 1000
    })
    wx.setStorageSync('currentUser', userInfo)
  }
})
