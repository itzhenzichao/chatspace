/**
 * useLocalStorage Hook —— 带类型安全的 localStorage 状态管理
 *
 * 将 localStorage 中的值与 React state 同步
 * 读取时优先从 localStorage 获取，写入时同时更新 state 和 localStorage
 *
 * 泛型参数 T 确保类型安全：
 *   const [name, setName] = useLocalStorage<string>('name', '默认值');
 *
 * @param key - localStorage 的键名
 * @param initialValue - 默认值（localStorage 中无数据时使用）
 * @returns [当前值, 设置函数] —— 与 useState 返回格式一致
 */

import { useState } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // 初始化时从 localStorage 读取，如果没有则使用默认值
  const [storedValue, setStoredValue] = useState<T>(() => getStorageItem(key, initialValue));

  // 设置值时同时更新 React state 和 localStorage
  const setValue = (value: T) => {
    setStoredValue(value);
    setStorageItem(key, value);
  };

  return [storedValue, setValue];
}