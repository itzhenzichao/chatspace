/**
 * 路由守卫组件 —— 保护需要登录才能访问的页面
 *
 * 检查 Redux 中的 isAuthenticated 状态：
 * - 已登录：正常渲染子组件
 * - 未登录：重定向到登录页（/login）
 *
 * 使用方式：
 *   <ProtectedRoute><Layout /></ProtectedRoute>
 *
 * 知识点：React Router Navigate 组件、useAppSelector 读取 Redux 状态
 */

import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

/** ProtectedRoute 的 Props 类型 —— children 为被保护的子组件 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // 从 Redux 中读取认证状态
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // 未登录则跳转到登录页，replace 确保不能通过浏览器后退回来
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 已登录则正常渲染子组件
  return <>{children}</>;
}