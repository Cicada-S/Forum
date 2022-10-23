// pages/aboutUs/aboutUs.js
const db = wx.cloud.database()
const Administrator = db.collection('Administrator')
const Reward = db.collection('Reward')

Page({
  data: {
    authorInfo: {},
    show: false,
    amount: 10,
    authorInt: '小苏同学，18届计算机专业学生',
    introduce: '校园论坛是一个信息的港湾，它集结了许许多多的内容，为有共同爱好的同学创造了另一片交流的空间。',
    email: '202586563@qq.com'
  },

  /**
   * 页面加载
   */
  onLoad() {
    Administrator.doc('058dfefe630cb5b2174ca4fc61630491').get()
    .then(res => {
      this.setData({ authorInfo: res.data })
    })
  },

  // 打赏、鼓励作者
  encourage() {
    this.setData({ show: true })
  },

  // 模态框取消按钮的回调函数
  onClose() {
    this.setData({ show: false })
  },

  // 模态框支付按钮的回调函数
  onConfirm() {
    console.log('支付 ')
    const { nick_name, avatar_url } = wx.getStorageSync('currentUser')

    const data = {
      nick_name,
      avatar_url,
      amount: this.data.amount,
      reward_date: new Date()
    }

    Reward.add(data).then(res => {
      console.log('res', res)
    })
  }
})
