/**
 * @param {string} str
 * @returns {Boolean}
 */
export function aroundTime(startTime) {
  if (!startTime) {
    return ''
  }
  let diffie = (new Date() - new Date(startTime)) / 1000; //计算时间差,并把毫秒转换成秒
  let days = parseInt(diffie / 86400); // 天  24*60*60*1000
  let hours = parseInt(diffie / 3600) - 24 * days; // 小时 60*60 总小时数-过去的小时数=现在的小时数
  let minutes = parseInt(diffie % 3600 / 60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
  let seconds = parseInt(diffie % 60); // 以60秒为一整份 取余 剩下秒数
  let daystr = ''
  let hourstr = ''
  let minutesstr = ''
  if (days !== 0) {
    daystr = days + "天"
  }
  if (hours !== 0) {
    hourstr = hours + "小时"
  }
  if (minutes !== 0) {
    minutesstr = minutes + "分钟"
  }
  return daystr + hourstr + minutesstr + seconds + "秒" + '前'
}
