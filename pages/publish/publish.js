// pages/publish/publish.js
Page({
  data: {
    content: '', // 文案内容
    fileList: [], // 文件列表
  },

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
  }
})
