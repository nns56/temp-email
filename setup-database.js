// D1数据库初始化脚本
// 运行前请确保已安装wrangler并登录Cloudflare

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

async function setupDatabase() {
  try {
    console.log('开始设置D1数据库...');
    
    // 检查wrangler是否可用
    try {
      execSync('wrangler --version', { stdio: 'pipe' });
    } catch (error) {
      console.error('❌ 未找到wrangler，请先安装: npm install -g wrangler');
      console.error('然后运行: wrangler login');
      return;
    }
    
    // 创建D1数据库
    console.log('创建D1数据库...');
    try {
      execSync('wrangler d1 create temp_email_db', { stdio: 'inherit' });
    } catch (error) {
      console.log('数据库可能已存在，继续执行初始化...');
    }
    
    // 执行初始化SQL
    console.log('执行数据库初始化...');
    const sqlContent = readFileSync('./d1-init.sql', 'utf8');
    
    // 分割SQL语句并执行
    const sqlStatements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    for (const stmt of sqlStatements) {
      if (stmt.trim()) {
        try {
          execSync(`wrangler d1 execute temp_email_db --command "${stmt.trim()};"`, { stdio: 'pipe' });
        } catch (error) {
          console.warn(`警告: 执行SQL语句时出错: ${stmt.substring(0, 50)}...`);
        }
      }
    }
    
    console.log('✅ 数据库设置完成！');
    console.log('接下来请运行: npm run deploy');
    
  } catch (error) {
    console.error('❌ 数据库设置失败:', error.message);
  }
}

// 手动执行方法
export async function manualSetup() {
  console.log('手动设置步骤:');
  console.log('1. 安装wrangler: npm install -g wrangler');
  console.log('2. 登录Cloudflare: wrangler login');
  console.log('3. 创建数据库: wrangler d1 create temp_email_db');
  console.log('4. 执行SQL: wrangler d1 execute temp_email_db --file d1-init.sql');
  console.log('5. 部署: npm run deploy');
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export default setupDatabase;