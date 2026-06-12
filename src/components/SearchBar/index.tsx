/**
 * SearchBar 组件 —— 搜索输入框
 *
 * 功能：
 * - 提供带搜索图标和清除按钮的输入框
 * - 输入内容通过 onChange 回调传递给父组件
 * - 配合 useDebounce Hook 实现防抖搜索
 *
 * 知识点：Ant Design Input + SearchOutlined 图标、Props 接口、可选参数默认值
 */

import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

/** SearchBar 的 Props 类型 */
interface SearchBarProps {
  value: string;                    // 当前搜索关键词
  onChange: (value: string) => void; // 关键词变化回调
  placeholder?: string;              // 占位文字（可选，默认"搜索..."）
}

export default function SearchBar({ value, onChange, placeholder = '搜索...' }: SearchBarProps) {
  return (
    <Input
      prefix={<SearchOutlined />}        // 搜索图标前缀
      value={value}
      onChange={(e) => onChange(e.target.value)} // 将 Input 的 ChangeEvent 转为纯字符串
      placeholder={placeholder}
      allowClear                          // 允许一键清除输入内容
      style={{ margin: '8px 16px', width: 'calc(100% - 32px)' }}
    />
  );
}