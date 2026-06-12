/**
 * 聊天室相关类型定义
 * 定义聊天室及其成员的数据结构
 */

import type { Message } from './message';

/** 聊天室类型联合类型 —— 区分群聊和私聊 */
export type ChatRoomType = 'group' | 'private';
// group:   群聊聊天室
// private: 私聊聊天室（一对一）

/** 聊天室接口 —— 表示一个聊天室的完整信息 */
export interface ChatRoom {
  id: string;               // 聊天室唯一标识
  name: string;             // 聊天室名称（群聊名称或私聊对方昵称）
  avatar: string;           // 聊天室头像 URL
  type: ChatRoomType;       // 聊天室类型（群聊/私聊）
  members: string[];        // 成员用户 ID 列表
  lastMessage?: Message;    // 最后一条消息（可选，新聊天室可能没有）
  unreadCount: number;      // 未读消息数量
}

/** 聊天室成员接口 —— 表示成员在聊天室中的角色信息 */
export interface ChatRoomMember {
  userId: string;           // 用户 ID
  role: 'owner' | 'member'; // 角色：群主/普通成员
  joinedAt: number;         // 加入时间戳
}