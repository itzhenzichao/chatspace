/**
 * useDebounce Hook —— 防抖 Hook
 *
 * 用于延迟更新值，避免频繁触发搜索等操作
 * 在用户停止输入指定时间后才更新值，减少不必要的渲染或请求
 *
 * 使用示例（搜索防抖）：
 *   const [keyword, setKeyword] = useState('');
 *   const debouncedKeyword = useDebounce(keyword, 300);
 *   // 用 debouncedKeyword 去做实际的搜索/过滤
 *
 * @param value - 需要防抖的值
 * @param delay - 防抖延迟时间（毫秒）
 * @returns 防抖后的值
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  // 防抖后的值，初始与原值相同
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 每次 value 变化时，设置一个定时器在 delay 毫秒后更新
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // 清理函数：如果 value 在 delay 时间内再次变化，取消前一个定时器
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}