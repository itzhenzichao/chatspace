/**
 * Redux 类型安全 Hook
 * 对 react-redux 提供的 useDispatch 和 useSelector 进行类型预绑定
 * 避免在每个组件中手动声明 RootState / AppDispatch 类型
 *
 * 使用方式：
 *   const dispatch = useAppDispatch();
 *   const user = useAppSelector(state => state.auth.user);
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/** 类型安全的 dispatch Hook —— 自动推断异步 thunk 返回类型 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** 类型安全的 selector Hook —— 自动推断 state 类型 */
export const useAppSelector = useSelector.withTypes<RootState>();