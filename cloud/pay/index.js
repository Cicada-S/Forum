// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const reward = db.collection('Reward').doc(event.rewardId).get()

  console.log('reward', reward.amount)

  return await cloud.unifiedOrder({
    "body": "打赏作者",
    "outTradeNo": event.rewardId, // 不能重复，否则报错
    "spbillCreateIp": "127.0.0.1", // 就是这个值，不要改
    "subMchId": "", // 你的商户号
    "totalFee": reward.amount * 100, // 单位为分 *100
    "envId": "cloud1-6gevmdvpd7d00aa4", // 填入你的云开发环境ID
    "functionName": "paySuccess", // 支付成功的回调云函数
    "nonceStr": event.rewardId, // 随便弄的32位字符串，建议自己生成
    "tradeType": "JSAPI" // 默认是JSAPI
  })
}
