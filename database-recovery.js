#!/usr/bin/env node

/**
 * D1 数据库自动恢复脚本
 * 当数据库被意外删除时，自动重新创建并初始化
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function recoverDatabase() {
    console.log('🔧 开始检查并恢复 D1 数据库...\n');
    
    try {
        // 1. 检查数据库是否存在
        console.log('📋 检查当前数据库状态...');
        const dbList = execSync('npx wrangler d1 list', { encoding: 'utf8' });
        
        if (dbList.includes('temp_email_db')) {
            console.log('✅ 数据库 temp_email_db 存在，无需恢复');
            return;
        }
        
        console.log('⚠️  数据库 temp_email_db 不存在，开始恢复...');
        
        // 2. 创建新数据库
        console.log('📦 创建新数据库...');
        const createOutput = execSync('npx wrangler d1 create temp_email_db', { encoding: 'utf8' });
        console.log('✅ 数据库创建成功');
        
        // 3. 提取数据库ID
        const dbIdMatch = createOutput.match(/Database ID: ([a-f0-9-]+)/);
        if (!dbIdMatch) {
            throw new Error('无法提取数据库ID');
        }
        const dbId = dbIdMatch[1];
        
        // 4. 更新环境变量
        console.log('🔧 更新环境变量...');
        execSync(`npx wrangler secret put TEMP_MAIL_DB_ID`, { 
            input: dbId,
            encoding: 'utf8' 
        });
        
        // 5. 初始化数据库表结构
        console.log('🗃️  初始化数据库表结构...');
        execSync('npx wrangler d1 execute temp_email_db --file=./d1-init.sql', { encoding: 'utf8' });
        
        // 6. 验证数据库
        console.log('🔍 验证数据库状态...');
        const verifyOutput = execSync('npx wrangler d1 execute temp_email_db --command="SELECT name FROM sqlite_master WHERE type=\"table\";"', { encoding: 'utf8' });
        
        console.log('✅ 数据库恢复完成！');
        console.log(`📊 数据库ID: ${dbId}`);
        console.log('📋 数据库表结构:');
        console.log(verifyOutput);
        
    } catch (error) {
        console.error('❌ 数据库恢复失败:', error.message);
        process.exit(1);
    }
}

// 创建便捷的命令行工具
if (require.main === module) {
    recoverDatabase();
}

module.exports = { recoverDatabase };