// pages/post/post.js
let app = getApp()

// 引入date
const { getdate } = require('../../utils/date.js')

const db = wx.cloud.database()
const Post = db.collection('Post')
const agreeCollect = db.collection('agreeCollect')

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    postInfo: {},
    value: '', // 评论
    focus: false, // 评论框焦点
    commentType: false, // false 为父评
    placeholder: '喜欢就给个评论支持一下~', // 评论框占位符
    to_uid: '', // 被评论者id
    to_nick_name: '', // 被评论者昵称
    reply_type: 0, // 0: 子评 1: 回复
    parent_id: '', // 父评id
    commentSum: 3, // 评论数量
    commentList: [ // 评论列表
      {
        _id: 'fp1', // 主键
        post_id: '2', // 帖子Id
        _openid: '159', // 评论者ID
        nick_name: 'Ting', // 评论者昵称
        avatar_url: '/static/images/index/xtt.jpg', // 评论者头像
        comment_details: '少年不惧岁月长', // 评论内容
        comment_date: '3小时前', // 评论时间
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
            parent_id: 'fp1', // 回复的父评ID
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
    // 获取帖子详情信息
    this.getPostInfo(options.id)
    // 获取评论
    this.getComment(options.id)
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

  // 获取评论
  async getComment(id) {
    let { result } = await wx.cloud.callFunction({
      name: 'getComment',
      data: { id }
    })

    // 将发布时间改成文字
    result.data.forEach(item => {
      item.comment_date = getdate(item.comment_date)
    })
    this.setData({ commentList: result.data })
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

  // 点赞帖子的回调函数
  async fabulous(event) {
    // 查看点赞收藏表
    let result = await agreeCollect.where({
      _openid: wx.getStorageSync('currentUser')._openid,
      post_id: event.detail.id
    }).get()

    // 判断之前是否创建过该帖子的数据表
    if(!result.data.length) {
      // 如果没有该数据表 则创建数据表
      agreeCollect.add({data: { post_id: event.detail.id, is_agree: true, is_collect: false }})
      // 更新点赞数据
      this.agreeUpdata(event.detail.id, '+')
    } else {
      // 如果有该数据表 则判断是否已经点赞过
      if(result.data[0].is_agree) {
        // 如果点赞过 则取消点赞
        agreeCollect.doc(result.data[0]._id).update({data: { is_agree: false }})
        // 更新点赞数据
        this.agreeUpdata(event.detail.id, '-')
      } else {
        // 如果没点赞过 则点赞
        agreeCollect.doc(result.data[0]._id).update({data: { is_agree: true }})
        // 更新点赞数据
        this.agreeUpdata(event.detail.id, '+')
      }
    }
  },

  // 更新点赞数据
  agreeUpdata(id, operator) {
    let postInfo = this.data.postInfo
    // 当点赞图标为 非活跃状态 并且为取消点赞时 弹出取消点赞
    if(!postInfo.is_agree && operator === '-') wx.showToast({
      title: '取消点赞',
      icon: 'none',
      duration: 1000
    })
    // 更新点赞数量 和点赞icon状态
    if(operator === '+') {
      postInfo.agree += 1
      postInfo.is_agree = true
    } else {
      postInfo.agree -= 1
      postInfo.is_agree = false
    }
    // 更新数据表
    Post.doc(id).update({data:{ agree: postInfo.agree }})
    // 更新data
    this.setData({ postInfo })
  },

  // 收藏帖子的回调函数
  async collect(event) {
    // 查看点赞收藏表
    let result = await agreeCollect.where({
      _openid: wx.getStorageSync('currentUser')._openid,
      post_id: event.detail.id
    }).get()
    
    // 判断之前是否创建过该帖子的数据表
    if(!result.data.length) {
      // 如果没有该数据表 则创建数据表
      agreeCollect.add({data: { post_id: event.detail.id, is_agree: false, is_collect: true }})
      // 更新data
      this.setData({['postInfo.is_collect']: true})
    } else {
      // 如果有该数据表 则判断是否已经收藏过
      if(result.data[0].is_collect) {
        // 如果收藏过 则取消收藏
        agreeCollect.doc(result.data[0]._id).update({data: { is_collect: false }})
        // 当收藏图标为 非活跃状态 弹出取消收藏
        if(!this.data.postInfo.is_collect) wx.showToast({
          title: '取消收藏',
          icon: 'none',
          duration: 1000
        })
        // 更新data
        this.setData({['postInfo.is_collect']: false})
      } else {
        // 如果没收藏过 则收藏
        agreeCollect.doc(result.data[0]._id).update({data: { is_collect: true }})
        // 更新data
        this.setData({['postInfo.is_collect']: true})
      }
    }
  },

  // 评论
  hairComment() {
    console.log(this.data.value)
    let { commentType } = this.data

    if(commentType) {
      // 子级评论
      this.sonComment()
    }else {
      // 父级评论
      this.fatherComment()
    }
  },

  // 父级评论
  fatherComment() {
    console.log('父级评论')
    let { value, commentList, postInfo } = this.data
    let userInfo = wx.getStorageSync('currentUser')

    let data = {
      post_id: postInfo._id,
      _openid: userInfo._openid,
      nick_name: userInfo.nick_name,
      avatar_url: userInfo.avatar_url,
      comment_date: new Date(),
      comment_details: value,
      comment_identity: postInfo._openid === userInfo._openid ? 0 : 1,
      agree: 0
    }

    wx.cloud.callFunction({
      name: 'addComment',
      data
    }).then(res => {
      data._id = res.result.data
      data.comment_date = getdate(data.comment_date)
      commentList.unshift(data)
      // 更新data
      this.setData({ commentList, value: '' })
    })
  },

  // 子级评论
  sonComment() {
    console.log('子级评论')
    let { value, commentList, postInfo, to_uid, to_nick_name, reply_type, parent_id } = this.data
    let userInfo = wx.getStorageSync('currentUser')

    let data = {
      post_id: postInfo._id,
      _openid: userInfo._openid,
      nick_name: userInfo.nick_name,
      avatar_url: userInfo.avatar_url,
      comment_date: new Date(),
      comment_details: value,
      comment_identity: postInfo._openid === userInfo._openid ? 0 : 1,
      agree: 0,
      to_uid,
      to_nick_name,
      reply_type,
      parent_id
    }

    wx.cloud.callFunction({
      name: 'addComment',
      data
    }).then(res => {
      data._id = res.result.data
      data.comment_date = getdate(data.comment_date)
      // 将子评添加到指定的父评下
      commentList.forEach(item => {
        if(item._id === parent_id) {
          item.child_comment.push(data)
        }
      })
      // 更新data
      this.setData({ commentList, value: '' })
    })
  },

  // 点击父级评论 的回调函数
  replyComment(event) {
    let { id, dataset } = event.currentTarget

    this.setData({ 
      focus: true,
      placeholder: `回复 @${dataset.name}`,
      commentType: true,
      to_uid: dataset._openid,
      to_nick_name: dataset.name,
      reply_type: 0,
      parent_id: id
    })
  },

  // 点击子级评论 的回调函数
  answerComment(event) {
    let { id, dataset } = event.currentTarget

    this.setData({
      focus: true,
      placeholder: `回复 @${dataset.name}`,
      commentType: true,
      to_uid: dataset._openid,
      to_nick_name: dataset.name,
      reply_type: 1,
      parent_id: id
    })
  }
})
