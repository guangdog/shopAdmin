import request from '@/utils/request'

export function selectBanner() {
  return request({
    url: '/banner/list',
    method: 'GET'
  })
}

export function delectBanner(data) {
  return request({
    url: '/banner/delete',
    method: 'post',
    data
  })
}

export function addBanner(data) {
  return request({
    url: '/banner/add',
    method: 'post',
    data
  })
}

export function updateBanner(data) {
  return request({
    url: '/banner/update',
    method: 'post',
    data
  })
}

export function getBannerById(params) {
  return request({
    url: '/banner/getModelById',
    method: 'get',
    params
  })
}
