// pages/myPost/myPost.js
Page({
  data: {
    postList: [], // 帖子列表
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    console.log(options)
  },

  // 获取帖子列表
  async getPostList() {
    let result = await wx.cloud.callFunction({
      name: 'getPostList',
      data: { id: wx.getStorageSync('currentUser')._openid }
    })

    console.log(result)
  }
})
