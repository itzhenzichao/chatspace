/**
 * UI Slice —— 管理全局 UI 相关状态
 *
 * 包括：
 * - theme: 当前主题（亮色/暗色），配合 Ant Design ConfigProvider 切换
 * - sidebarCollapsed: 侧边栏是否折叠（预留，移动端适配用）
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/** UI 模块的状态类型 */
interface UiState {
  theme: 'light' | 'dark';      // 当前主题模式
  sidebarCollapsed: boolean;     // 侧边栏是否折叠
}

/** 初始状态 —— 默认亮色主题，侧边栏展开 */
const initialState: UiState = {
  theme: 'light',
  sidebarCollapsed: false,
};

/** UI Slice 定义 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,

  reducers: {
    /** 切换主题 —— 在亮色和暗色之间切换 */
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    /** 设置指定主题 —— 直接设置亮色或暗色 */
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },

    /** 切换侧边栏折叠状态 */
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

// 导出 actions
export const { toggleTheme, setTheme, toggleSidebar } = uiSlice.actions;
// 导出 reducer
export default uiSlice.reducer;