/**
 * 聯由配置文件
 *
 * 使用 React Router v6 的 createBrowserRouter 创建路由配置
 * 页面组件使用 React.lazy + Suspense 实现按路由懒加载
 * 路由结构：
 *   /login      —— 登录注册页（无需认证）
 *   /           —— 主应用布局（需要认证，被 ProtectedRoute 保护）
 *     /chat     —— 聊天主页面（默认页）
 *     /contacts —— 联系人页面
 *     /profile  —— 个人信息页面
 *
 * 知识点：createBrowserRouter、嵌套路由（children）、Outlet、路由守卫
 *         React.lazy 动态导入、Suspense 加载占位、代码分割优化首屏加载
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// 懒加载页面组件 —— 每个页面独立打包，首屏只加载当前路由对应的 chunk
const Login = lazy(() => import('../pages/Login'));
const Chat = lazy(() => import('../pages/Chat'));
const Contacts = lazy(() => import('../pages/Contacts'));
const Profile = lazy(() => import('../pages/Profile'));

/** Suspense 加载占位 —— 懒加载组件尚未就绪时显示 Ant Design Spin */
const LazyFallback = () => <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LazyFallback />}>
        <Login />    // 登录页不需要认证保护
      </Suspense>
    ),
  },
  {
    path: '/',
    // 使用 ProtectedRoute 包裹 Layout，确保所有子路由都需要登录
    // Layout 和 ProtectedRoute 不懒加载，因为它们是路由骨架，需要立即可用
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    // 嵌套路由 —— 在 Layout 的 Outlet 中渲染
    children: [
      { index: true, element: <Navigate to="/chat" replace /> },  // 根路径重定向到聊天页
      {
        path: 'chat',
        element: (
          <Suspense fallback={<LazyFallback />}>
            <Chat />        // 聊天页面（懒加载）
          </Suspense>
        ),
      },
      {
        path: 'contacts',
        element: (
          <Suspense fallback={<LazyFallback />}>
            <Contacts />     // 联系人页面（懒加载）
          </Suspense>
        ),
      },
      {
        path: 'profile/:userId?',      // userId 可选 —— 不传则显示当前登录用户
        element: (
          <Suspense fallback={<LazyFallback />}>
            <Profile />      // 个人信息页面（懒加载）
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
