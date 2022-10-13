// components/CommentArea/CommentArea.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentList: {
      type: Array,
      value: []
    },
    commentSum: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击父评论
    replyComment(event) {
      let { id, dataset } = event.currentTarget
      this.triggerEvent('replyComment', { id, dataset })
    },

    // 点击子评论
    answerComment(event) {
      let { id, dataset } = event.currentTarget
      this.triggerEvent('answerComment', { id, dataset })
    },

    // 展开子评论
    onFold(event) {
      let { commentList } = this.data
      commentList.forEach(item => {
        if(item._id === event.target.id) item.sonIsShow = true
      })
      // 更新data
      this.setData({ commentList })
    },
  }
})
