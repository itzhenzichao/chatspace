/**
 * Redux Store 类型导出文件
 * 将 RootState 和 AppDispatch 从 store 中导出，
 * 方便在其他文件中引用 Redux 的类型定义
 */

import type { RootState, AppDispatch } from '../store';

/** RootState 类型别名 —— 表示整个 Redux Store 的状态树类型 */
export type RootStateType = RootState;

/** AppDispatch 类型别名 —— 表示 Redux dispatch 函数的类型（含异步 thunk 支持） */
export type AppDispatchType = AppDispatch;