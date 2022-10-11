// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 联表查询
    let post = await db.collection('Post').aggregate().match({_id: event.id, status: 0})
    .lookup({
      from: 'PostMedia',
      let: { post_id: '$_id' },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$post_id', '$$post_id'])
        ])))
        .sort({ order: 1 })
        .done(),
      as: 'postMedia'
    }).end()

    return {
      code: 0,
      data: post.list[0],
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
