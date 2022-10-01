// pages/me/me.js
const db = wx.cloud.database()
const Administrator = db.collection('Administrator')

Page({
  data: {
    userInfo: {}, // 用户信息
    isAdmin: false // 是否为超级管理员
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
  async isAdministrator() {
    let { data } = await Administrator.where({_openid: this.data.userInfo._openid}).get()
    if(data[0].super_admin === 0) this.setData({ isAdmin: true })
  },

  // 跳转到我的帖子
  toMyPost() {
    wx.navigateTo({
      url: '/pages/myPost/myPost'
    })
  },

  // 跳转到收藏
  toCollection() {
    wx.navigateTo({
      url: '/pages/collection/collection'
    })
  },

  // 跳转到修改资料
  toEditProfile() {
    wx.navigateTo({
      url: '/pages/editProfile/editProfile'
    })
  },

  // 跳转到关于我们
  toAboutUs() {
    wx.navigateTo({
      url: '/pages/aboutUs/aboutUs'
    })
  },

  // 跳转到退出登录
  toSignOut() {
    wx.navigateTo({
      url: '/pages/signOut/signOut'
    })
  },

  // 跳转到资讯管理
  toSwiperAdmin() {
    wx.navigateTo({
      url: '/pages/swiperAdmin/swiperAdmin'
    })
  },

  // 功能未开放
  undefined() {
    wx.showToast({
      title: '作者在疯狂打码中...',
      icon: 'none',
      duration: 1000
    })
  }
})
