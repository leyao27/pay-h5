<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMerchantInfo, unifiedOrder } from '@/api/pay'
import { getPayChannel } from '@/utils/pay/detect'
import { getWechatCode, redirectToWechatAuth, clearAuthParams as clearWechatParams } from '@/utils/pay/wechatAuth'
import { getAlipayAuthCode, redirectToAlipayAuth, clearAuthParams as clearAlipayParams } from '@/utils/pay/alipayAuth'
import { invokeWechatPay } from '@/utils/pay/wechatPay'
import { invokeAlipay } from '@/utils/pay/alipayPay'
import defaultLogo from '@/assets/default-logo.svg'

const route = useRoute()
const router = useRouter()

const channel = ref('')
const merchantCode = ref('')
const merchantName = ref('')
const merchantLogo = ref('')
const amountInput = ref('')
const amountError = ref(false)
const pageError = ref('')
const paying = ref(false)

function validateAmount() {
  const val = amountInput.value
  if (!val) return false
  const num = parseFloat(val)
  if (isNaN(num)) return false
  if (num <= 0) return false
  if (num > 1000000) return false
  if (!/^\d+(\.\d{0,2})?$/.test(val)) return false
  return true
}

onMounted(async () => {
  channel.value = getPayChannel()
  if (channel.value === 'other') return

  merchantCode.value = route.query.merchantCode || ''

  try {
    const info = await getMerchantInfo(merchantCode.value)
    merchantName.value = info.name || ''
    merchantLogo.value = info.logo || ''
  } catch {
    // merchant info failure does not block payment
  }

  if (channel.value === 'wechat') {
    const code = getWechatCode()
    if (!code) {
      redirectToWechatAuth()
      return
    }
    sessionStorage.setItem('pay_code', code)
    clearWechatParams()
  }

  if (channel.value === 'alipay') {
    const authCode = getAlipayAuthCode()
    if (!authCode) {
      redirectToAlipayAuth()
      return
    }
    sessionStorage.setItem('pay_code', authCode)
    clearAlipayParams()
  }
})

async function handlePay() {
  amountError.value = false
  pageError.value = ''

  if (!validateAmount()) {
    amountError.value = true
    return
  }

  const code = sessionStorage.getItem('pay_code')
  if (!code) {
    if (channel.value === 'wechat') redirectToWechatAuth()
    else if (channel.value === 'alipay') redirectToAlipayAuth()
    return
  }

  paying.value = true
  const amountFen = Math.round(parseFloat(amountInput.value) * 100)

  let res
  try {
    res = await unifiedOrder({
      channel: channel.value,
      merchantCode: merchantCode.value,
      amount: amountFen,
      description: '扫码支付商品',
      code
    })
    sessionStorage.removeItem('pay_code')
  } catch (err) {
    paying.value = false
    pageError.value = '下单失败，请重试'
    return
  }

  try {
    if (channel.value === 'wechat') {
      await invokeWechatPay(res.params)
    } else if (channel.value === 'alipay') {
      await invokeAlipay(res.tradeNO)
    }
    router.replace({ path: '/pay/result', query: { status: 'success', merchantCode: merchantCode.value } })
  } catch {
    router.replace({ path: '/pay/result', query: { status: 'fail', merchantCode: merchantCode.value } })
  } finally {
    paying.value = false
  }
}

</script>

<template>
  <!-- Unsupported environment -->
  <div v-if="channel === 'other'" class="unsupported">
    <div class="unsupported-icon">📵</div>
    <p>请使用微信或支付宝App扫描收款码</p>
  </div>

  <!-- Payment page -->
  <div v-else class="pay-page">
    <!-- Merchant info card -->
    <div class="card merchant-card">
      <img
        :src="merchantLogo || defaultLogo"
        class="merchant-logo"
        alt="商家Logo"
        @error="merchantLogo = defaultLogo"
      />
      <div class="merchant-name">{{ merchantName || '商家收款' }}</div>
    </div>

    <!-- Amount input card -->
    <div class="card amount-card">
      <label class="amount-label">支付金额（元）</label>
      <input
        v-model="amountInput"
        class="amount-input"
        type="number"
        inputmode="decimal"
        placeholder="0.00"
        min="0.01"
        step="0.01"
      />
      <p v-if="amountError" class="error-tip">请输入正确的支付金额</p>
    </div>

    <!-- Pay button -->
    <button
      class="pay-btn"
      :style="{ backgroundColor: channel === 'alipay' ? '#1677FF' : '#07c160' }"
      :disabled="paying"
      @click="handlePay"
    >
      {{ paying ? '支付中...' : '确认支付' }}
    </button>

    <!-- Page error -->
    <p v-if="pageError" class="page-error">{{ pageError }}</p>
  </div>
</template>

<style scoped>
.unsupported {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #999;
  gap: 16px;
}

.unsupported-icon {
  font-size: 48px;
}

.unsupported p {
  font-size: 15px;
  text-align: center;
  padding: 0 24px;
}

.pay-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 16px;
}

.merchant-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.merchant-logo {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
}

.merchant-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.amount-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.amount-label {
  font-size: 14px;
  color: #666;
}

.amount-input {
  border: none;
  border-bottom: 1px solid #eee;
  outline: none;
  font-size: 32px;
  font-weight: 600;
  color: #333;
  width: 100%;
  padding: 8px 0;
}

.amount-input::placeholder {
  color: #ccc;
}

.error-tip {
  font-size: 12px;
  color: #f44336;
  margin-top: 4px;
}

.pay-btn {
  margin-top: 8px;
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.pay-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.page-error {
  text-align: center;
  font-size: 13px;
  color: #f44336;
}
</style>
