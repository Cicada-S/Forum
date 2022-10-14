// index.js
// 引入date
import { getdate } from '../../utils/date'

const db = wx.cloud.database()
const user = db.collection('User')
const Post = db.collection('Post')
const Information = db.collection('Information')
const AgreeCollect = db.collection('AgreeCollect')

Page({
  data: {
    searchValue: '', // 搜索框
    active: 0, // tab的状态
    swiperImages: [], // 轮播图
    newPostList: [], // 最新
    hotPostList: [], // 最热
    newPageIndex: 1, // 最新 当前分页
    hotPageIndex: 1, // 最热 当前分页
    pageSize: 5, // 每次获取数据数量
    newReachBottom: false, // 是否到底部
    hotReachBottom: false // 是否到底部
  },

  /**
   * 页面加载
   */
  onLoad() {
    // 判断用户是否登录过
    this.getUserInfo()
    // 获取资讯轮播图
    this.getInformation()
    // 获取帖子列表
    this.getPostList(0)
    this.getPostList(1)
  },

  // 获取资讯轮播图
  async getInformation() {
    let { data } = await Information.where({status: 0}).orderBy('upload_date', 'desc').get()
    let swiperImages = data.map(item => item.path)
    this.setData({ swiperImages })
  },

  // 获取帖子列表
  async getPostList(type) {
    let dataType = !type ? 'newPostList' : 'hotPostList'
    let { searchValue, pageSize, newPageIndex, hotPageIndex, newPostList, hotPostList } = this.data
    let data = { type, pageSize }

    // 搜索内容
    if(searchValue) data.search = searchValue
    // 当前分页
    data.pageIndex = !type ? newPageIndex : hotPageIndex

    // 发起请求获取帖子
    let { result } = await wx.cloud.callFunction({
      name: 'getPostList',
      data
    })

    // 如果没有数据了则将 reachBottom 设为 true
    if(!type && !result.data.length) {
      this.setData({ newReachBottom: true })
    } else if(type && !result.data.length) {
      this.setData({ hotReachBottom: true })
    }
    
    // 将发布时间改成文字
    result.data?.forEach(item => item.publish_date = getdate(item.publish_date))

    let postList = result.data.length ? result.data : []
    // 如果pageIndex大于1则 unshift 到该类型的数据中
    if(!type && newPageIndex > 1) {
      postList = newPostList.concat(result.data)
    } else if(type && hotPageIndex > 1) {
      postList = hotPostList.unshift(result.data)
    }
    // 更新data
    this.setData({[dataType]: postList})
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

  // 确认搜索时触发
  onSearch() {
    this.getPostList(this.data.active)
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
    // this.getPostList(event.detail.name)
  },

  // 点赞的处理函数
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
    let type = this.data.active === 0 ? 'newPostList' : 'hotPostList'
     // 查找出点赞的这条数据
    let postList = this.data[type].map(item => {
      if(item._id === id) {
        // 当点赞图标为 非活跃状态 并且为取消点赞时 弹出取消点赞
        if(!item.is_agree && operator === '-') wx.showToast({
          title: '取消点赞',
          icon: 'none',
          duration: 1000
        })
        // 更新点赞数量 和点赞icon状态
        if(operator === '+') {
          item.agree += 1
          item.is_agree = true
        } else {
          item.agree -= 1
          item.is_agree = false
        }
        // 更新数据表
        Post.doc(id).update({data:{ agree: item.agree }})
      }
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
  },

  /**
   * 页面下拉刷新的处理函数
   */
  onPullDownRefresh() {
    if(this.data.active == 0) {
      this.setData({ newPostList: [], newPageIndex: 1, newReachBottom: false })
    } else {
      this.setData({ hotPostList: [], hotPageIndex: 1, hotReachBottom: false })
    }
    this.getPostList(this.data.active)
  },

  /**
   * 页面上拉触底的处理函数
   */
  onReachBottom() {
    let { newReachBottom, hotReachBottom, newPageIndex, hotPageIndex, active } = this.data

    // 判断当前为最新/最热
    if(!active) {
      // 如果到底部则返回
      if(newReachBottom) return
      // 分页+1
      this.setData({ newPageIndex: ++newPageIndex })
      // 获取数据
      this.getPostList(active)
    } else {
      // 如果到底部则返回
      if(hotReachBottom) return
      // 分页+1
      this.setData({ hotPageIndex: ++hotPageIndex })
      // 获取数据
      this.getPostList(active)
    }
  }
})
