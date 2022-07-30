// index.js
Page({
  data: {
    searchValue: '',
    active: 0,
    posts: [
      {
        id: '1',
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
            id: '1',
            name: 'xtt.jpg',
            path: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F2020-07-15%2F5f0ecbb7a61e2.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661779703&t=e304429f36d13f936883e0f6290bed66'
          },
          {
            id: '2',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          },{
            id: '3',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          },
          {
            id: '4',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          },
          {
            id: '4',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          },
          {
            id: '4',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          },
          {
            id: '4',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          },
          {
            id: '4',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          },
          {
            id: '4',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          }
        ]
      },
      {
        id: '2',
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
            id: '1',
            name: 'xtt.jpg',
            path: '/static/images/index/xtt.jpg'
          }
        ]
      }
    ]
  },

  // 切换标签栏
  onChange(event) {
    console.log(event.detail.name)
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
