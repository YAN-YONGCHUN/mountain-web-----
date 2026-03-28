# 🚀 Cloudflare Workers 快速部署指南

## ✅ 当前配置状态

- **Worker 名称**: `memsavor-api`
- **入口文件**: `worker.js`
- **GitHub Actions**: 已配置自动部署

---

## 📋 步骤 1：检查 GitHub Actions 部署状态

1. **访问 GitHub Actions**
   ```
   https://github.com/YAN-YONGCHUN/mountain-web-----/actions
   ```

2. **查看最新的 workflow**
   - 点击最新的 "Deploy to Cloudflare Workers"
   - 查看部署日志

3. **可能的部署结果**

   ### ✅ 成功
   日志会显示：
   ```
   ✨ Successfully published your Worker to
    https://memsavor-api.your-subdomain.workers.dev
   ```

   ### ❌ 失败
   常见错误及解决方案：

   **错误 1**: Worker 名称不匹配
   ```
   The name in your Wrangler configuration file must match the name of your Worker
   ```
   **解决**: 在 Cloudflare Dashboard 创建名为 `memsavor-api` 的 Worker

   **错误 2**: API Token 权限不足
   ```
   Authentication error
   ```
   **解决**: 重新创建 API Token，确保有 Workers Scripts: Edit 权限

   **错误 3**: Account ID 错误
   ```
   Could not route to account
   ```
   **解决**: 检查 GitHub Secrets 中的 CLOUDFLARE_ACCOUNT_ID

---

## 📋 步骤 2：在 Cloudflare Dashboard 创建 Worker（如果需要）

如果部署失败提示 Worker 不存在：

1. **访问 Cloudflare Dashboard**
   ```
   https://dash.cloudflare.com
   ```

2. **进入 Workers & Pages**
   - 点击左侧菜单 "Workers & Pages"
   - 点击 "Create application"

3. **创建 Worker**
   - 选择 "Create Worker"
   - **名称输入**: `memsavor-api`（必须完全一致）
   - 点击 "Deploy"

4. **重新部署**
   - 回到 GitHub Actions
   - 点击 "Re-run jobs"

---

## 📋 步骤 3：获取 Workers 地址

部署成功后，您会获得类似地址：
```
https://memsavor-api.your-subdomain.workers.dev
```

**获取方式**：
1. GitHub Actions 日志中查看
2. 或访问 Cloudflare Dashboard → Workers & Pages → memsavor-api → Overview

---

## 📋 步骤 4：更新前端 API 地址

获得 Workers 地址后，更新 `js/api.js`：

```javascript
// 修改前
const API_BASE_URL = 'https://memsavor-api.YOUR-SUBDOMAIN.workers.dev';

// 修改后（使用实际地址）
const API_BASE_URL = 'https://memsavor-api.实际子域名.workers.dev';
```

---

## 🧪 步骤 5：测试 API

### 方法 1：浏览器测试
访问：
```
https://memsavor-api.your-subdomain.workers.dev/mountains
```

应该返回山峰数据 JSON。

### 方法 2：使用测试页面
1. 更新 `test-api.html` 中的 API 地址
2. 访问测试页面
3. 运行所有测试

---

## 💡 自动化流程

我已经配置了 GitHub Actions 自动部署，流程如下：

```
推送代码到 GitHub
    ↓
GitHub Actions 自动触发
    ↓
安装 Wrangler
    ↓
部署到 Cloudflare Workers
    ↓
获取 Workers 地址
    ↓
更新前端配置
    ↓
测试功能
```

---

## 🎯 下一步

1. **查看 GitHub Actions 日志**
2. **告诉我部署结果**（成功或失败）
3. **如果成功，提供 Workers 地址**
4. **我会更新前端配置并测试**

---

## ⚡ 快速命令

如果需要手动部署（可选）：
```bash
# 安装 Wrangler
npm install -g wrangler

# 登录（如果可以访问）
wrangler login

# 部署
wrangler deploy
```

---

**现在请查看 GitHub Actions 日志，告诉我部署结果！** 🚀
