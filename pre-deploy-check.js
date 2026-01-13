#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 确保数据库状态正常，避免部署失败
 */

const { execSync } = require('child_process');

async function preDeployCheck() {
    console.log('🔍 开始部署前检查...\n');
    
    try {
        // 1. 检查数据库是否存在
        console.log('📋 检查数据库状态...');
        const dbList = execSync('npx wrangler d1 list', { encoding: 'utf8' });
        
        if (!dbList.includes('temp_email_db')) {
            console.log('❌ 数据库 temp_email_db 不存在');
            console.log('💡 建议运行: node database-recovery.js');
            process.exit(1);
        }
        
        console.log('✅ 数据库存在');
        
        // 2. 检查表结构
        console.log('🗃️  检查数据库表结构...');
        const tableCheck = execSync('npx wrangler d1 execute temp_email_db --command="SELECT name FROM sqlite_master WHERE type=\"table\";"', { encoding: 'utf8' });
        
        const requiredTables = ['mailboxes', 'messages', 'domains', 'attachments'];
        const existingTables = tableCheck.match(/\| ([a-z_]+) \|/g)?.map(t => t.replace(/\| ([a-z_]+) \|/, '$1')) || [];
        
        const missingTables = requiredTables.filter(table => !existingTables.includes(table));
        
        if (missingTables.length > 0) {
            console.log('❌ 缺少必要的表:', missingTables.join(', '));
            console.log('💡 建议运行: npx wrangler d1 execute temp_email_db --file=./d1-init.sql');
            process.exit(1);
        }
        
        console.log('✅ 表结构完整');
        
        // 3. 检查环境变量
        console.log('🔧 检查环境变量配置...');
        try {
            const envCheck = execSync('npx wrangler secret list', { encoding: 'utf8' });
            if (!envCheck.includes('TEMP_MAIL_DB_ID')) {
                console.log('⚠️  环境变量 TEMP_MAIL_DB_ID 未设置，但数据库存在，可以继续部署');
            } else {
                console.log('✅ 环境变量已配置');
            }
        } catch (error) {
            console.log('⚠️  无法检查环境变量，但可以继续部署');
        }
        
        console.log('\n🎉 所有检查通过！可以安全部署');
        
    } catch (error) {
        console.error('❌ 检查失败:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    preDeployCheck();
}

module.exports = { preDeployCheck };