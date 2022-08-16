// pages/login/login.js
const app = getApp()

const db = wx.cloud.database()
const User = db.collection('User')

Page({
  data: {
    stateheight: app.globalData.stateheight,
    icon: '/static/images/login/icon.png',
    coordinate: [
      {x: -20, y: 80},
      {x: 680, y: 150},
      {x: 300, y: 250},
      {x: -20, y: 450},
      {x: 580, y: 540},
      {x: 200, y: 700},
      {x: 450, y: 900},
      {x: 150, y: 1100},
      {x: 650, y: 1200},
      {x: 180, y: 1460},
    ],
    adminOpenId: []
  },

  // 登录的回调函数
  getUserProfile() {
    // 获取用户信息
    wx.getUserProfile({
      desc: "用于个人信息展示",
      // 允许授权
      success: res => {
        wx.setStorageSync('currentUser', res.userInfo)
        let user = {
          avatar_url: res.userInfo.avatarUrl,
          nick_name: res.userInfo.nickName,
          gender: res.userInfo.gender,
          autograph: '',
          create_date: new Date()
        }
        // 將用戶添加到数据库
        User.add({
          data: user,
          success: () => {
            // 跳转到首页
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        })
      }
    }) 
  }
})
