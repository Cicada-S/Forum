// index.js
Page({
  data: {
    searchValue: '',
    active: 0,
    partition: [
      {
        id: '1',
        text: '娱乐八卦',
        icon: 'photo-o'
      },
      {
        id: '2',
        text: '二手市场',
        icon: 'photo-o'
      },
      {
        id: '3',
        text: '表白墙',
        icon: 'photo-o'
      },
      {
        id: '4',
        text: '失物招领',
        icon: 'photo-o'
      },
      {
        id: '5',
        text: '学习交流',
        icon: 'photo-o'
      }
    ]
  },

  onChange(event) {
    console.log(event.detail.name)
  },
})
