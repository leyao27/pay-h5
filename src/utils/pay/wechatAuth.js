const WECHAT_APPID = import.meta.env.VITE_WECHAT_APPID

/**
 * Get the wechat oauth code from the current URL.
 * @returns {string | null}
 */
export function getWechatCode() {
  const params = new URLSearchParams(window.location.search)
  return params.get('code')
}

/**
 * Redirect to WeChat OAuth authorization page.
 */
export function redirectToWechatAuth() {
  const redirectUri = encodeURIComponent(window.location.href)
  const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WECHAT_APPID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=pay#wechat_redirect`
  window.location.href = url
}

/**
 * Remove code and state from the URL using history.replaceState.
 */
export function clearAuthParams() {
  const url = new URL(window.location.href)
  url.searchParams.delete('code')
  url.searchParams.delete('state')
  window.history.replaceState(null, '', url.toString())
}
