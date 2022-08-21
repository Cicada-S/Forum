// index.js
const db = wx.cloud.database()
const user = db.collection('User')
const Post = db.collection('Post')

Page({
  data: {
    searchValue: '',
    active: 0,
    swiperImages: [
      '/static/images/index/xtt.jpg', 
      '/static/images/index/xtt.jpg', 
      '/static/images/index/xtt.jpg'
    ],
    newPostList: [
      {
        _id: '1',
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
            path: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2020-07-15%2F5f0ecbb7a61e2.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661779703&t=e304429f36d13f936883e0f6290bed66'
          },
          {
            _id: '2',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          },{
            _id: '3',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          },
          {
            _id: '4',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          }
        ]
      },
      {
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
      }
    ],
    hotPostList: [
      {
        _id: '1',
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
            path: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2020-07-15%2F5f0ecbb7a61e2.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661779703&t=e304429f36d13f936883e0f6290bed66'
          },
          {
            _id: '2',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          },{
            _id: '3',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          }
        ]
      },
      {
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
      }
    ]
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
  getPostList(type) {
    console.log(type)
    // 排序类型
    let dataType = type === 0 ? 'newPostList' : 'hotPostList'
    let orderType = type === 0 ? "'publish_date', 'desc'" : "'agree', 'desc'"
    console.log(dataType, orderType)
    Post.orderBy('publish_date', 'desc').get()
    .then(res => {
      console.log(res.data)
      this.setData({
        [dataType]: res.data
      })
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
