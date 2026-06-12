/**
 * 路由配置文件
 *
 * 使用 React Router v6 的 createBrowserRouter 创建路由配置
 * 路由结构：
 *   /login      —— 登录注册页（无需认证）
 *   /           —— 主应用布局（需要认证，被 ProtectedRoute 保护）
 *     /chat     —— 聊天主页面（默认页）
 *     /contacts —— 联系人页面
 *     /profile  —— 个人信息页面
 *
 * 知识点：createBrowserRouter、嵌套路由（children）、Outlet、路由守卫
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Chat from '../pages/Chat';
import Contacts from '../pages/Contacts';
import Profile from '../pages/Profile';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,    // 登录页不需要认证保护
  },
  {
    path: '/',
    // 使用 ProtectedRoute 包裹 Layout，确保所有子路由都需要登录
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    // 嵌套路由 —— 在 Layout 的 Outlet 中渲染
    children: [
      { index: true, element: <Navigate to="/chat" replace /> },  // 根路径重定向到聊天页
      { path: 'chat', element: <Chat /> },        // 聊天页面
      { path: 'contacts', element: <Contacts /> }, // 联系人页面
      { path: 'profile', element: <Profile /> },   // 个人信息页面
    ],
  },
]);

export default router;