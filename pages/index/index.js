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
            path: '/static/images/index/xtt.jpg'
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
  }
})
