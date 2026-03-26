/**
 * Invoke WeChat JSAPI payment.
 * @param {{ appId: string, timeStamp: string, nonceStr: string, prepayId: string, paySign: string }} params
 * @returns {Promise<void>}
 */
export function invokeWechatPay(params) {
  return new Promise((resolve, reject) => {
    const pay = () => {
      window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: params.appId,
          timeStamp: params.timeStamp,
          nonceStr: params.nonceStr,
          package: `prepay_id=${params.prepayId}`,
          signType: 'RSA',
          paySign: params.paySign
        },
        (res) => {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            resolve()
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            reject('cancel')
          } else {
            reject(res.err_msg)
          }
        }
      )
    }

    if (typeof window.WeixinJSBridge === 'undefined') {
      document.addEventListener('WeixinJSBridgeReady', pay, false)
    } else {
      pay()
    }
  })
}
