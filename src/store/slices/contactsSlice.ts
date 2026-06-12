/**
 * 联系人 Slice —— 管理联系人列表和搜索关键词
 *
 * 当前为简单实现，联系人列表从 mock 数据初始化
 * 搜索关键词用于前端过滤联系人列表
 */

import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types/user';
import { mockContacts } from '../../mocks/data/contacts';

/** 联系人模块的状态类型 */
interface ContactsState {
  contacts: User[];          // 联系人列表
  searchKeyword: string;     // 搜索关键词（配合 useDebounce 使用）
}

/** 初始状态 —— 从 mock 数据初始化联系人列表 */
const initialState: ContactsState = {
  contacts: mockContacts,
  searchKeyword: '',
};

/** 联系人 Slice 定义 */
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,

  reducers: {
    /** 设置搜索关键词 —— 配合 useDebounce Hook 实现防抖搜索 */
    setSearchKeyword(state, action) {
      state.searchKeyword = action.payload;
    },
  },
});

// 导出 actions
export const { setSearchKeyword } = contactsSlice.actions;
// 导出 reducer
export default contactsSlice.reducer;