/**
 * Profile 页面 —— 个人信息页面
 *
 * 功能：
 * - 展示当前登录用户的个人信息
 * - 显示头像、昵称、在线状态标签
 * - 使用 Ant Design Descriptions 组件展示详细信息
 *
 * 知识点：
 * - Ant Design Card + Avatar + Tag + Descriptions 组件组合使用
 * - useAppSelector 读取 Redux 认证状态
 * - Record 类型映射状态颜色和文案
 * - 条件渲染（user 为 null 时返回 null）
 */

import { Card, Descriptions, Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../store/hooks';

/** 在线状态 -> Tag 颜色映射 */
const statusColorMap: Record<string, string> = {
  online: 'green',      // 绿色标签
  busy: 'orange',       // 橙色标签
  offline: 'default',   // 灰色标签
};

/** 在线状态 -> 中文文案映射 */
const statusLabelMap: Record<string, string> = {
  online: '在线',
  busy: '忙碌',
  offline: '离线',
};

export default function Profile() {
  // 从 Redux 中读取当前用户信息
  const user = useAppSelector((state) => state.auth.user);

  // 用户未登录时不渲染（理论上不会发生，因为有路由守卫）
  if (!user) return null;

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Card>
        {/* 头像 + 昵称 + 状态标签 */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar src={user.avatar} size={80} icon={<UserOutlined />} />
          <h3 style={{ marginTop: 12 }}>{user.nickname}</h3>
          {/* 根据状态显示不同颜色的标签 */}
          <Tag color={statusColorMap[user.status]}>{statusLabelMap[user.status]}</Tag>
        </div>
        {/* 详细信息描述列表 */}
        <Descriptions column={1} bordered>
          <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
          <Descriptions.Item label="昵称">{user.nickname}</Descriptions.Item>
          <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="状态">{statusLabelMap[user.status]}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}