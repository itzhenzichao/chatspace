/**
 * Vite 构建配置
 *
 * 功能：
 * - React 插件支持 JSX/TSX 编译
 * - 构建分包（manualChunks）：将大型依赖拆为独立 chunk，优化缓存和并行加载
 *
 * 分包策略：
 * - vendor-react：React 核心（react + react-dom + react-router-dom）
 * - vendor-antd：Ant Design UI 库（体积最大，单独分包减少首屏加载）
 * - vendor-redux：Redux 状态管理（@reduxjs/toolkit + react-redux）
 *
 * 知识点：
 * - Vite defineConfig + rollupOptions.output.manualChunks
 * - 代码分割与缓存优化策略
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心库 —— 框架级依赖，变化频率低，适合长期缓存
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Ant Design UI 库 —— 体积最大的依赖，单独分包减少主 chunk 大小
          'vendor-antd': ['antd', '@ant-design/icons'],
          // Redux 状态管理 —— 业务逻辑依赖，独立于 UI 库
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
})
