/**
 * 消息相关类型定义
 * 定义聊天消息的类型和结构
 */

/** 消息类型联合类型 —— 支持三种消息形式 */
export type MessageType = 'text' | 'image' | 'system';
// text:   普通文字消息
// image:  图片消息（content 为图片 URL）
// system: 系统通知消息（如"某某加入了群聊"）

/** 消息接口 —— 表示一条聊天消息的完整数据 */
export interface Message {
  id: string;             // 消息唯一标识
  roomId: string;         // 所属聊天室 ID
  senderId: string;       // 发送者用户 ID
  type: MessageType;      // 消息类型（文字/图片/系统）
  content: string;        // 消息内容（文字内容或图片 URL）
  timestamp: number;      // 发送时间戳（毫秒）
}