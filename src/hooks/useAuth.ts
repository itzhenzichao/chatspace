/**
 * useAuth Hook —— 认证逻辑的封装
 *
 * 将 Redux 中 auth 相关的 state 和 dispatch 操作聚合到一个 Hook 中
 * 组件中使用此 Hook 即可获取用户信息和登录/登出方法
 * 不需要分别引入 useAppSelector 和 useAppDispatch
 *
 * 使用示例：
 *   const { user, isAuthenticated, login, logout } = useAuth();
 */

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { login, logout } from '../store/slices/authSlice';
import type { LoginParams } from '../types/user';

export function useAuth() {
  const dispatch = useAppDispatch();
  // 从 Redux 中解构认证相关的状态
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  // 封装 dispatch 调用，简化组件中的使用
  const handleLogin = (params: LoginParams) => dispatch(login(params));
  const handleLogout = () => dispatch(logout());

  return { user, isAuthenticated, loading, error, login: handleLogin, logout: handleLogout };
}