// components/BottomBtn/BottomBtn.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: '按钮'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bottomLift: app.globalData.bottomLift
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick() {
      this.triggerEvent('onClick')
    }
  }
})
