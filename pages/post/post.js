// pages/post/post.js
let app = getApp()

// 引入date
import { getdate } from '../../utils/date'

const db = wx.cloud.database()
const Post = db.collection('Post')
const AgreeCollect = db.collection('AgreeCollect')

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
    commentList: [] // 评论列表
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
      item.child_comment.forEach(child => {
        child.comment_date = getdate(child.comment_date)
      })
    })
    this.setData({ commentList: result.data })
  },

  // 点赞帖子的回调函数
  async fabulous(event) {
    // 查看点赞收藏表
    let result = await AgreeCollect.where({
      _openid: wx.getStorageSync('currentUser')._openid,
      post_id: event.detail.id
    }).get()

    // 判断之前是否创建过该帖子的数据表
    if(!result.data.length) {
      // 如果没有该数据表 则创建数据表
      AgreeCollect.add({data: { post_id: event.detail.id, is_agree: true, is_collect: false }})
      // 更新点赞数据
      this.agreeUpdata(event.detail.id, '+')
    } else {
      // 如果有该数据表 则判断是否已经点赞过
      if(result.data[0].is_agree) {
        // 如果点赞过 则取消点赞
        AgreeCollect.doc(result.data[0]._id).update({data: { is_agree: false }})
        // 更新点赞数据
        this.agreeUpdata(event.detail.id, '-')
      } else {
        // 如果没点赞过 则点赞
        AgreeCollect.doc(result.data[0]._id).update({data: { is_agree: true }})
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
    let result = await AgreeCollect.where({
      _openid: wx.getStorageSync('currentUser')._openid,
      post_id: event.detail.id
    }).get()
    
    // 判断之前是否创建过该帖子的数据表
    if(!result.data.length) {
      // 如果没有该数据表 则创建数据表
      AgreeCollect.add({data: { post_id: event.detail.id, is_agree: false, is_collect: true }})
      // 更新data
      this.setData({['postInfo.is_collect']: true})
    } else {
      // 如果有该数据表 则判断是否已经收藏过
      if(result.data[0].is_collect) {
        // 如果收藏过 则取消收藏
        AgreeCollect.doc(result.data[0]._id).update({data: { is_collect: false }})
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
        AgreeCollect.doc(result.data[0]._id).update({data: { is_collect: true }})
        // 更新data
        this.setData({['postInfo.is_collect']: true})
      }
    }
  },

  // 评论框失去焦点时触发
  onBlur() {
    if(!this.data.value) {
      this.setData({
        commentType: false,
        placeholder: '喜欢就给个评论支持一下~'
      })
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

    // 更新帖子的评论数量
    let postInfo = this.data.postInfo
    postInfo.comment = ++postInfo.comment
    Post.doc(postInfo._id).update({data:{ comment: postInfo.comment }})
    this.setData({
      postInfo,
      focus: false,
      commentType: false,
      placeholder: '喜欢就给个评论支持一下~'
    })
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
      data.child_comment = [] // 添加上child_comment属性 否则子评会报错
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
    let { id, dataset } = event.detail

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
    let { id, dataset } = event.detail

    this.setData({
      focus: true,
      placeholder: `回复 @${dataset.name}`,
      commentType: true,
      to_uid: dataset._openid,
      to_nick_name: dataset.name,
      reply_type: 1,
      parent_id: id
    })
  },

  /**
   * 用户点击右上角转发
   */
  onShareAppMessage() {
    let { author_name, content } = this.data.postInfo
    let title = `@${author_name}: ${content}`
    return { title }
  }
})
