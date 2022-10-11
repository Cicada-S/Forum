// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // userInfo结构出来是因为在手机上发布帖子会携带该属性到数据表中
  let { userInfo, upCloudImages, ...data } = event
  try {
    // 文本内容安全检测
    const msgSecCheckRes = await cloud.callFunction({
      name: 'msgSecCheck',
      data: { text: data.content }
    })

    // 判断文本是否违规
    if(msgSecCheckRes.result.errcode != 0) {
      return {
        code: 1,
        error: '文字內容违规',
        success: false
      }
    }

    let post = {
      _openid: cloud.getWXContext().OPENID,
      ...data,
      publish_date: new Date(),
      status: 0,
      agree: 0,
      comment: 0
    }

    // 添加帖子
    db.collection('Post').add({ data: post })
    .then(res => {
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
