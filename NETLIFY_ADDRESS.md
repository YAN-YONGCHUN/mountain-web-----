# 🎯 Netlify 部署地址说明

## 📍 您的 Netlify 地址格式

部署到 Netlify 后，您会获得一个免费的子域名：

```
https://YOUR-SITE-NAME.netlify.app
```

例如：
- `https://memsavor.netlify.app`
- `https://por-savor.netlify.app`
- `https://mountain-web.netlify.app`

## ⚙️ 配置步骤

### 步骤 1：部署到 Netlify

1. 访问 [https://app.netlify.com](https://app.netlify.com)
2. 使用 GitHub 账号登录
3. 点击 **"Add new site"** → **"Import an existing project"**
4. 选择仓库：`mountain-web-----`
5. 配置构建：
   ```
   Base directory: 留空
   Build command: 留空
   Publish directory: 留空
   ```
6. 点击 **"Deploy site"**

### 步骤 2：获取您的站点地址

部署成功后，在 Netlify 后台顶部会显示您的站点 URL：

```
https://YOUR-SITE-NAME.netlify.app
```

**示例**: `https://memsavor-porsavor.netlify.app`

### 步骤 3：更新 API 地址

打开 [`js/api-netlify.js`](file:///c:/Users/闫永春/Desktop/mountain-web%20-%20副本/js/api-netlify.js) 文件，修改第 3 行：

```javascript
// 修改前
const NETLIFY_BASE_URL = 'https://YOUR-SITE-NAME.netlify.app/.netlify/functions';

// 修改后（假设您的站点名是 memsavor）
const NETLIFY_BASE_URL = 'https://memsavor.netlify.app/.netlify/functions';
```

### 步骤 4：更新 HTML 引用

将所有 HTML 文件中的 API 引用从 `api.js` 改为 `api-netlify.js`：

```html
<!-- 修改前 -->
<script src="js/api.js"></script>

<!-- 修改后 -->
<script src="js/api-netlify.js"></script>
```

**需要修改的文件**：
- [`index.html`](file:///c:/Users/闫永春/Desktop/mountain-web%20-%20副本/index.html)
- [`login.html`](file:///c:/Users/闫永春/Desktop/mountain-web%20-%20副本/login.html)
- [`register.html`](file:///c:/Users/闫永春/Desktop/mountain-web%20-%20副本/register.html)
- [`admin.html`](file:///c:/Users/闫永春/Desktop/mountain-web%20-%20副本/admin.html)
- [`admin-login.html`](file:///c:/Users/闫永春/Desktop/mountain-web%20-%20副本/admin-login.html)
- [`partner.html`](file:///c:/Users/闫永春/Desktop/mountain-web%20-%20副本/partner.html)
- [`rent.html`](file:///c:/Users/闫永春/Desktop/mountain-web%20-%20副本/rent.html)
- [`badge.html`](file:///c:/Users/闫永春/Desktop/mountain-web%20-%20副本/badge.html)
- [`spots.html`](file:///c:/Users/闫永春/Desktop/mountain-web%20-%20副本/spots.html)
- [`detail.html`](file:///c:/Users/闫永春/Desktop/mountain-web%20-%20副本/detail.html)

### 步骤 5：提交并重新部署

```bash
git add .
git commit -m "feat: 更新 Netlify API 地址配置"
git push origin main
```

Netlify 会自动检测 GitHub 的推送并重新部署。

## 🧪 测试 API

部署完成后，访问以下地址测试 API：

```
https://YOUR-SITE-NAME.netlify.app/.netlify/functions/mountains
```

应该返回 JSON 格式的山峰数据。

## 🔗 最终 URL

部署成功后：

- **前端地址**: https://yan-yongchun.github.io/mountain-web-----/
- **后端地址**: https://YOUR-SITE-NAME.netlify.app/.netlify/functions

## 💡 自定义域名（可选）

如果您有自己的域名，可以在 Netlify 后台设置：

1. 进入 **Domain settings**
2. 点击 **"Add custom domain"**
3. 输入您的域名（如 `porsavor.com`）
4. 按照指引配置 DNS

## ⚠️ 常见问题

### Q: 我的站点地址是什么？
A: 在 Netlify 后台 → Site overview → Site details 中查看

### Q: 可以修改站点名称吗？
A: 可以！在 Netlify 后台 → Site settings → Change site name 修改

### Q: API 返回 404？
A: 检查地址是否正确，应该是 `/.netlify/functions/` 而不是 `/api/`

### Q: 本地测试如何配置？
A: 安装 Netlify CLI 并运行 `netlify dev`，会自动使用本地函数

## 📚 相关文档

- [NETLIFY_QUICKSTART.md](./NETLIFY_QUICKSTART.md) - 快速部署指南
- [DEPLOY_NETLIFY.md](./DEPLOY_NETLIFY.md) - 详细部署文档
- [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) - 迁移总结
