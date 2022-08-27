// pages/post/post.js
// 引入date
const { getdate } = require('../../utils/date.js')

const db = wx.cloud.database()
let post = db.collection('Post')

Page({
  data: {
    postInfo: {},
    commentSum: 3, // 评论数量
    avatar_url: '', // 当前用户头像
    commentList: [ // 评论列表
      {
        _id: 'fp1', // 主键
        post_id: '2', // 帖子Id
        _openid: '159', // 评论者ID
        nickName: 'Ting', // 评论者昵称
        avatarUrl: '/static/images/index/xtt.jpg', // 评论者头像
        comment: '少年不惧岁月长', // 评论内容
        time: '3小时前', // 评论时间
        comment_identity: 1, // 是否为作者
        agree: 0, // 点赞数量
        child_comment: [ // 子评
          {
            _id: 'zp1', // 主键
            _openid: '150', // 评论者ID
            parent_id: 'fp1', // 回复的父评ID
            reply_type: 0, // 评论的类型
            to_uid: '159', // 被回复者ID
            to_nickName: 'Ting', // 被回复者昵称
            nickName: 'Cicada', //  评论者昵称
            avatarUrl: '/static/images/index/user.jpg', // 评论者头像
            comment: '彼方尚有荣光在', // 评论内容
            time: '2小时前', // 评论时间
            comment_identity: 0, // 是否为作者
            agree: 0, // 点赞数量
          },
          {
            _id: 'zp2', // 主键
            _openid: '159', // 评论者ID
            parent_id: 'zp1', // 回复的父评ID
            reply_type: 1, // 评论的类型
            to_uid: '150', // 被回复者ID
            to_nickName: 'Cicada', // 被回复者昵称
            nickName: 'Ting', //  评论者昵称
            avatarUrl: '/static/images/index/xtt.jpg', // 评论者头像
            comment: '劝君须取少年时', // 评论内容
            time: '1小时前', // 评论时间
            comment_identity: 1, // 是否为作者
            agree: 0, // 点赞数量
          }
        ]
      }
    ]
  },

  /**
   * 页面加载
   */
  onLoad(options) {
    this.getPostInfo(options.id)
    // 当前用户头像
    let { avatar_url } = wx.getStorageSync('currentUser')
    this.setData({ avatar_url })
  },

  // 获取帖子详情信息
  async getPostInfo(id) {
    // 获取帖子
    let { result } = await wx.cloud.callFunction({
      name: 'getPostInfo',
      data: { id }
    })
    // 将发布时间改成文字
    result.data.publish_date = getdate(result.data.publish_date)
    this.setData({ postInfo: result.data })
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
