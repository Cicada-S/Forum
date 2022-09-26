// pages/swiperAdmin/swiperAdmin.js
const app = getApp()

// 引入date
import { getdate } from '../../utils/date'

const db = wx.cloud.database()
const Information = db.collection('Information')

Page({
  data: {
    bottomLift: app.globalData.bottomLift,
    informationList: []
  },

  /**
   * 页面显示
   */
  onShow() {
    // 获取资讯
    this.getInformation()
  },

  // 获取资讯
  async getInformation() {
    let { data } = await Information.orderBy('upload_date', 'desc').orderBy('status', 'asc').get()
    // 将时间改成文字
    data.forEach(item => item.upload_date = getdate(item.upload_date))
    this.setData({ informationList: data })
  },

  // 跳转到添加资讯
  onClick() {
    wx.navigateTo({
      url: '/pages/addSwiper/addSwiper'
    })
  }
})
