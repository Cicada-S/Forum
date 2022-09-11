// pages/collection/collection.js
const db = wx.cloud.database()
const AgreeCollect = db.collection('AgreeCollect')
const Post = db.collection('Post')

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
    const _openid = wx.getStorageSync('currentUser')._openid
    const result = await AgreeCollect.where({_openid, is_collect: true}).get()

    const postList = []
    result.data.forEach(async item => {
      const { data } = await Post.doc(item.post_id).get()
      postList.push(data)
    })
    console.log('postList',postList)
    this.setData({ postList })
  }
})
