# 临时邮箱服务部署指南

## 1. 准备工作

### 1.1 Cloudflare账户设置
1. 注册/登录 [Cloudflare账户](https://dash.cloudflare.com)
2. 确保已激活Workers服务

### 1.2 创建API Token
1. 访问 [API Tokens页面](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 "Create Token"
3. 使用 "Edit Cloudflare Workers" 模板
4. 或自定义以下权限：
   - Account: Workers Scripts: Edit
   - Account: Workers KV Storage: Edit
   - Account: Workers D1: Edit
   - Account: Workers R2: Edit
5. 复制生成的Token（只显示一次）

## 2. 本地环境配置

### 2.1 设置环境变量
创建 `.env` 文件（基于 `.env.example`）：

```bash
# 复制示例文件
cp .env.example .env
```

编辑 `.env` 文件：
```env
CLOUDFLARE_API_TOKEN=你的API Token
CLOUDFLARE_ACCOUNT_ID=你的账户ID
RESEND_API_KEY=你的Resend API Key（可选）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=你的管理员密码
```

### 2.2 Windows环境变量设置

#### PowerShell：
```powershell
$env:CLOUDFLARE_API_TOKEN="你的API Token"
```

#### CMD：
```cmd
set CLOUDFLARE_API_TOKEN=你的API Token
```

## 3. 部署步骤

### 3.1 登录Wrangler（可选）
```bash
npm run wrangler login
```

### 3.2 创建D1数据库
```bash
npm run d1:create
```

### 3.3 初始化数据库
```bash
# 本地测试
npm run d1:execute:local

# 生产环境
npm run d1:execute:remote
```

### 3.4 部署Worker
```bash
npm run deploy
```

## 4. 生产环境配置

### 4.1 GitHub Actions（自动部署）
项目已配置CI/CD，在GitHub仓库的Settings中设置以下Secrets：
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### 4.2 环境变量设置
在Cloudflare Dashboard中设置环境变量：
1. 进入Workers & Pages
2. 选择你的Worker
3. 点击 "Settings" -> "Variables"
4. 添加生产环境变量

## 5. 验证部署

### 5.1 检查Worker状态
```bash
npx wrangler whoami
npx wrangler deployments list
```

### 5.2 测试服务
访问你的Worker域名进行测试：
- 主页面：`https://你的worker域名.workers.dev`
- API端点：`https://你的worker域名.workers.dev/api/health`

## 6. 故障排除

### 6.1 常见错误

**错误：CLOUDFLARE_API_TOKEN required**
- 确保已设置环境变量
- 检查Token权限是否正确

**错误：Database not found**
- 运行 `npm run d1:create`
- 运行 `npm run d1:execute:remote`

### 6.2 日志查看
```bash
npx wrangler tail
```

## 7. 后续维护

### 7.1 更新部署
```bash
git pull origin main
npm run deploy
```

### 7.2 数据库管理
```bash
# 查看数据库状态
npm run d1:query:remote

# 执行SQL查询
npx wrangler d1 execute TEMP_MAIL_DB --remote --command="SELECT * FROM mailboxes LIMIT 5;"
```

## 8. 安全建议

1. **定期轮换API Token**
2. **使用强密码**
3. **启用双因素认证**
4. **监控Worker使用情况**
5. **定期备份数据库**

---

如有问题，请参考项目文档或创建Issue。