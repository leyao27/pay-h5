import request from './request'

export function getMerchantInfo(merchantCode) {
  return request.get('/merchant/info', { params: { merchantCode } })
}

export function unifiedOrder(data) {
  return request.post('/blade-client-controller/catering/order/jsapi-officialAccount', data)
}
