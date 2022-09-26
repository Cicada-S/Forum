// pages/myPost/myPost.js
// 引入date
import { getdate } from '../../utils/date'

const db = wx.cloud.database()
const Post = db.collection('Post')

Page({
  data: {
    postList: [], // 帖子列表
    pageIndex: 1, // 当前分页
    pageSize: 5 // 每次获取数据数量
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
    let data = {
      id: wx.getStorageSync('currentUser')._openid,
      type: 0,
      pageIndex: this.data.pageIndex,
      pageSize: this.data.pageSize
    }
    let { result } = await wx.cloud.callFunction({
      name: 'getPostList',
      data
    })
    console.log('result', result)
    // 将发布时间改成文字
    result.data?.forEach(item => item.publish_date = getdate(item.publish_date))
    this.setData({ postList: result.data })
  },

  // 删除帖子
  onDelete(event) {
    // 将被删除帖子的 status 改为 -1
    Post.doc(event.target.id).update({data: {status: -1}})

    // 过滤被删除的帖子 更新data
    let newPostList = this.data.postList.filter(item => {
      if(item._id !== event.target.id) return item 
    })
    this.setData({ postList: newPostList })
  }
})
