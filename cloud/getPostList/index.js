// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  // 排序规格
  let sort = { publish_date: -1 }
  // 筛选规格
  let screen = { status: 0 }
  // 从第几条数据开始查找 
  const skip = event.pageSize * (event.pageIndex - 1)

  // 排序 最热 
  if(event.type === 1) {
    sort = Object.assign({agree: -1}, sort)
    // 获取最近七天的数据 且点赞数量必须大于等于1
    let lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() -7)
    screen.publish_date = _.gte(lastWeek)
    screen.agree = _.gte(1)
  }
  // 筛选 圈子 搜索
  if(event.community) screen.community = event.community
  if(event.search) screen.content = db.RegExp({ regexp: event.search, options: 'i' }) // 模糊查询
  // 获取我的帖子时的用户id
  if(event.id) screen._openid = event.id

  try {
    // 联表查询
    let postList = await db.collection('Post').aggregate().match(screen)
    .sort(sort) // 排序 坑(先排序再跳过后查询)
    .skip(skip) // 跳过第n条开始查询
    .limit(event.pageSize) // 每次查询的数量
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
      data: postList.list,
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
