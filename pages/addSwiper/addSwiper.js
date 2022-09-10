// pages/addSwiper/addSwiper.js
// 引入uuid
import { uuid } from '../../utils/uuid'

const db = wx.cloud.database()
const Information = db.collection('Information')

Page({
  data: {
    remarks: '',
    fileList: [],
  },

  // 文件读取完成后执行
  afterRead(event) {
    this.setData({ fileList: [event.detail.file] })
  },

  // 添加资讯
  async onClick() { 
    // 判断备注和图片是否为空
    if(!this.isEmpty()) return

    const { remarks, fileList } =  this.data
    // 文件名
    const cloudPath = 'swiper/' + uuid() + fileList[0].url.match(/.[^.]+$/)[0]
    // 将图片上传到云空间
    const result = await wx.cloud.uploadFile({
      cloudPath,
      filePath: fileList[0].url
    })

    console.log('result', result)
    Information.add({data: {
      path: result,
      upload_date: new Date(),
      remarks
    }}).then(res => {
      console.log('res', res)
    })
  },

  // 判断备注和图片是否为空
  isEmpty() {
    const { remarks, fileList } =  this.data
    if(!remarks.trim()) {
      wx.showToast({
        title: '备注不能为空!',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if(!fileList.length) {
      wx.showToast({
        title: '图片不能为空!',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    return true
  }
})
