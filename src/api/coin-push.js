import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/coin/list',
    method: 'get',
    params
  })
}

export function save(data) {
  return request({
    url: '/coin/save',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/coin/del',
    method: 'post',
    data
  })
}

