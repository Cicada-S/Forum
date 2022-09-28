// pages/circle/circle.js
// 引入date
import { getdate } from '../../utils/date'

Page({
  data: {
    active: 0, // tab的状态
    community: '', // 圈子
    newPostList: [], // 最新
    hotPostList: [], // 最热
    newPageIndex: 1, // 最新 当前分页
    hotPageIndex: 1, // 最热 当前分页
    pageSize: 5, // 每次获取数据数量
    newReachBottom: false, // 最新 是否到底部
    hotReachBottom: false // 最热 是否到底部
  },

  /**
   * 页面加载
  */
  onLoad(options) {
    this.setData({ community: options.id })
    // 获取帖子列表
    this.getPostList(0)
    this.getPostList(1)
  },  

  // 获取帖子列表
  async getPostList(type) {
    let dataType = type === 0 ? 'newPostList' : 'hotPostList'
    let { community, pageSize, newPageIndex, hotPageIndex, newPostList, hotPostList } = this.data
    let data = { type, community, pageSize }

    // 当前分页
    data.pageIndex = !type ? newPageIndex : hotPageIndex

    // 发起请求获取帖子
    let { result } = await wx.cloud.callFunction({
      name: 'getPostList',
      data
    })

    // 如果没有数据了则将 reachBottom 设为 true
    if(!type && !result.data.length) {
      this.setData({ newReachBottom: true })
    } else if(type && !result.data.length) {
      this.setData({ hotReachBottom: true })
    }

    // 将发布时间改成文字
    result.data?.forEach(item => item.publish_date = getdate(item.publish_date))

    let postList = result.data.length ? result.data : []
    // 如果pageIndex大于1则 unshift 到该类型的数据中
    if(!type && newPageIndex > 1) {
      postList = newPostList.concat(result.data)
    } else if(type && hotPageIndex > 1) {
      postList = hotPostList.unshift(result.data)
    }
    // 更新data
    this.setData({[dataType]: postList})
  },

  // 切换标签栏
  onChange(event) {
    this.setData({ active: event.detail.name })
  },

  // 点击图片放大预览的处理函数
  preview(event) {
    let { current, urls } = event.detail
    urls = urls.map(item => item.path)
    wx.previewImage({
      current,
      urls
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let { newReachBottom, hotReachBottom, newPageIndex, hotPageIndex, active } = this.data

    // 判断当前为最新/最热
    if(!active) {
      // 如果到底部则返回
      if(newReachBottom) return
      // 分页+1
      this.setData({ newPageIndex: ++newPageIndex })
      // 获取数据
      this.getPostList(active)
    } else {
      // 如果到底部则返回
      if(hotReachBottom) return
      // 分页+1
      this.setData({ hotPageIndex: ++hotPageIndex })
      // 获取数据
      this.getPostList(active)
    }
  }
})
