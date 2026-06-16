/**
 * 认证 Slice —— 管理用户登录/登出/信息更新等状态
 *
 * 包含：
 * - 同步 actions: logout（登出）、clearError（清除错误）、updateProfile（更新信息）
 * - 异步 thunk: login（模拟异步登录）
 * - 自动将 token 和用户信息持久化到 localStorage
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, LoginParams } from '../../types/user';
import { getStorageItem, setStorageItem, removeStorageItem } from '../../utils/storage';
import { TOKEN_KEY, USER_KEY } from '../../utils/constants';
import { mockUsers } from '../../mocks/data/users';

/** 认证模块的状态类型 */
export interface AuthState {
  user: User | null;        // 当前登录用户信息，未登录为 null
  token: string | null;     // 登录 Token，未登录为 null
  isAuthenticated: boolean; // 是否已登录
  loading: boolean;         // 登录请求是否进行中
  error: string | null;     // 登录错误信息
}

/** 初始状态 —— 从 localStorage 恢复登录态（实现刷新不丢失） */
const initialState: AuthState = {
  user: getStorageItem<User | null>(USER_KEY, null),
  token: getStorageItem<string | null>(TOKEN_KEY, null),
  isAuthenticated: !!getStorageItem<string | null>(TOKEN_KEY, null),  // 有 token 即为已登录
  loading: false,
  error: null,
};

/**
 * 异步登录 thunk —— 模拟登录请求
 * 在 mockUsers 中查找用户名，并验证密码（统一为 123456）
 * 返回用户信息和 mock token
 */
export const login = createAsyncThunk(
  'auth/login',
  async (params: LoginParams, { rejectWithValue }) => {
    // 在 mock 用户列表中查找匹配的用户名
    const user = mockUsers.find(
      (u) => u.username === params.username
    );
    // 用户不存在或密码错误，返回错误信息
    if (!user || params.password !== '123456') {
      return rejectWithValue('用户名或密码错误');
    }
    // 生成 mock token
    const token = `mock_token_${user.id}_${Date.now()}`;
    return { user, token };
  }
);

/** 认证 Slice 定义 */
const authSlice = createSlice({
  name: 'auth',
  initialState,

  /** 同步 reducers —— 直接修改状态的逻辑 */
  reducers: {
    /** 登出 —— 清空用户信息和 token，同时清除 localStorage */
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      removeStorageItem(TOKEN_KEY);
      removeStorageItem(USER_KEY);
    },

    /** 清除错误信息 —— 用于切换登录/注册标签页时重置错误 */
    clearError(state) {
      state.error = null;
    },

    /** 更新用户信息 —— 支持部分更新（Partial<User>），同时同步到 localStorage */
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        setStorageItem(USER_KEY, state.user);
      }
    },
  },

  /** 异步 reducers —— 处理 login thunk 的三种状态 */
  extraReducers: (builder) => {
    builder
      // 请求中：显示加载状态，清除旧错误
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 请求成功：保存用户信息和 token，标记为已登录，持久化到 localStorage
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        setStorageItem(TOKEN_KEY, action.payload.token);
        setStorageItem(USER_KEY, action.payload.user);
      })
      // 请求失败：保存错误信息
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// 导出同步 actions
export const { logout, clearError, updateProfile } = authSlice.actions;
// 导出 reducer（给 store 使用）
export default authSlice.reducer;