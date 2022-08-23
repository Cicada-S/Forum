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
  // 排序规格
  let sort = { publish_date: -1 }
  // 筛选规格
  let screen = { status: 0 }

  // 排序 最热 
  if(event.type === 1) sort = Object.assign({agree: -1}, sort)
  // 筛选 圈子 搜索
  if(event.community) screen.community = event.community
  if(event.search) screen.content = event.search

  try {
    // 联表查询
    let postList = await db.collection('Post').aggregate().sort(sort).match(screen)
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
