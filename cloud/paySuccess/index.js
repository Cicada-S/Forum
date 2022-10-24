// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('event', event)

  const { returnCode, outTradeNo, totalFee } = event

  if(returnCode === 'SUCCESS') {
    // 更新云数据库的订单状态，改为已支付的状态即可
    db.collection('Reward').doc(outTradeNo).update({
      data:{
        status: 1,
        amount: totalFee,
        reward_date: new Date(),
        _openid: cloud.getWXContext().OPENID
      }
    })

    //需要返回的字段，不返回该字段则一直回调
    return {
      code: 0,
      msg: '支付成功'
    }
  }
}
