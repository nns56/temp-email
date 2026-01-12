// 部署前检查脚本

import { existsSync } from 'fs';

function checkDeployment() {
  console.log('🔍 检查部署配置...\n');
  
  const checks = [
    {
      name: 'package.json',
      check: () => existsSync('./package.json'),
      message: '✅ package.json存在',
      error: '❌ package.json不存在'
    },
    {
      name: 'wrangler.toml',
      check: () => existsSync('./wrangler.toml'),
      message: '✅ wrangler.toml存在',
      error: '❌ wrangler.toml不存在'
    },
    {
      name: 'D1初始化SQL',
      check: () => existsSync('./d1-init.sql'),
      message: '✅ d1-init.sql存在',
      error: '❌ d1-init.sql不存在'
    },
    {
      name: 'worker.js',
      check: () => existsSync('./worker.js'),
      message: '✅ worker.js存在',
      error: '❌ worker.js不存在'
    }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    if (check.check()) {
      console.log(check.message);
    } else {
      console.log(check.error);
      allPassed = false;
    }
  }
  
  console.log('\n📋 部署前准备清单:');
  console.log('1. ✅ 修复wrangler.toml配置（已完成）');
  console.log('2. 🔄 安装wrangler: npm install -g wrangler');
  console.log('3. 🔐 登录Cloudflare: wrangler login');
  console.log('4. 🗄️  创建D1数据库: wrangler d1 create temp_email_db');
  console.log('5. 📊 初始化数据库: wrangler d1 execute temp_email_db --file d1-init.sql');
  console.log('6. 🔧 设置环境变量（在Cloudflare Dashboard中）:');
  console.log('   - RESEND_API_KEY');
  console.log('   - ADMIN_USERNAME');
  console.log('   - ADMIN_PASSWORD');
  console.log('7. 🚀 部署: npm run deploy');
  
  if (allPassed) {
    console.log('\n✅ 所有基础检查通过！可以开始部署流程。');
  } else {
    console.log('\n❌ 部分检查未通过，请先解决上述问题。');
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  checkDeployment();
}

export default checkDeployment;