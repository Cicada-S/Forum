// pages/me/me.js
const db = wx.cloud.database()
const Administrator = db.collection('Administrator')

Page({
  data: {
    userInfo: {}, // 用户信息
    isAdmin: false // 是否为管理员
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 获取用户信息
    let userInfo = wx.getStorageSync('currentUser')
    this.setData({ userInfo })

    // 获取管理员信息
    this.isAdministrator()
  },

  // 获取管理员信息
  isAdministrator() {
    Administrator.doc(this.data.userInfo._openid).get()
    .then(res => {
      console.log(res)
    })
  }
})
