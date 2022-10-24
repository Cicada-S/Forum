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
    email: '202586563@qq.com',
    focus: false
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
    this.setData({
      show: true,
      focus: true
    })
  },

  // 模态框取消按钮的回调函数
  onClose() {
    this.setData({ show: false })
  },

  // 模态框支付按钮的回调函数
  onConfirm() {
    wx.showLoading({ title: '正在发起支付...' })

    const { nick_name, avatar_url } = wx.getStorageSync('currentUser')

    // 打赏表数据
    const data = {
      nick_name,
      avatar_url,
      amount: this.data.amount,
      reward_date: new Date(),
      status: 1
    }

    // 创建打赏表 发起微信支付
    Reward.add({data}).then(res => this.pay(res._id))
  },

  // 发起微信支付
  pay(rewardId) {
    // 调用支付云函数
    wx.cloud.callFunction({ name: 'pay', data:{ rewardId }})
    .then(res => {
      console.log('res', res)

      // 显示校验是否正确
      if(res.result?.code === 1) {
        wx.hideLoading()
        return wx.showToast({
          title: res.result.error,
          icon: 'none',
          duration: 3000
        })
      }

      console.info(JSON.stringify(res.result.payment))
      
      wx.hideLoading()
      // 发起微信支付
      wx.requestPayment({...res.result.payment})
      .then(() => {
        wx.showToast({
          title: '谢谢大佬的打赏！',
          icon: 'success',
          duration: 2000
        })
      })
      .catch(() => {
        wx.showToast({
          title: '支付失败！',
          icon: 'error',
          duration: 2000
        })
      })
    })
  }
})
