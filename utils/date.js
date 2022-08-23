function getdate(data) {
  // 当前时间标准化
  let now = new Date()
  const nowday = now.getDate()
  const nowhour = now.getHours()
  const nowminute = now.getMinutes()
  const nowsecond = now.getSeconds()
  let todaysec = nowhour * 60 * 60 + nowminute * 60 + nowsecond

  // 时间标准化
  data = new Date(data)
  const year = data.getFullYear()
  const month = data.getMonth() + 1
  const day = data.getDate()
  const hour = data.getHours()
  const minute = data.getMinutes()
  const second = data.getSeconds()

  let miao = parseInt((now - data) / 1000)
  //一小时以内的
  if (miao < 60) {
    return '1分钟内'
  } else if (miao >= 60 && miao < 3600) {
    return (nowminute - minute) + '分钟前'
  } else if (miao >= 3600 && miao <= todaysec) {
    return (nowhour - hour) + '小时前'
  } else if (miao > todaysec && miao < todaysec + 86400) {
    return '昨天'
  } else {
    return [year - 2000, month, day].map(formatNumber).join('-')
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  getdate
}
