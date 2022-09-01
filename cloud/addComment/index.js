// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  let data = {...event}
  try {
    if(data.parent_id) {
      let result = await db.collection('SonComment').add({data})
      return {
        code: 0,
        data: result._id,
        success: true      
      }
    } else {
      result = await db.collection('FatherComment').add({data})
      return {
        code: 0,
        data: result._id,
        success: true      
      }
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
