import request from '@/utils/request'

export function selectGoods(params) {
  return request({
    url: '/shopping/listByPage',
    method: 'GET',
    params
  })
}

export function selGoodsById(params) {
  return request({
    url: '/goods/getModelById',
    method: 'GET',
    params
  })
}

export function delGoods(data) {
  return request({
    url: '/goods/delete',
    method: 'post',
    data
  })
}

export function updateGoods(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data
  })
}

export function addGoods(data) {
  return request({
    url: '/goods/add',
    method: 'post',
    data
  })
}
