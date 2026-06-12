/**
 * Contacts 页面 —— 联系人列表页面
 *
 * 功能：
 * - 显示好友/联系人列表（Ant Design List 组件）
 * - 每个联系人显示头像（含在线状态）、昵称、用户名、在线状态
 * - 支持搜索过滤（防抖 300ms）
 *
 * 知识点：
 * - Ant Design List + List.Item + List.Item.Meta 列表渲染
 * - useAppSelector 读取 Redux 联系人状态
 * - useDebounce 搜索防抖
 * - Record 类型定义状态映射
 * - String.prototype.includes 模糊搜索
 */

import { List } from 'antd';
import { useAppSelector } from '../../store/hooks';
import UserAvatar from '../../components/UserAvatar';
import SearchBar from '../../components/SearchBar';
import { useDebounce } from '../../hooks/useDebounce';
import { useState } from 'react';

/** 在线状态中文映射 */
const statusMap: Record<string, string> = {
  online: '在线',
  busy: '忙碌',
  offline: '离线',
};

export default function Contacts() {
  // 从 Redux 中读取联系人列表
  const contacts = useAppSelector((state) => state.contacts.contacts);
  // 搜索关键词状态
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);  // 300ms 防抖

  // 根据关键词过滤联系人（匹配昵称或用户名）
  const filtered = contacts.filter(
    (c) =>
      c.nickname.toLowerCase().includes(debouncedKeyword.toLowerCase()) ||
      c.username.toLowerCase().includes(debouncedKeyword.toLowerCase())
  );

  return (
    <div style={{ height: '100vh', backgroundColor: '#fafafa' }}>
      {/* 搜索框 */}
      <SearchBar value={keyword} onChange={setKeyword} placeholder="搜索联系人" />
      {/* 联系人列表 */}
      <List
        dataSource={filtered}
        renderItem={(contact) => (
          <List.Item style={{ padding: '8px 16px', cursor: 'pointer' }}>
            <List.Item.Meta
              avatar={<UserAvatar src={contact.avatar} size={40} status={contact.status} />}
              title={contact.nickname}
              description={`${contact.username} · ${statusMap[contact.status]}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
}