// pages/myPost/myPost.js
// 引入date
import { getdate } from '../../utils/date'

Page({
  data: {
    postList: [], // 帖子列表
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 获取帖子列表
    this.getPostList()
  },

  // 获取帖子列表
  async getPostList() {
    let { result } = await wx.cloud.callFunction({
      name: 'getPostList',
      data: { id: wx.getStorageSync('currentUser')._openid }
    })
    // 将发布时间改成文字
    result.data.forEach(item => item.publish_date = getdate(item.publish_date))
    this.setData({ postList: result.data })
  }
})
