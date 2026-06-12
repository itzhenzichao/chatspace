/**
 * Mock 用户数据
 * 模拟系统中注册的用户列表，用于登录验证和展示
 * 所有测试账号密码统一为 123456
 */

import type { User } from '../../types/user';

/** Mock 用户列表 —— 5 个预设用户，覆盖不同在线状态 */
export const mockUsers: User[] = [
  {
    id: 'u1',              // 当前登录用户默认为此人
    username: 'zhangsan',
    nickname: '张三',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
    status: 'online',      // 在线状态
  },
  {
    id: 'u2',
    username: 'lisi',
    nickname: '李四',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
    status: 'busy',        // 忙碌状态
  },
  {
    id: 'u3',
    username: 'wangwu',
    nickname: '王五',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
    status: 'offline',     // 离线状态
  },
  {
    id: 'u4',
    username: 'zhaoliu',
    nickname: '赵六',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu',
    status: 'online',
  },
  {
    id: 'u5',
    username: 'sunqi',
    nickname: '孙七',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunqi',
    status: 'online',
  },
];