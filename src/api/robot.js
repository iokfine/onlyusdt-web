import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/robot/list',
    method: 'get',
    params
  })
}
export function getRobot(params) {
  return request({
    url: '/robot/query',
    method: 'get',
    params
  })
}
export function robotStatus(params) {
  return request({
    url: '/robot/status/query',
    method: 'get',
    params
  })
}
export function robotLogs(params) {
  return request({
    url: '/robot/logs/query',
    method: 'get',
    params
  })
}
export function robotProfit(params) {
  return request({
    url: '/robot/profit/query',
    method: 'get',
    params
  })
}

export function save(data) {
  return request({
    url: '/robot/save',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/robot/del',
    method: 'post',
    data
  })
}
export function delLogs(data) {
  return request({
    url: '/robot/logs/del',
    method: 'post',
    data
  })
}
export function start(data) {
  return request({
    url: '/robot/start',
    method: 'post',
    data
  })
}
export function command(data) {
  return request({
    url: '/robot/command',
    method: 'post',
    data
  })
}
export function delRobotProfit(data) {
  return request({
    url: '/robot/profit/del',
    method: 'post',
    data
  })
}

