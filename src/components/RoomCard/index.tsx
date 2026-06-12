/**
 * RoomCard 组件 —— 聊天室列表中的单个聊天室卡片
 *
 * 功能：
 * - 显示聊天室头像、名称、最后一条消息预览
 * - 显示未读消息数量（Ant Design Badge）
 * - 显示最后消息的时间
 * - 当前激活的聊天室高亮显示（蓝色背景）
 * - 点击触发切换聊天室
 *
 * 知识点：Ant Design Badge、Props 接口定义、条件渲染、事件回调 onClick
 */

import { Badge } from 'antd';
import { formatTime } from '../../utils/format';

/** RoomCard 的 Props 类型 */
interface RoomCardProps {
  name: string;                  // 聊天室名称
  avatar: string;                // 聊天室头像 URL
  lastMessageContent?: string;   // 最后一条消息内容（可选，新聊天室可能没有）
  lastMessageTime?: number;      // 最后一条消息时间戳（可选）
  unreadCount: number;           // 未读消息数量
  isActive: boolean;             // 是否为当前激活的聊天室
  onClick: () => void;           // 点击回调函数
}

export default function RoomCard({
  name,
  avatar,
  lastMessageContent,
  lastMessageTime,
  unreadCount,
  isActive,
  onClick,
}: RoomCardProps) {
  return (
    <div
      onClick={onClick}   // 点击切换聊天室
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        cursor: 'pointer',
        backgroundColor: isActive ? '#e6f4ff' : 'transparent', // 激活时蓝色高亮
        transition: 'background-color 0.2s',                    // 背景色过渡动画
      }}
    >
      {/* 头像 + 未读消息徽标 */}
      <Badge count={unreadCount} offset={[-4, 4]}>
        <img
          src={avatar}
          alt={name}
          style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#f0f0f0' }}
        />
      </Badge>
      {/* 聊天室名称 + 最后消息预览 */}
      <div style={{ flex: 1, marginLeft: 12, overflow: 'hidden' }}>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{name}</div>
        <div
          style={{
            fontSize: 12,
            color: '#999',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',    // 超长文本显示省略号
          }}
        >
          {lastMessageContent || '暂无消息'}
        </div>
      </div>
      {/* 最后消息时间（仅在有时间戳时显示） */}
      {lastMessageTime && (
        <div style={{ fontSize: 11, color: '#999', marginLeft: 8 }}>
          {formatTime(lastMessageTime)}
        </div>
      )}
    </div>
  );
}