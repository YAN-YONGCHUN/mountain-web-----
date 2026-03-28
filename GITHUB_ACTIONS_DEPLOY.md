# 🚀 Cloudflare Workers 自动部署指南（GitHub Actions）

## ✅ 优势

- ✅ **不需要本地登录** - 解决国内无法访问的问题
- ✅ **自动部署** - 推送代码即自动部署
- ✅ **免费额度充足** - 每天 100,000 次请求
- ✅ **国内访问快** - 全球 CDN 加速

---

## 📋 部署步骤

### 步骤 1：获取 Cloudflare API Token

1. **登录 Cloudflare Dashboard**
   - 访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
   - 使用您的账号登录

2. **创建 API Token**
   - 点击右上角头像 → **"My Profile"**
   - 左侧菜单选择 **"API Tokens"**
   - 点击 **"Create Token"**
   - 设置权限：
     - ✅ Account Settings: Read
     - ✅ Workers Scripts: Edit
     - ✅ Workers KV Storage: Edit (如果使用 KV)
   - 点击 **"Continue to summary"** → **"Create Token"**
   - **⚠️ 复制生成的 Token**（只显示一次！）

3. **获取 Account ID**
   - 在 Cloudflare Dashboard 右侧
   - 找到 **"Account ID"**（类似：`abc123def456ghi789jkl`）

---

### 步骤 2：配置 GitHub Secrets

1. **打开 GitHub 仓库**
   - 访问 [https://github.com/YAN-YONGCHUN/mountain-web-----](https://github.com/YAN-YONGCHUN/mountain-web-----)

2. **进入 Settings**
   - 点击 **"Settings"** 标签
   - 左侧菜单选择 **"Secrets and variables"** → **"Actions"**

3. **添加 Secrets**
   点击 **"New repository secret"**，添加以下两个：

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: 粘贴您的 API Token

   **Secret 2:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: 粘贴您的 Account ID

---

### 步骤 3：推送代码触发部署

现在只需要推送代码到 GitHub，GitHub Actions 会自动部署！

```bash
git add .
git commit -m "feat: 添加 GitHub Actions 自动部署配置"
git push origin main
```

---

### 步骤 4：查看部署状态

1. **查看 GitHub Actions**
   - 访问 [https://github.com/YAN-YONGCHUN/mountain-web-----/actions](https://github.com/YAN-YONGCHUN/mountain-web-----/actions)
   - 查看最新的 workflow 运行状态

2. **获取 Workers 地址**
   - 部署成功后，在日志中会看到：
     ```
     ✨ Successfully published your Worker to
      https://memsavor-api.your-subdomain.workers.dev
     ```

---

### 步骤 5：更新前端 API 地址

1. **修改 `js/api.js`**
   ```javascript
   // 修改前
   const API_BASE_URL = 'https://memsavor-api.YOUR-SUBDOMAIN.workers.dev';
   
   // 修改后（使用实际地址）
   const API_BASE_URL = 'https://memsavor-api.your-subdomain.workers.dev';
   ```

2. **提交更新**
   ```bash
   git add js/api.js
   git commit -m "feat: 更新 Cloudflare Workers API 地址"
   git push origin main
   ```

---

## 🧪 测试 API

### 方法 1：浏览器测试

访问您的 Workers 地址：
```
https://memsavor-api.your-subdomain.workers.dev/mountains
```

应该返回山峰数据 JSON。

### 方法 2：使用测试页面

1. 更新 `test-api.html` 中的 API 地址
2. 访问测试页面
3. 运行所有测试

---

## 💰 费用说明

### 免费套餐
- ✅ 每天 100,000 次请求
- ✅ 每次请求 10ms CPU 时间
- ✅ 无限带宽

### 付费套餐（$5/月起）
- 每月 1000 万次请求
- 每次请求 50ms CPU 时间
- 更多高级功能

---

## 🐛 常见问题

### Q: GitHub Actions 部署失败？
A: 检查 Secrets 是否正确配置：
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Q: Workers 地址是什么？
A: 部署成功后，在 GitHub Actions 日志中会显示，格式为：
```
https://memsavor-api.your-subdomain.workers.dev
```

### Q: 如何查看部署日志？
A: 
1. GitHub Actions 页面
2. 或使用 `wrangler tail` 查看实时日志（需要本地环境）

### Q: 数据会丢失吗？
A: 当前使用内存存储，重启后会丢失。建议后续使用 Cloudflare KV 持久化存储。

---

## ✅ 部署检查清单

- [ ] 获取 Cloudflare API Token
- [ ] 获取 Cloudflare Account ID
- [ ] 配置 GitHub Secrets
- [ ] 推送代码触发部署
- [ ] 查看 GitHub Actions 日志
- [ ] 获取 Workers 地址
- [ ] 更新前端 API 地址
- [ ] 测试 API 功能
- [ ] 测试登录注册

---

## 🎯 下一步

完成上述步骤后，您的项目将：
- ✅ 自动部署到 Cloudflare Workers
- ✅ 国内访问快速稳定
- ✅ 无需本地操作
- ✅ 每天 100,000 次免费请求

**现在就开始部署吧！** 🚀
