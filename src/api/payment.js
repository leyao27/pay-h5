import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Create WeChat JSAPI (Official Account) payment order
 * @param {Object} params
 * @param {string} params.merchantCode - Merchant code from QR code
 * @param {string} params.code - WeChat OAuth2 authorization code (server exchanges it for openId)
 * @param {string} [params.description] - Payment description, defaults to "扫码支付商品"
 */
export function createJsapiOrder(params) {
  return request.post(
    '/blade-client-controller/catering/order/jsapi-officialAccount',
    {
      description: '扫码支付商品',
      ...params,
    }
  )
}
