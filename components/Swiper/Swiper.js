// components/Swiper/Swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    indicatorColor: 'rgba(64,127,245, .3)',
    indicatorActiveColor: '#407FF5',
    interval: 5000,
    duration: 500,
    previousMargin: '20px',
    nextMargin: '15px'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
