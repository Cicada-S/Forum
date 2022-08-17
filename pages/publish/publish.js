// pages/publish/publish.js
Page({
  data: {
    content: '', // 文案内容
    fileList: [], // 文件列表
    community: [], // 圈子
    multiArray: [
      ['娱乐八卦', '二手市场', '表白墙', '失物招领', '学习交流'], 
      []
    ],
    multiIndex: [],
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
  },

  // 点击确认时触发
  bindMultiPickerChange(event) {
    console.log('picker发送选择改变,携带值为', event.detail.value)
    this.setData({
      multiIndex: event.detail.value
    })
    this.getPickerColumnChange()
  },

  // picker的值发生改变时触发
  bindMultiPickerColumnChange(event) {
    console.log('修改的列为', event.detail.column,'，值为', event.detail.value)
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[event.detail.column] = event.detail.value;
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
    console.log(data.multiIndex)
    this.setData(data)
    this.getPickerColumnChange()
  },

  // 获取选择器的值
  getPickerColumnChange() {
    let { multiArray, multiIndex } = this.data
    let community = []

    community.push(multiArray[0][multiIndex[0]])
    if(multiArray[1][multiIndex[1]]) community.push(multiArray[1][multiIndex[1]])

    this.setData({ community })
  },

  // 发布
  onPublish() {
    console.log('发布帖子')
    let { content, fileList, community } = this.data
    let data = { content, community, location: '' }
  }
})
