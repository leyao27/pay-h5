<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPayChannel } from '@/utils/pay/detect'

const route = useRoute()
const router = useRouter()

const status = computed(() => route.query.status)
const merchantId = computed(() => route.query.merchantId || '')

function goBack() {
  router.replace({ path: '/', query: { merchantId: merchantId.value } })
}

function closeWindow() {
  const channel = getPayChannel()
  if (channel === 'wechat') {
    if (typeof window.WeixinJSBridge !== 'undefined') {
      window.WeixinJSBridge.call('closeWindow')
    }
  } else if (channel === 'alipay') {
    if (typeof window.AlipayJSBridge !== 'undefined') {
      window.AlipayJSBridge.call('exitApp')
    }
  }
}
</script>

<template>
  <div class="result-page">
    <!-- Success -->
    <div v-if="status === 'success'" class="result-content">
      <div class="icon success-icon">✓</div>
      <h2 class="result-title">支付成功</h2>
      <button class="btn btn-primary" @click="goBack">返回收款页</button>
    </div>

    <!-- Fail -->
    <div v-else class="result-content">
      <div class="icon fail-icon">✗</div>
      <h2 class="result-title">支付失败</h2>
      <button class="btn btn-primary" @click="goBack">重新支付</button>
      <button class="btn btn-secondary" @click="closeWindow">关闭页面</button>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 24px;
  width: 100%;
}

.icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  color: #fff;
}

.success-icon {
  background: #07c160;
}

.fail-icon {
  background: #f44336;
}

.result-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.btn {
  width: 280px;
  height: 48px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:active {
  opacity: 0.8;
}

.btn-primary {
  background: #07c160;
  color: #fff;
}

.btn-secondary {
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
}
</style>
