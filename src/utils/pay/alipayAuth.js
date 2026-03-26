const ALIPAY_APPID = import.meta.env.VITE_ALIPAY_APPID

/**
 * Get the Alipay auth_code from the current URL.
 * @returns {string | null}
 */
export function getAlipayAuthCode() {
  const params = new URLSearchParams(window.location.search)
  return params.get('auth_code')
}

/**
 * Redirect to Alipay OAuth authorization page.
 */
export function redirectToAlipayAuth() {
  const redirectUri = encodeURIComponent(window.location.href)
  const url = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${ALIPAY_APPID}&scope=auth_base&redirect_uri=${redirectUri}&state=pay`
  window.location.href = url
}

/**
 * Remove auth_code and state from the URL using history.replaceState.
 */
export function clearAuthParams() {
  const url = new URL(window.location.href)
  url.searchParams.delete('auth_code')
  url.searchParams.delete('state')
  window.history.replaceState(null, '', url.toString())
}
