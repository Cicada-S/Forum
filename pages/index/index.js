// index.js
// 引入date
const { getdate } = require('../../utils/date.js')

const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
const user = db.collection('User')
const Post = db.collection('Post')

Page({
  data: {
    searchValue: '', // 搜索框
    active: 0, // tab的状态
    swiperImages: [ // 轮播图
      '/static/images/index/xtt.jpg', 
      '/static/images/index/xtt.jpg', 
      '/static/images/index/xtt.jpg'
    ],
    newPostList: [], // 最新
    hotPostList: [] // 最热
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 判断用户是否登录过
    this.getUserInfo()
    // 获取帖子列表
    this.getPostList(0)
  },

  // 获取帖子列表
  async getPostList(type) {
    // 排序类型 
    // let dataType = type === 0 ? 'newPostList' : 'hotPostList'
    // let orderType = type === 0 ? "'publish_date', 'asc'" : "'agree', 'desc'"

    // 获取post
    Post.orderBy('publish_date', 'desc').get()
    .then(res => {
      res.data.map(item => item.publish_date = getdate(item.publish_date))
      this.setData({
        newPostList: res.data
      })
    })

    // 联表查询
    /* Post.aggregate().sort({ publish_date: -1 }).match({ status: 1 })
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
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    }) */
  },

  // 判断用户是否登录过
  getUserInfo() {
    user.get().then(res => {
      if(res.data.length === 1) {
        wx.setStorageSync('currentUser', res.data[0])
      } else {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    })
  },

  // 切换标签栏
  onChange(event) {
    this.getPostList(event.detail.name)
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

  // 跳转到帖子详情
  toPost(event) {
    wx.navigateTo({
      url: `/pages/post/post?id=${event.currentTarget.id}`
    })    
  }
})
