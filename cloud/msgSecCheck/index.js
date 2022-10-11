// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const appid = 'wx188726951a6b10b2' // AppId
const appsecret = '2b8f007972abe6dd1a5502a532c09b62' // 小程序唯一凭证密钥

// 获取 access_token 值
let tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecret
// 文本内容检测接口
let checkUrl = 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token='

// 云函数入口函数
exports.main = async (event, context) => {
  const tokenResponse = await got(tokenUrl) // 通过 got 请求 api
  const token = JSON.parse(tokenResponse.body).access_token // JSON.parse 将数据转换成对象获取到具体 access_token 值
  // 文本内容检测接口拼接 access_token 值, JSON.stringIfy 将值转换成 JSON 字符串
  let checkResponse = await got(checkUrl + token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'json',
      'accept-encoding': ''
    },
    body: JSON.stringify({
      content: event.text
    })
  })
  return checkResponse.body
}
