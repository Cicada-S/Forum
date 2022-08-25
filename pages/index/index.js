// index.js
// 引入date
const { getdate } = require('../../utils/date.js')

const db = wx.cloud.database()
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
    let data = { type }
    let dataType = type === 0 ? 'newPostList' : 'hotPostList'

    // 发起请求获取帖子
    let { result } = await wx.cloud.callFunction({
      name: 'getPostList',
      data
    })
    // 将发布时间改成文字
    result.data.forEach(item => item.publish_date = getdate(item.publish_date))

    this.setData({
      [dataType]: result.data
    })
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

  // 跳转到圈子
  toCircle(event) {
    wx.navigateTo({
      url: `/pages/circle/circle?id=${event.currentTarget.id}`
    })
  },

  // 切换标签栏
  onChange(event) {
    this.setData({ active: event.detail.name })
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

  // 点赞的处理函数
  fabulous(event) {
    // 更新数据表
    Post.doc(event.detail.id).update({data:{ agree: item.agree }})
    
    let type = this.data.active === 0 ? 'newPostList' : 'hotPostList'
    // 查找出点赞的这条数据
    let postList = this.data[type].map(item => {
      // 点赞数量加一
      if(item._id === event.detail.id) item.agree += 1
      return item
    })
    // 更新data
    this.setData({ [type]: postList })
  },

  // 跳转到帖子详情
  toPost(event) {
    wx.navigateTo({
      url: `/pages/post/post?id=${event.currentTarget.id}`
    })    
  }
})
