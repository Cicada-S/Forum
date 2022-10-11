// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const _openid = cloud.getWXContext().OPENID

  try {
    // 1. 获取收藏表
    let { data } = await db.collection('AgreeCollect').where({_openid, is_collect: true}).get()

    let worker = []
    data.forEach(item => {
      // 2. 用收藏的post_id去查找帖子
      let process = db.collection('Post').aggregate().match({_id: item.post_id, status: 0})
      // 3. 同时查找post_id为该帖子的图片/视频
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
      worker.push(process)
    })

    let collection = []
    // 将获取到的数据解析出来
    await Promise.all(worker).then(res => {
      res.forEach(item => collection.push(item.list[0]))
    })

    return {
      code: 0,
      data: collection,
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
