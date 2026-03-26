/**
 * Invoke Alipay JSAPI payment.
 * @param {string} tradeNO
 * @returns {Promise<void>}
 */
export function invokeAlipay(tradeNO) {
  return new Promise((resolve, reject) => {
    const pay = () => {
      window.AlipayJSBridge.call('tradePay', { tradeNO }, (result) => {
        const code = String(result.resultCode)
        if (code === '9000') {
          resolve()
        } else if (code === '6001') {
          reject('cancel')
        } else {
          reject(code)
        }
      })
    }

    if (typeof window.AlipayJSBridge === 'undefined') {
      document.addEventListener('AlipayJSBridgeReady', pay, false)
    } else {
      pay()
    }
  })
}
