// pages/collection/collection.js
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
    // 获取帖子
    this.getPostList()
  },

  // 获取帖子
  async getPostList() {
    // 请求云函数获取收藏数据
    let { result } = await wx.cloud.callFunction({name: 'getCollection'})
    // 将发布时间改成文字
    result.data?.forEach(item => item.publish_date = getdate(item.publish_date))
    // 更新data
    this.setData({ postList: result.data })
  }
})
