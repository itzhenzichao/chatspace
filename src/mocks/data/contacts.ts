/**
 * Mock 联系人数据
 * 模拟当前用户的联系人列表
 * 从 mockUsers 中过滤掉自己（u1），其余都是联系人
 */

import type { User } from '../../types/user';
import { mockUsers } from './users';

/** Mock 联系人列表 —— 排除当前用户 u1 后的所有用户 */
export const mockContacts: User[] = mockUsers.filter((u) => u.id !== 'u1');