// pages/circle/circle.js
// 引入date
import { getdate } from '../../utils/date'

Page({
  data: {
    active: 0, // tab的状态
    community: '', // 圈子
    newPostList: [], // 最新
    hotPostList: [] // 最热
  },

  /**
   * 页面加载
  */
  onLoad(options) {
    this.setData({ community: options.id })
    // 获取帖子列表
    this.getPostList(0)
  },  

  // 获取帖子列表
  async getPostList(type) {
    let data = { type, community: this.data.community }
    let dataType = type === 0 ? 'newPostList' : 'hotPostList'

    // 发起请求获取帖子
    let { result } = await wx.cloud.callFunction({
      name: 'getPostList',
      data
    })
    // 将发布时间改成文字
    result.data.forEach(item => item.publish_date = getdate(item.publish_date))

    this.setData({
      [dataType]: result.data
    })
  },

  // 切换标签栏
  onChange(event) {
    this.getPostList(event.detail.name)
  },

  // 点击图片放大预览的处理函数
  preview(event) {
    let { current, urls } = event.detail
    urls = urls.map(item => item.path)
    wx.previewImage({
      current,
      urls
    })
  }
})
