/// <reference types="@cloudflare/workers-types" />

interface Env {
  // 数据库绑定
  TEMP_MAIL_DB: D1Database;
  
  // R2存储桶绑定
  MAIL_EML: R2Bucket;
  
  // 静态资源绑定
  ASSETS: Fetcher;
  
  // 环境变量
  JWT_SECRET: string;
  MAIL_DOMAIN: string;
  FORWARD_RULES: string;
  RESEND_API_KEY?: string;
  ADMIN_PASSWORD?: string;
  CACHE_TTL?: string;
  
  // 缓存系统类型
  CACHE: {
    tableStructure: Map<string, any>;
    mailboxIds: Map<string, any>;
    userQuotas: Map<string, any>;
    systemStats: Map<string, any>;
  };
}

// 全局类型定义
declare global {
  // 请求上下文扩展
  interface Request {
    user?: {
      id: string;
      username: string;
      role: 'admin' | 'user';
    };
    
    // 速率限制上下文
    rateLimit?: {
      key: string;
      count: number;
      limit: number;
      window: number;
      remaining: number;
      resetTime: number;
    };
  }
  
  // 邮件相关类型
  interface EmailMessage {
    id: string;
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
    timestamp: number;
    attachments?: Array<{
      filename: string;
      content: ArrayBuffer;
      contentType: string;
    }>;
  }
  
  // 用户类型
  interface User {
    id: string;
    username: string;
    password_hash: string;
    role: 'admin' | 'user';
    quota: number;
    created_at: number;
    last_login: number;
  }
  
  // 邮箱类型
  interface Mailbox {
    id: string;
    email: string;
    user_id: string;
    created_at: number;
    expires_at: number;
    is_active: boolean;
  }
  
  // API响应类型
  interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  // 日志类型
  interface LogEntry {
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    timestamp: number;
    context?: Record<string, any>;
  }
}