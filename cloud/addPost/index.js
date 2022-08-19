// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event)
    let { content, community, location, upCloudImages } = event

    let post = {
      _openid: cloud.getWXContext().OPENID,
      content,
      community,
      location,
      publish_date: new Date(),
      status: 0,
      agree: 0,
      collection: 0,
      comment: 0
    }

    // 添加帖子
    db.collection('Post').add({ data: post })
    .then(res => {
      console.log(res)

      // 遍历图片添加到数据表中
      upCloudImages.forEach(item => {
        item.post_id = res._id
        db.collection('PostMedia').add({ data: item })
      })
    })

    return {
      code: 0,
      success: true
    }
  }
  catch(err) {
    console.error('transaction error')
    return {
      code: 1,
      success: false
    }
  }
}
