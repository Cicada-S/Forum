// pages/post/post.js
Page({
  data: {
    postInfo: {
      _id: '2',
      name: 'Cicada',
      text: '22-07-30 今天书籍分享:《带上她的眼睛》刘慈欣著',
      location: '佛山',
      releaseTime: '12小时前',
      partition: '娱乐八卦',
      goodJob: 60,
      chat: 10,
      picUrl: '/static/images/index/user.jpg',
      media: [
        {
          _id: '1',
          name: 'xtt.jpg',
          path: '/static/images/index/xtt.jpg'
        }
      ]
    },
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
    // 当前用户头像
    let { avatar_url } = wx.getStorageSync('currentUser')
    this.setData({ avatar_url })
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
