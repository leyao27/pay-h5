<template>
  <div class="pay-page">
    <!-- Loading state -->
    <div v-if="state === 'loading'" class="state-box">
      <div class="spinner"></div>
      <p class="hint">正在加载，请稍候…</p>
    </div>

    <!-- Error state -->
    <div v-else-if="state === 'error'" class="state-box">
      <div class="icon icon-error">✕</div>
      <p class="title">支付失败</p>
      <p class="hint">{{ errorMsg }}</p>
      <button class="btn" @click="retry">重试</button>
    </div>

    <!-- Success state -->
    <div v-else-if="state === 'success'" class="state-box">
      <div class="icon icon-success">✓</div>
      <p class="title">支付成功</p>
      <p class="hint">感谢您的支付！</p>
    </div>

    <!-- Ready to pay -->
    <div v-else-if="state === 'ready'" class="state-box">
      <div class="icon icon-pay">¥</div>
      <p class="title">扫码支付商品</p>
      <p class="hint">商户号：{{ merchantCode }}</p>
      <button class="btn" @click="startPay">立即支付</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { createJsapiOrder } from '../api/payment'
import { isWechat, getQueryParam, redirectToWechatAuth, invokePay } from '../utils/wechat'

// ── Environment variable: WeChat Official Account AppId ──────────────────────
// Set VITE_WECHAT_APP_ID in .env files or production environment.
const WECHAT_APP_ID = import.meta.env.VITE_WECHAT_APP_ID || ''

const state = ref('loading') // 'loading' | 'ready' | 'success' | 'error'
const errorMsg = ref('')
const merchantCode = ref('')
let payParams = null

onMounted(async () => {
  // 1. Read merchantCode from URL query param (set by QR code)
  merchantCode.value = getQueryParam('merchantCode') || ''

  if (!merchantCode.value) {
    setError('缺少商户信息，请重新扫码')
    return
  }

  // 2. Must run inside WeChat browser for JSAPI payment
  if (!isWechat()) {
    setError('请在微信中打开此页面进行支付')
    return
  }

  // 3. WeChat OAuth2: obtain user openId via authorization code flow
  const code = getQueryParam('code')
  if (!code) {
    // Redirect to WeChat OAuth; preserve merchantCode in state so we can
    // restore it after the redirect returns.
    redirectToWechatAuth(
      WECHAT_APP_ID,
      window.location.href,
      merchantCode.value
    )
    return // page will reload with ?code=...
  }

  // 4. Call payment API
  await fetchPayParams(code)
})

async function fetchPayParams(code) {
  state.value = 'loading'
  try {
    const { data } = await createJsapiOrder({
      merchantCode: merchantCode.value,
      code,
    })

    if (data && data.code === 200 && data.data) {
      payParams = data.data
      state.value = 'ready'
    } else {
      setError((data && data.msg) || '获取支付参数失败，请重试')
    }
  } catch (err) {
    setError(err.message || '网络错误，请检查网络后重试')
  }
}

async function startPay() {
  if (!payParams) {
    setError('支付参数无效，请刷新页面重试')
    return
  }
  state.value = 'loading'
  try {
    await invokePay(payParams)
    state.value = 'success'
  } catch (err) {
    setError(err.message || '支付失败，请重试')
  }
}

function retry() {
  window.location.reload()
}

function setError(msg) {
  errorMsg.value = msg
  state.value = 'error'
}
</script>

<style scoped>
.pay-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f7f8fa;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
}

.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  width: 320px;
  max-width: 90vw;
}

.icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

.icon-success {
  background: #07c160;
  color: #fff;
}

.icon-error {
  background: #fa5151;
  color: #fff;
}

.icon-pay {
  background: #1aad19;
  color: #fff;
  font-size: 36px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.hint {
  font-size: 14px;
  color: #888;
  margin: 0 0 24px;
  text-align: center;
}

.btn {
  width: 100%;
  height: 48px;
  background: #07c160;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:active {
  opacity: 0.85;
}

/* Spinner */
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e8e8e8;
  border-top-color: #07c160;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
