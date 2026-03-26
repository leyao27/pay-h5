/**
 * Detect the current payment channel based on user agent.
 * @returns {'wechat' | 'alipay' | 'other'}
 */
export function getPayChannel() {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('micromessenger')) return 'wechat'
  if (ua.includes('alipayclient')) return 'alipay'
  return 'other'
}
