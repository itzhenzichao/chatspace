/**
 * TimeDivider 组件 —— 消息时间分隔线
 *
 * 功能：
 * - 在消息列表中显示时间分隔标记（如"今天"、"昨天"、"更早"）
 * - 使用 Ant Design Divider 的 plain 样式，视觉上不突兀
 *
 * 知识点：Ant Design Divider、简单 Props 类型定义
 */

import { Divider } from 'antd';

/** TimeDivider 的 Props 类型 */
interface TimeDividerProps {
  text: string;   // 分隔线显示的时间文本
}

export default function TimeDivider({ text }: TimeDividerProps) {
  return (
    <Divider plain style={{ color: '#999', fontSize: 12, margin: '8px 0' }}>
      {text}
    </Divider>
  );
}