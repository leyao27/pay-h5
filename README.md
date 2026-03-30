# pay-h5

微信公众号 JSAPI 扫码支付 H5 页面。

## 功能

- 用户扫描二维码（含 `merchantCode` 参数）后打开本页面
- 自动完成微信 OAuth2 授权，获取用户 `openId`
- 调用后端接口 `/api/blade-client-controller/catering/order/jsapi-officialAccount` 创建支付订单
- `description` 固定为 `"扫码支付商品"`
- 调用 `WeixinJSBridge` 唤起微信支付

## 快速开始

```bash
# 安装依赖
npm install

# 复制环境变量模板并填写配置
cp .env.example .env

# 启动开发服务器
npm run dev

# 生产环境构建
npm run build
```

## 环境变量

复制 `.env.example` 为 `.env` 并填写以下变量：

| 变量名 | 说明 |
|--------|------|
| `VITE_WECHAT_APP_ID` | 微信公众号 AppId，用于 OAuth2 授权 |
| `VITE_API_TARGET` | 后端 API 地址（开发环境代理目标） |

## 支付流程

```
扫码（携带 merchantCode）
  → 微信 OAuth2 授权获取 code
  → 后端用 code 换取 openId 并创建支付订单
  → 前端调用 WeixinJSBridge 唤起支付
  → 支付成功/失败提示
```

## API 接口

**POST** `/api/blade-client-controller/catering/order/jsapi-officialAccount`

| 参数 | 类型 | 说明 |
|------|------|------|
| `merchantCode` | string | 商户号（从二维码 URL 参数获取） |
| `description` | string | 固定为 `"扫码支付商品"` |
| `code` | string | 微信 OAuth2 授权码 |
