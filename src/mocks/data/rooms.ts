/**
 * Mock 聊天室数据
 * 模拟系统中已有的聊天室列表，包含群聊和私聊两种类型
 */

import type { ChatRoom } from '../../types/chatroom';

/** Mock 聊天室列表 —— 4 个预设聊天室 */
export const mockRooms: ChatRoom[] = [
  {
    id: 'r1',
    name: '前端技术交流群',   // 群聊名称
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=frontend',
    type: 'group',            // 群聊类型
    members: ['u1', 'u2', 'u3', 'u4'],  // 群成员 ID 列表
    unreadCount: 3,           // 3 条未读消息
  },
  {
    id: 'r2',
    name: '项目组',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=project',
    type: 'group',
    members: ['u1', 'u2', 'u5'],
    unreadCount: 0,           // 无未读消息
  },
  {
    id: 'r3',
    name: '李四',              // 私聊显示对方昵称
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    type: 'private',           // 私聊类型
    members: ['u1', 'u2'],    // 只有两个成员
    unreadCount: 1,
  },
  {
    id: 'r4',
    name: '摸鱼大队',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=fish',
    type: 'group',
    members: ['u1', 'u2', 'u3', 'u4', 'u5'],
    unreadCount: 5,
  },
];