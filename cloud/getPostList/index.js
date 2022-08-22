// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // 筛选规格
  let screen = { publish_date: -1 }

  // 判断是否为 最热 圈子 搜索
  if(event.type === 1) screen = Object.assign({agree: -1}, screen)
  if(event.community) screen.community = event.community
  if(event.search) screen.content = event.search

  try {
    // 联表查询
    let postList = await db.collection('Post').aggregate().sort(screen)
    .match({
      status: 0
    })
    .lookup({
      from: 'PostMedia',
      let: { post_id: '$_id' },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$post_id', '$$post_id'])
        ])))
        .sort({
          order: 1,
        })
        .done(),
      as: 'postMedia'
    }).end()

    return {
      code: 0,
      data: postList.list,
      success: true
    }
  }
  catch(err) {
    console.log(err)
    console.error('transaction error')
    return {
      code: 1,
      success: false
    }
  }
}
