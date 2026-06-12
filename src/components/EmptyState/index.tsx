/**
 * EmptyState 组件 —— 空状态占位显示
 *
 * 功能：
 * - 当没有数据时显示空状态提示
 * - 使用 Ant Design Empty 组件
 * - 支持自定义提示文字
 *
 * 知识点：Ant Design Empty、可选 Props 默认值
 */

import { Empty } from 'antd';

/** EmptyState 的 Props 类型 */
interface EmptyStateProps {
  description?: string;   // 提示文字（可选，默认"暂无数据"）
}

export default function EmptyState({ description = '暂无数据' }: EmptyStateProps) {
  return <Empty description={description} style={{ padding: '48px 0' }} />;
}