/**
 * Redux Store 配置文件
 * 使用 Redux Toolkit 的 configureStore 创建全局 Store
 * 合并所有 Slice 的 reducer，导出 RootState 和 AppDispatch 类型
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';        // 用户认证 reducer
import chatReducer from './slices/chatSlice';        // 聊天室与消息 reducer
import contactsReducer from './slices/contactsSlice'; // 联系人 reducer
import uiReducer from './slices/uiSlice';            // UI 状态（主题、侧边栏）reducer

/** 全局 Redux Store —— 整合所有模块的 reducer */
export const store = configureStore({
  reducer: {
    auth: authReducer,           // state.auth —— 用户认证状态
    chat: chatReducer,           // state.chat —— 聊天室与消息状态
    contacts: contactsReducer,   // state.contacts —— 联系人状态
    ui: uiReducer,               // state.ui —— UI 状态
  },
});

/** RootState 类型 —— 整个 Store 的状态树类型，用于 useSelector */
export type RootState = ReturnType<typeof store.getState>;

/** AppDispatch 类型 —— dispatch 函数类型（支持异步 thunk），用于 useDispatch */
export type AppDispatch = typeof store.dispatch;