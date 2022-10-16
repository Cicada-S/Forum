// pages/publish/publish.js
// 引入uuid
import { uuid } from '../../utils/uuid'

Page({
  data: {
    content: '', // 文案内容
    fileList: [], // 文件列表
    community: [], // 圈子
    location: '', // 定位
    upCloudImages: [], // 云存储的图片 
    multiArray: [
      ['娱乐八卦', '二手市场', '表白墙', '失物招领', '学习交流'], 
      []
    ],
    multiIndex: [],
  },

  // 监听文案内容发生改变
  onChange(event) {
    this.setData({ content: event.detail.value })
  },

  // 文件上传前校验
  /* beforeRead(event) {
    console.log('beforeRead', event)
    const { file, callback } = event.detail
    callback(file.type === 'image')
  }, */

  // 文件读取完成
  afterRead(event) {
    let { fileList } = this.data
    fileList.push(...event.detail.file)
    this.setData({
      fileList
    })
  },

  // 删除文件
  deleteFile(event) {
    let { fileList } = this.data
    fileList.splice(event.detail.index, 1)
    this.setData({
      fileList
    })
  },

  // 点击确认时触发
  bindMultiPickerChange(event) {
    this.setData({
      multiIndex: event.detail.value
    })
    this.getPickerValue()
  },

  // picker的值发生改变时触发
  bindMultiPickerColumnChange(event) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[event.detail.column] = event.detail.value
    if(event.detail.column === 0) {
      switch (data.multiIndex[0]) {
        case 0:
          data.multiArray[1] = []
          break
        case 1:
          data.multiArray[1] = ['出售', '求购']
          break
        case 2:
          data.multiArray[1] = ['表白', '捞人', '出室友']
          break
        case 3:
          data.multiArray[1] = ['寻物', '招领']
          break
        case 4:
          data.multiArray[1] = ['求解', '提问']
          break
      }
      data.multiIndex[1] = 0
    }
    this.setData(data)
    this.getPickerValue()
  },

  // 获取选择器的值
  getPickerValue() {
    let { multiArray, multiIndex } = this.data
    let community = []

    community.push(multiArray[0][multiIndex[0]])
    if(multiArray[1][multiIndex[1]]) community.push(multiArray[1][multiIndex[1]])

    this.setData({ community })
  },

  // 获取定位
  getLocation() {
    wx.showToast({
      title: '作者在疯狂编写中...',
      icon: 'none',
      duration: 1000
    })
  },

  // 发布
  async onPublish() {
    // 判断文案和圈子是否为空
    if(!this.isEmpty()) return

    wx.showLoading({
      title: '发布中...',
    })
    // 将图片上传到云存储
    await this.upCloud(this.data.fileList)

    let { nick_name, avatar_url } = wx.getStorageSync('currentUser')
    let { content, community, upCloudImages } = this.data
    let data = { 
      content,
      upCloudImages,
      community: community[0],
      circle: community[1]?community[1]:'',
      location: '',
      author_name: nick_name,
      author_avatar: avatar_url
    }

    // 发布帖子
    await wx.cloud.callFunction({
      name: 'addPost',
      data
    }).then(res => {
      // 判断文本是否违规
      if(res.result.code === 1) {
        wx.hideLoading()
        wx.showToast({
          title: res.result.error,
          icon: 'error',
          duration: 2000
        })
      } else {
        // 清空内容
        this.setData({content: '', fileList: [], community: [], multiIndex: [], upCloudImages: []})
        wx.hideLoading()
        wx.switchTab({ url: '/pages/index/index' })
      }
    })
  },

  // 判断文案和圈子是否为空
  isEmpty() {
    const { content, community, fileList } = this.data
    if(!fileList.length && !content.trim()) {
      wx.showToast({
        title: '文案或图片不能为空!',
        icon: 'none',
        duration: 1000
      })
      return false
    } else if(!community.length) {
      wx.showToast({
        title: '圈子不能为空!',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    return true
  },

  // 将图片上传到云存储
  upCloud(imageList) {
    let worker = []
    let upCloudImages = []
    imageList.forEach((item, index) => {
      // 文件名
      let cloudPath = 'post/' + uuid() + item.url.match(/.[^.]+$/)[0]
      // uploadFile 上传图片
      let process = wx.cloud.uploadFile({
        cloudPath,
        filePath: item.url,
      }).then(res => {
        console.log(res.fileID)
        // 将返回的图片云存储路径保存起来
        upCloudImages.push({
          path: res.fileID,
          order: index
        })
        this.setData({ upCloudImages })
      })
      worker.push(process)
    })
    return Promise.all(worker)
  }
})
