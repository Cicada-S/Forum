// pages/collection/collection.js
const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
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
    let { data } = await   AgreeCollect.where({_openid, is_collect: true}).get()
    console.log('data', data)

    data.forEach(async item => {
      // 2. 用收藏的post_id去查找帖子
      let result = await Post.aggregate().match({_id: item.post_id, status: 0})
      // 3. 同时查找post_id为该帖子的图片/视频
      .lookup({
        from: 'PostMedia',
        let: { post_id: '$_id' },
        pipeline: $.pipeline()
          .match(_.expr($.and([
            $.eq(['$post_id', '$$post_id'])
          ])))
          .sort({
            order: 1,
          })
          .done(),
        as: 'postMedia'
      }).end()

      console.log('result', result)
    })

    // this.setData({ postList })
  }
})
