import request from '@/utils/request'

export function getExchangeList(params) {
  return request({
    url: '/exchange/list',
    method: 'get',
    params
  })
}

export function save(data) {
  return request({
    url: '/exchange/save',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/exchange/del',
    method: 'post',
    data
  })
}

