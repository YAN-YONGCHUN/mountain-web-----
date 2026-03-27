# 🔧 Netlify Functions 故障排查指南

## ❌ 问题：登录注册显示"网络连接失败"

### 原因分析

Netlify Functions 没有正确部署，导致 API 端点无法访问。

### ✅ 已修复的问题

1. **缺少构建命令**: 添加了 `npm install` 来安装依赖
2. **未指定发布目录**: 添加了 `publish = "."`
3. **未配置函数打包器**: 添加了 `node_bundler = "esbuild"`

### 📋 修复步骤

#### 1. 检查 Netlify 部署状态

访问 Netlify 后台：
1. 登录 [https://app.netlify.com](https://app.netlify.com)
2. 选择站点 `memsavor`
3. 点击 **"Deploys"** 标签
4. 查看最新部署状态

**预期状态**: 
- ✅ Published（已发布）
- ✅ Functions 已部署

#### 2. 查看部署日志

在部署详情页面，检查是否有错误：

**常见错误**:
- ❌ `Function not found` - 函数未正确部署
- ❌ `Module not found` - 依赖未安装
- ❌ `Syntax error` - 代码语法错误

#### 3. 测试 API 端点

部署完成后（约 2-3 分钟），测试以下地址：

```
https://memsavor.netlify.app/.netlify/functions/mountains
```

**预期结果**: 返回 JSON 格式的山峰数据

#### 4. 检查浏览器控制台

打开前端页面，按 F12 打开开发者工具：

1. 点击 **"Console"** 标签 - 查看是否有错误
2. 点击 **"Network"** 标签 - 查看网络请求

**正常情况**:
- ✅ 请求状态码 200
- ✅ 返回 JSON 数据

**异常情况**:
- ❌ 404 Not Found - API 端点不存在
- ❌ 500 Internal Server Error - 服务器错误
- ❌ CORS 错误 - 跨域问题

### 🔍 详细排查步骤

#### 步骤 1: 检查 Netlify Functions 列表

在 Netlify 后台：
1. 点击 **"Functions"** 标签
2. 查看是否有以下函数：
   - ✅ auth
   - ✅ mountains
   - ✅ partners
   - ✅ users
   - ✅ orders
   - ✅ products
   - ✅ rentals

如果没有看到这些函数，说明部署失败。

#### 步骤 2: 检查依赖安装

在 Netlify 部署日志中查找：
```
npm install
```

确保以下依赖已安装：
- jsonwebtoken
- bcryptjs
- uuid

#### 步骤 3: 检查环境变量

如果使用了环境变量，在 Netlify 后台：
1. 点击 **"Site settings"**
2. 点击 **"Environment variables"**
3. 确保设置了 `JWT_SECRET`

#### 步骤 4: 手动触发重新部署

如果自动部署失败，可以手动触发：
1. 在 Netlify 后台点击 **"Deploys"**
2. 点击 **"Trigger deploy"**
3. 选择 **"Clear cache and deploy site"**

### 🧪 测试命令

#### 测试山峰 API
```bash
curl https://memsavor.netlify.app/.netlify/functions/mountains
```

#### 测试登录 API
```bash
curl -X POST https://memsavor.netlify.app/.netlify/functions/auth/login \
  -H "Content-Type: application/json" \
  -d '{"account":"13800138000","password":"123456"}'
```

#### 测试注册 API
```bash
curl -X POST https://memsavor.netlify.app/.netlify/functions/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"测试用户","phone":"13900139000","password":"123456"}'
```

### 📊 部署状态检查清单

- [ ] Netlify 部署状态为 "Published"
- [ ] Functions 标签显示 7 个函数
- [ ] API 端点可以访问
- [ ] 浏览器控制台无错误
- [ ] 网络请求返回 200 状态码

### 🆘 如果问题仍然存在

#### 方案 1: 检查 Netlify 构建日志

在 Netlify 后台查看详细构建日志，寻找错误信息。

#### 方案 2: 本地测试

安装 Netlify CLI 并本地测试：
```bash
npm install -g netlify-cli
netlify login
netlify dev
```

访问 `http://localhost:8888` 测试。

#### 方案 3: 检查 CORS 配置

确保 `netlify.toml` 中的 CORS 配置正确：
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
```

#### 方案 4: 联系 Netlify 支持

如果以上方法都无法解决，可以：
1. 访问 [Netlify 社区论坛](https://answers.netlify.com/)
2. 提交支持工单

### 📝 常见问题 FAQ

**Q: 为什么第一次访问很慢？**
A: Netlify Functions 免费层有冷启动，首次请求可能需要 1-2 秒。

**Q: 为什么数据会丢失？**
A: 当前使用内存存储，函数重启后数据会重置。生产环境建议使用数据库。

**Q: 如何查看函数日志？**
A: 在 Netlify 后台 → Functions → 点击函数名 → 查看日志。

**Q: 如何更新代码？**
A: 推送代码到 GitHub，Netlify 会自动检测并重新部署。

### ✅ 成功标志

当看到以下内容时，说明部署成功：
- ✅ Netlify 后台显示 "Published"
- ✅ Functions 标签显示所有函数
- ✅ API 测试返回 JSON 数据
- ✅ 前端登录注册功能正常

---

**最后更新**: 2026-03-28
**相关文档**: 
- [NETLIFY_QUICKSTART.md](./NETLIFY_QUICKSTART.md)
- [DEPLOY_NETLIFY.md](./DEPLOY_NETLIFY.md)
