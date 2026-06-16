/**
 * useDebounce Hook 单元测试
 *
 * 测试覆盖：
 * - 值在延迟时间后更新
 * - 快速连续变化时只保留最终值
 * - 延迟时间为 0 时立即更新
 *
 * 知识点：
 * - Vitest vi.useFakeTimers / vi.advanceTimersByTime
 * - React Hook 测试使用 renderHook
 * - @testing-library/react 的 renderHook API
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    // 使用假定时器以便精确控制时间推进
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 恢复真实定时器
    vi.useRealTimers();
  });

  it('延迟时间到达后更新值', () => {
    // 初始值为 'hello'
    const { result } = renderHook(() => useDebounce('hello', 300));

    // 延迟未到达时，防抖值仍为旧值
    expect(result.current).toBe('hello');

    // 推进时间 300ms，防抖值应更新
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('hello');
  });

  it('快速连续变化时只保留最终值', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    );

    // 初始防抖值为 'a'
    expect(result.current).toBe('a');

    // 快速连续修改值 3 次
    rerender({ value: 'b', delay: 300 });
    rerender({ value: 'c', delay: 300 });
    rerender({ value: 'd', delay: 300 });

    // 100ms 后，防抖值仍为 'a'（因为每次变化都重置了定时器）
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe('a');

    // 再推进 200ms（总计 300ms），定时器触发，防抖值更新为最终值 'd'
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current).toBe('d');
  });

  it('延迟为 0 时立即更新', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    rerender({ value: 'updated', delay: 0 });

    // delay=0 时 setTimeout(fn, 0) 立即执行
    act(() => { vi.advanceTimersByTime(0); });
    expect(result.current).toBe('updated');
  });
});
