import request from './request'

export function getMerchantInfo(merchantId) {
  return request.get('/merchant/info', { params: { merchantId } })
}

export function unifiedOrder(data) {
  return request.post('/pay/unified', data)
}
