/**
 * Check if the current browser is WeChat's built-in browser
 */
export function isWechat() {
  return /MicroMessenger/i.test(navigator.userAgent)
}

/**
 * Get a query parameter value from the current URL
 * @param {string} key
 * @returns {string|null}
 */
export function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search)
  return params.get(key)
}

/**
 * Redirect to WeChat OAuth2 authorization page to obtain a code
 * @param {string} appId - WeChat Official Account AppId
 * @param {string} redirectUri - The redirect URI after authorization (current page URL)
 * @param {string} state - Custom state parameter (e.g., merchantCode)
 */
export function redirectToWechatAuth(appId, redirectUri, state = '') {
  const encoded = encodeURIComponent(redirectUri)
  const url =
    `https://open.weixin.qq.com/connect/oauth2/authorize` +
    `?appid=${appId}` +
    `&redirect_uri=${encoded}` +
    `&response_type=code` +
    `&scope=snsapi_base` +
    `&state=${encodeURIComponent(state)}` +
    `#wechat_redirect`
  window.location.href = url
}

/**
 * Invoke WeChat JS payment
 * @param {Object} payParams - Payment parameters returned from the server
 * @returns {Promise<void>}
 */
export function invokePay(payParams) {
  return new Promise((resolve, reject) => {
    if (typeof WeixinJSBridge === 'undefined') {
      document.addEventListener('WeixinJSBridgeReady', () => doPay(payParams, resolve, reject), false)
    } else {
      doPay(payParams, resolve, reject)
    }
  })
}

function doPay(payParams, resolve, reject) {
  // eslint-disable-next-line no-undef
  WeixinJSBridge.invoke('getBrandWCPayRequest', payParams, (res) => {
    if (res.err_msg === 'get_brand_wcpay_request:ok') {
      resolve(res)
    } else {
      reject(new Error(res.err_msg || 'Payment failed'))
    }
  })
}
