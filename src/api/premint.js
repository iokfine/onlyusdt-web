import request from '@/utils/request'

export function getPremintUserlist(  params) {
  return request({
    url: '/premint/user/list',
    method: 'get',
    params
  })
}

export function updatePremintUser( data) {
  return request({
    url: '/premint/user/update',
    method: 'post',
    data
  })
}
