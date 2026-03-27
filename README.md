# MemSavor 登山共享平台

🏔️ 一个现代化的登山共享平台，包含山峰探索、登山杖租借、登山搭子匹配、集章商城等功能。

## 🏗️ 混合架构

```
┌─────────────────┐         API请求          ┌─────────────────┐
│                 │  ───────────────────────▶ │                 │
│  GitHub Pages   │                          │  Vercel Server  │
│  (前端静态托管)  │  ◀─────────────────────── │  (后端API)      │
│                 │         JSON响应          │                 │
└─────────────────┘                          └─────────────────┘
```

## 📁 项目结构

```
mountain-web/
├── api/                    # Vercel Serverless Functions
│   ├── lib/
│   │   ├── auth.js        # JWT认证模块
│   │   ├── db.js          # 数据存储模块
│   │   └── utils.js       # 工具函数
│   ├── auth.js            # 认证API
│   ├── mountains.js       # 山峰API
│   ├── users.js           # 用户API
│   ├── orders.js          # 订单API
│   ├── rentals.js         # 租借API
│   ├── partners.js        # 搭子API
│   └── products.js        # 商品API
├── js/
│   └── api.js             # 前端API服务层
├── *.html                 # 前端页面
├── vercel.json            # Vercel配置
├── package.json           # 项目依赖
└── .env.example           # 环境变量示例
```

## 🚀 部署指南

### 1. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 部署到生产环境
vercel --prod
```

### 2. 配置环境变量

在 Vercel Dashboard 中设置以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| JWT_SECRET | JWT密钥 | your-secret-key |

### 3. 部署前端到 GitHub Pages

1. 进入 GitHub 仓库 Settings
2. 找到 Pages 选项
3. 选择分支和目录
4. 保存后等待部署完成

### 4. 更新 API 地址

部署完成后，修改 `js/api.js` 中的 `API_BASE_URL`：

```javascript
const API_BASE_URL = 'https://your-app.vercel.app';
```

## 🔌 API 端点

### 认证 API
| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/admin/login | 管理员登录 |
| GET | /api/auth/me | 获取当前用户 |

### 山峰 API
| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /api/mountains | 获取山峰列表 |
| GET | /api/mountains/:id | 获取山峰详情 |
| POST | /api/mountains | 添加山峰（需管理员权限） |
| PUT | /api/mountains/:id | 更新山峰（需管理员权限） |
| DELETE | /api/mountains/:id | 删除山峰（需管理员权限） |

### 用户 API
| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /api/users | 获取用户列表（需管理员权限） |
| POST | /api/users | 添加用户（需管理员权限） |
| PUT | /api/users/:phone | 更新用户（需管理员权限） |
| DELETE | /api/users/:phone | 删除用户（需管理员权限） |

### 其他 API
- `/api/orders` - 订单管理
- `/api/rentals` - 租借管理
- `/api/partners` - 搭子管理
- `/api/products` - 商品管理

## 🔐 默认账号

### 管理员账号
| 账号 | 密码 | 角色 |
|------|------|------|
| admin | admin123 | 超级管理员 |
| manager | manager123 | 运营经理 |
| operator | operator123 | 运营专员 |

### 测试用户
| 账号 | 密码 |
|------|------|
| 13800138000 | 123456 |

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 📝 技术栈

- **前端**: HTML5, CSS3, JavaScript (原生)
- **后端**: Vercel Serverless Functions (Node.js)
- **认证**: JWT (JSON Web Token)
- **存储**: 内存存储（可扩展为数据库）

## 📄 License

MIT License
