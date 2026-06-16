/**
 * authSlice 单元测试
 *
 * 测试覆盖：
 * - login thunk 的 fulfilled 状态更新
 * - login thunk 的 rejected 状态更新
 * - logout action 清空状态
 * - clearError action 清除错误
 * - updateProfile action 部分更新用户信息
 * - login pending 状态设置 loading
 *
 * 知识点：
 * - Vitest describe/it/expect API
 * - Redux Toolkit createAsyncThunk 测试方法
 * - 通过模拟 fulfilled/rejected action 测试 extraReducers
 */

import { describe, it, expect, beforeEach } from 'vitest';
import authSlice, { login, logout, clearError, updateProfile } from '../authSlice';
import type { AuthState } from '../authSlice';

/** 构造一个干净的初始状态用于测试 */
const createInitialState = (): AuthState => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
});

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('login thunk', () => {
    it('fulfilled 时更新 user/token/isAuthenticated', () => {
      const state = createInitialState();
      // 模拟 login.fulfilled action 的 payload
      const mockUser = {
        id: 'u1',
        username: 'zhangsan',
        nickname: '张三',
        avatar: 'test.png',
        status: 'online' as const,
      };
      const action = login.fulfilled({ user: mockUser, token: 'mock_token' }, 'requestId', { username: 'zhangsan', password: '123456' });
      const newState = authSlice(state, action);

      expect(newState.user).toEqual(mockUser);
      expect(newState.token).toBe('mock_token');
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('rejected 时设置 error 信息', () => {
      const state = createInitialState();
      state.loading = true;
      // 模拟 login.rejected action
      const action = login.rejected(new Error('fail'), 'requestId', { username: 'zhangsan', password: 'wrong' }, '用户名或密码错误');
      const newState = authSlice(state, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('用户名或密码错误');
      expect(newState.isAuthenticated).toBe(false);
    });

    it('pending 状态设置 loading=true', () => {
      const state = createInitialState();
      const action = login.pending('requestId', { username: 'zhangsan', password: '123456' });
      const newState = authSlice(state, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });
  });

  describe('logout', () => {
    it('清空所有认证状态', () => {
      const loggedInState: AuthState = {
        user: { id: 'u1', username: 'zhangsan', nickname: '张三', avatar: 'test.png', status: 'online' },
        token: 'mock_token_u1_123',
        isAuthenticated: true,
        loading: false,
        error: null,
      };
      const newState = authSlice(loggedInState, logout());
      expect(newState.user).toBeNull();
      expect(newState.token).toBeNull();
      expect(newState.isAuthenticated).toBe(false);
      expect(newState.error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('清除错误信息', () => {
      const stateWithError: AuthState = {
        ...createInitialState(),
        error: '用户名或密码错误',
      };
      const newState = authSlice(stateWithError, clearError());
      expect(newState.error).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('部分更新昵称和头像', () => {
      const loggedInState: AuthState = {
        user: { id: 'u1', username: 'zhangsan', nickname: '张三', avatar: 'old.png', status: 'online' },
        token: 'mock_token',
        isAuthenticated: true,
        loading: false,
        error: null,
      };
      const newState = authSlice(loggedInState, updateProfile({ nickname: '新昵称', avatar: 'new.png' }));
      expect(newState.user?.nickname).toBe('新昵称');
      expect(newState.user?.avatar).toBe('new.png');
      // 未更新的字段保持不变
      expect(newState.user?.id).toBe('u1');
      expect(newState.user?.status).toBe('online');
    });
  });
});
