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
    }
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
