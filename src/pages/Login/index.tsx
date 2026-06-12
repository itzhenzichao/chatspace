/**
 * Login 页面 —— 登录注册页面
 *
 * 功能：
 * - 支持登录/注册标签页切换（Ant Design Tabs）
 * - 登录表单：用户名 + 密码，提交后调用 Redux login 异步 thunk
 * - 注册表单：用户名 + 昵称 + 密码（Mock 注册，提示用 123456 登录）
 * - 登录成功后自动跳转到聊天页
 * - 使用 Ant Design Form 自带校验规则
 *
 * 知识点：
 * - useState 控制标签页状态
 * - Ant Design Form + Form.Item + rules 表单校验
 * - Ant Design Tabs + items 配置式渲染
 * - createAsyncThunk 的 fulfilled/rejected 判断（login.fulfilled.match）
 * - useNavigate 路由跳转
 * - TypeScript 接口定义表单数据类型（LoginParams, RegisterFormValues）
 */

import { Form, Input, Button, Card, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { login, clearError } from '../../store/slices/authSlice';
import type { LoginParams } from '../../types/user';

/** 注册表单的数据类型 */
interface RegisterFormValues {
  username: string;
  password: string;
  nickname: string;
}

export default function Login() {
  const navigate = useNavigate();         // 路由导航
  const dispatch = useAppDispatch();      // Redux dispatch
  const [activeTab, setActiveTab] = useState('login');  // 当前标签页
  const [loading, setLoading] = useState(false);        // 登录加载状态

  /**
   * 处理登录表单提交
   * 调用 Redux login 异步 thunk，根据结果跳转或提示错误
   */
  const handleLogin = async (values: LoginParams) => {
    setLoading(true);
    const result = await dispatch(login(values));
    setLoading(false);
    // 使用 login.fulfilled.match 判断异步 thunk 是否成功
    console.log(login.fulfilled)
    if (login.fulfilled.match(result)) {
      message.success('登录成功');
      navigate('/chat');    // 登录成功跳转到聊天页
    } else {
      message.error(result.payload as string || '登录失败');
    }
  };

  /**
   * 处理注册表单提交（Mock 实现）
   * 提示用户注册成功，并切换到登录标签页
   */
  const handleRegister = (values: RegisterFormValues) => {
    message.success(`注册成功！用户名: ${values.username}，密码请使用 123456 登录`);
    setActiveTab('login');        // 切换到登录标签页
    dispatch(clearError());       // 清除可能存在的旧错误
  };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>ChatSpace</h2>
        {/* 登录/注册标签页 */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={[
            {
              key: 'login',
              label: '登录',
              children: (
                <Form onFinish={handleLogin} autoComplete="off">
                  {/* 用户名输入框 —— 必填校验 */}
                  <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input prefix={<UserOutlined />} placeholder="用户名" />
                  </Form.Item>
                  {/* 密码输入框 —— 必填校验 */}
                  <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="密码（统一为 123456）" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                      登录
                    </Button>
                  </Form.Item>
                  {/* 测试账号提示 */}
                  <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
                    测试账号: zhangsan / lisi / wangwu / zhaoliu / sunqi，密码均为 123456
                  </div>
                </Form>
              ),
            },
            {
              key: 'register',
              label: '注册',
              children: (
                <Form onFinish={handleRegister} autoComplete="off">
                  <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input prefix={<UserOutlined />} placeholder="用户名" />
                  </Form.Item>
                  <Form.Item name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
                    <Input prefix={<SmileOutlined />} placeholder="昵称" />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}