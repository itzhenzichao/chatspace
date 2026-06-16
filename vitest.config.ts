/**
 * Vitest 配置文件
 *
 * 功能：
 * - 配置 jsdom 测试环境（模拟浏览器 DOM）
 * - 启用全局 API（describe/it/expect 无需手动 import）
 * - 复用 Vite React 插件处理 JSX/TSX
 *
 * 知识点：
 * - vitest/config 的 defineConfig
 * - jsdom 测试环境模拟浏览器 API
 * - globals: true 自动注入测试全局变量
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',     // 使用 jsdom 模拟浏览器环境
    globals: true,            // 自动注入 describe/it/expect 等全局变量
  },
});
