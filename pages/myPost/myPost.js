// pages/myPost/myPost.js
// 引入date
import { getdate } from '../../utils/date'

const db = wx.cloud.database()
const Post = db.collection('Post')

Page({
  data: {
    postList: [], // 帖子列表
    pageIndex: 1, // 当前分页
    pageSize: 5, // 每次获取数据数量
    reachBottom: false // 是否到底部
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
    // 用于请求数据的参数
    let data = {
      id: wx.getStorageSync('currentUser')._openid,
      type: 0,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize
    }

    // 发起请求获取帖子
    let { result } = await wx.cloud.callFunction({
      name: 'getPostList',
      data
    })

    // 如果没有数据了则将 reachBottom 设为 true
    if(!result.data.length) this.setData({ reachBottom: true })

    // 将发布时间改成文字
    result.data?.forEach(item => item.publish_date = getdate(item.publish_date))

    // 如果直接赋值[] 第一次获取数据时 会将空数组传到postList中 所以这里要判断
    let postList = result.data.length ? result.data : []
    // 如果pageIndex大于1则 将新数据合并到 postList 中
    if(this.data.pageIndex > 1) postList = this.data.postList.concat(result.data)

    // 更新data
    this.setData({ postList })
  },

  // 删除帖子
  onDelete(event) {
    wx.showModal({
      title: '提示',
      content: '确实删除该帖子吗？'
    }).then(res => {
      if(res.confirm) {
        // 将被删除帖子的 status 改为 -1
        Post.doc(event.detail.id).update({data: {status: -1}})
        // 过滤被删除的帖子 更新data
        let newPostList = this.data.postList.filter(item => item._id !== event.detail.id)
        // 更新data
        this.setData({ postList: newPostList })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let { reachBottom, pageIndex } = this.data
    // 如果到底部则返回
    if(reachBottom) return
    // 分页+1
    this.setData({ pageIndex: ++pageIndex })
    // 获取数据
    this.getPostList()
  }
})
