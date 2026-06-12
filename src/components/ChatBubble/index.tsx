/**
 * ChatBubble 组件 —— 聊天消息气泡
 *
 * 功能：
 * - 区分自己和他人的消息（自己右对齐蓝色，他人左对齐灰色）
 * - 系统通知消息居中显示（灰色标签样式）
 * - 图片消息渲染为 img 标签
 * - 显示发送者昵称（仅他人消息）
 * - 显示格式化后的时间戳
 *
 * 知识点：条件渲染、联合类型 MessageType、Props 接口定义、Ant Design Tag
 */

import { Tag } from 'antd';
import { formatTime } from '../../utils/format';

/** ChatBubble 的 Props 类型 */
interface ChatBubbleProps {
  content: string;                   // 消息内容（文字或图片 URL）
  timestamp: number;                 // 发送时间戳（毫秒）
  isSelf: boolean;                   // 是否是自己发的消息
  senderName: string;                // 发送者昵称
  type: 'text' | 'image' | 'system'; // 消息类型
}

export default function ChatBubble({ content, timestamp, isSelf, senderName, type }: ChatBubbleProps) {
  // 系统通知消息：居中显示，使用 Ant Design Tag 样式
  if (type === 'system') {
    return (
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <Tag color="default">{content}</Tag>
      </div>
    );
  }

  // 普通消息（文字/图片）：根据 isSelf 决定对齐方向和颜色
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isSelf ? 'flex-end' : 'flex-start', // 自己靠右，他人靠左
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: '70%',                                   // 限制最大宽度避免长文本撑满
          padding: '8px 12px',
          borderRadius: isSelf ? '12px 12px 4px 12px' : '12px 12px 12px 4px', // 圆角方向区分自己/他人
          backgroundColor: isSelf ? '#1677ff' : '#f0f0f0',   // 蓝色=自己，灰色=他人
          color: isSelf ? '#fff' : '#000',                   // 文字颜色适配背景色
        }}
      >
        {/* 仅他人消息显示发送者昵称 */}
        {!isSelf && (
          <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>{senderName}</div>
        )}
        {/* 图片消息渲染 img 标签，文字消息直接显示文本 */}
        {type === 'image' ? (
          <img src={content} alt="图片消息" style={{ maxWidth: '100%', borderRadius: 8 }} />
        ) : (
          <div style={{ wordBreak: 'break-word' }}>{content}</div>
        )}
        {/* 格式化后的时间戳 */}
        <div style={{ fontSize: 11, color: isSelf ? '#e6e6e6' : '#999', marginTop: 4 }}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
}