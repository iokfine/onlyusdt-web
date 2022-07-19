import request from '@/utils/request'

export function getVerifyCode(data) {
  return request({
    url: '/mail/verifyCode',
    method: 'post',
    data
  })
}
