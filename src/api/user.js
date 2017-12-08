import request from '@/utils/request'

export function selectData(params) {
  return request({
    url: '/user/listByPage',
    method: 'GET',
    params
  })
}

export function delectData(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function addData(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
