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

    // 1. 获取收藏表

    // 2. 用收藏的post_id去查找帖子

    // 3. 同时查找post_id为该帖子的图片/视频

    AgreeCollect.aggregate().match({_openid, is_collect: true})
    .lookup()
    .sort()

    /* const postList = []
    result.data.forEach(async item => {
      const { data } = await Post.doc(item.post_id).get()
      postList.push(data)
    }) */

    this.setData({ postList })
  }
})
