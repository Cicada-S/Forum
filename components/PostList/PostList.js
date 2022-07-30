// component/PostList/PostList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posts: {
      type: Array,
      value: []
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
      let { current, urls } = event.currentTarget.dataset
      this.triggerEvent('preview', {
        current,
        urls
      })
    }
  }
})
