/**
 * Profile 页面 —— 个人信息页面
 *
 * 功能：
 * - 展示个人信息（头像、昵称、状态）
 * - 支持路由参数 /profile/:userId 查看其他用户信息
 * - 无 userId 参数时展示当前登录用户
 * - 当前用户自己的页面支持编辑模式
 *
 * 知识点：
 * - React Router useParams 读取 URL 参数
 * - useAppSelector 读取 Redux 状态
 * - mock 数据查找指定用户
 * - useAppDispatch 派发 updateProfile
 * - 条件渲染（自己的/别人的页面呈现不同）
 */

import { Card, Descriptions, Avatar, Tag, Button, Form, Input, Select, Space } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateProfile } from '../../store/slices/authSlice';
import { mockUsers } from '../../mocks/data/users';
import type { User } from '../../types/user';

/** 在线状态 -> Tag 颜色映射 */
const statusColorMap: Record<string, string> = {
  online: 'green',
  busy: 'orange',
  offline: 'default',
};

/** 在线状态 -> 中文文案映射 */
const statusLabelMap: Record<string, string> = {
  online: '在线',
  busy: '忙碌',
  offline: '离线',
};

/** 在线状态选项 */
const statusOptions = [
  { value: 'online', label: '在线' },
  { value: 'busy', label: '忙碌' },
  { value: 'offline', label: '离线' },
];

export default function Profile() {
  const dispatch = useAppDispatch();
  // 当前登录用户
  const loggedInUser = useAppSelector((state) => state.auth.user);
  // URL 参数中的 userId（/profile/:userId），可能为 undefined
  const { userId } = useParams<{ userId?: string }>();

  // 根据 userId 决定展示哪个用户：有参数 → 在 mockUsers 中查找，无 → 当前登录用户
  const user: User | null = userId
    ? mockUsers.find((u) => u.id === userId) ?? null
    : loggedInUser;

  // 是否当前登录用户自己（控制编辑功能是否显示）
  const isSelf = !userId || userId === loggedInUser?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // 用户不存在时显示空状态
  if (!user) return <div style={{ padding: 100, textAlign: 'center', color: '#999' }}>用户不存在</div>;

  const handleEdit = () => {
    form.setFieldsValue({ nickname: user.nickname, avatar: user.avatar, status: user.status });
    setIsEditing(true);
  };

  const handleSave = (values: Partial<User>) => {
    dispatch(updateProfile(values));
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Card
        // 仅在查看自己时显示编辑按钮
        extra={isSelf && !isEditing && (
          <Button type="link" icon={<EditOutlined />} onClick={handleEdit}>
            编辑
          </Button>
        )}
      >
        {/* 头像 + 昵称 + 状态标签 */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar src={user.avatar} size={80} icon={<UserOutlined />} />
          <h3 style={{ marginTop: 12 }}>{user.nickname}</h3>
          <Tag color={statusColorMap[user.status]}>{statusLabelMap[user.status]}</Tag>
        </div>

        {isSelf && isEditing ? (
          // 编辑模式 —— 仅自己的页面可编辑
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
              <Input placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item name="avatar" label="头像 URL" rules={[{ required: true, message: '请输入头像链接' }]}>
              <Input placeholder="请输入头像图片链接" />
            </Form.Item>
            <Form.Item name="status" label="在线状态" rules={[{ required: true, message: '请选择状态' }]}>
              <Select options={statusOptions} placeholder="请选择状态" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">保存</Button>
                <Button onClick={handleCancel}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          // 展示模式
          <Descriptions column={1} bordered>
            <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
            <Descriptions.Item label="昵称">{user.nickname}</Descriptions.Item>
            <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
            <Descriptions.Item label="状态">{statusLabelMap[user.status]}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </div>
  );
}
