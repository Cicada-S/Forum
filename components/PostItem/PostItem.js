// components/PostItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    postItem: {
      type: Object,
      value: {}
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
    // 预览图片
    preview(event) {
      let { current, urls } = event.currentTarget.dataset
      this.triggerEvent('preview', {
        current,
        urls
      })
    },

    // 点赞
    fabulous(event) {
      this.triggerEvent('fabulous', {
        id: event.currentTarget.id
      })
    }
  }
})
