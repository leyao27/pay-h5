# pay-h5

聚合支付H5页面，支持微信JSAPI支付和支付宝JSAPI支付。用户通过微信或支付宝扫描商家二维码进入该H5页面进行收款。

## 目录结构

```
pay-h5/
├── public/
│   └── index.html
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/
│   │   └── index.js
│   ├── api/
│   │   ├── request.js
│   │   └── pay.js
│   ├── utils/
│   │   └── pay/
│   │       ├── detect.js
│   │       ├── wechatAuth.js
│   │       ├── alipayAuth.js
│   │       ├── wechatPay.js
│   │       └── alipayPay.js
│   ├── views/
│   │   └── pay/
│   │       ├── PayHome.vue
│   │       └── PayResult.vue
│   └── assets/
│       └── default-logo.svg
├── .env.example
├── vite.config.js
├── package.json
└── README.md
```

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入真实的 AppID 和后端地址

# 开发模式
npm run dev

# 构建生产包
npm run build
```

## 环境变量说明

| 变量名 | 说明 |
|---|---|
| `VITE_WECHAT_APPID` | 微信公众号 AppID |
| `VITE_ALIPAY_APPID` | 支付宝开放平台 AppID |
| `VITE_API_BASE_URL` | 后端服务地址 |

## 后端接口文档

### GET /api/merchant/info

获取商家信息。

**请求参数（Query）：**

| 参数 | 类型 | 说明 |
|---|---|---|
| `merchantId` | string | 商家ID |

**响应示例：**

```json
{
  "code": 0,
  "data": {
    "name": "张三小店",
    "logo": "https://example.com/logo.png"
  }
}
```

---

### POST /api/pay/unified

统一下单。

**请求体：**

```json
{
  "channel": "wechat",
  "merchantId": "M001",
  "amount": 100,
  "code": "微信授权code或支付宝auth_code"
}
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `channel` | string | `wechat` 或 `alipay` |
| `merchantId` | string | 商家ID |
| `amount` | number | 支付金额（分） |
| `code` | string | 微信授权code或支付宝auth_code |

**微信响应示例：**

```json
{
  "code": 0,
  "data": {
    "params": {
      "appId": "wxxxxxxxxxxx",
      "timeStamp": "1700000000",
      "nonceStr": "xxx",
      "prepayId": "prepay_id=xxx",
      "paySign": "xxx"
    }
  }
}
```

**支付宝响应示例：**

```json
{
  "code": 0,
  "data": {
    "tradeNO": "2024xxxxxxxxxxxxxxxx"
  }
}
```

## 微信公众号后台配置清单

1. **JS安全域名**：将 `pay.yourdomain.com` 添加到「公众号设置 → 功能设置 → JS接口安全域名」
2. **网页授权域名**：将 `pay.yourdomain.com` 添加到「公众号设置 → 功能设置 → 网页授权域名」
3. **支付授权目录**：在微信支付商户后台「开发配置 → 支付配置」中添加 `https://pay.yourdomain.com/`

## 支付宝开放平台配置清单

1. 在应用详情「开发设置 → 授权回调地址」中配置 `https://pay.yourdomain.com`
2. 确保应用已开通「支付宝授权」和「手机网站支付」能力

## 常见报错和解决方案

| 报错 | 原因 | 解决方案 |
|---|---|---|
| 微信网页授权 redirect_uri 域名与后台配置不一致 | 网页授权域名未配置 | 在公众号后台添加授权域名 |
| `WeixinJSBridge is not defined` | 未在微信环境内 | 确保在微信浏览器中打开 |
| 支付签名错误 | 后端签名参数不正确 | 检查后端签名逻辑 |
| `invalid_client` | AppID 配置错误 | 检查 `.env.local` 中的 AppID |
| 下单金额错误 | 前端传入单位不是分 | 确认 `amount` 为整数（分） |
