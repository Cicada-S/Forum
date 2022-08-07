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
    preview(event) {
      console.log('1231')
      let { current, urls } = event.currentTarget.dataset
      this.triggerEvent('preview', {
        current,
        urls
      })
    }
  }
})
