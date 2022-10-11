// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // 联表查询
  let result = await db.collection('FatherComment').aggregate().match({post_id: event.id})
  .sort({comment_date: -1})
  .lookup({
    from: 'SonComment',
    let: { parent_id: '$_id' },
    pipeline: $.pipeline()
      .match(_.expr($.and([
        $.eq(['$parent_id', '$$parent_id'])
      ])))
      .sort({ comment_date: 1 })
      .done(),
    as: 'child_comment'
  }).end()

  return {
    code: 0,
    data: result.list,
    success: true
  }
}
