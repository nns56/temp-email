import { describe, it, expect, vi } from 'vitest';
import { generateRandomId, isValidEmail, formatTimestamp } from './commonUtils.js';

describe('通用工具函数测试', () => {
  describe('generateRandomId', () => {
    it('应该生成指定长度的随机ID', () => {
      const id = generateRandomId(10);
      expect(id).toHaveLength(10);
      expect(/^[a-zA-Z0-9]+$/.test(id)).toBe(true);
    });

    it('默认长度应为16', () => {
      const id = generateRandomId();
      expect(id).toHaveLength(16);
    });
  });

  describe('isValidEmail', () => {
    it('应该验证有效的邮箱地址', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('应该拒绝无效的邮箱地址', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('formatTimestamp', () => {
    it('应该正确格式化时间戳', () => {
      const timestamp = 1704960000000; // 2024-01-11 00:00:00 UTC
      const formatted = formatTimestamp(timestamp);
      expect(formatted).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    });

    it('应该处理当前时间', () => {
      const formatted = formatTimestamp();
      expect(formatted).toBeDefined();
    });
  });
});