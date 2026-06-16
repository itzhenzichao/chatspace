/**
 * Layout 组件 —— 全局布局框架
 *
 * 结构：
 * - 左侧 80px 侧边栏（Ant Design Sider）：
 *   - 顶部：用户头像
 *   - 中部：导航菜单（聊天/联系人/我的）
 *   - 底部：主题切换 + 退出登录按钮
 * - 右侧：内容区域（React Router Outlet 渲染子路由页面）
 *
 * 知识点：Ant Design Layout + Sider + Menu、React Router Outlet/useNavigate/useLocation、
 *         Redux useAppSelector/useAppDispatch、dispatch action 交互
 */

import { Layout as AntLayout, Menu } from 'antd';
import {
  MessageOutlined,
  ContactsOutlined,
  UserOutlined,
  BulbOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/uiSlice';
import UserAvatar from '../UserAvatar';

const { Sider, Content } = AntLayout;

/** 侧边栏导航菜单项配置 */
const menuItems = [
  { key: '/chat', icon: <MessageOutlined />, label: '聊天' },
  { key: '/contacts', icon: <ContactsOutlined />, label: '联系人' },
  { key: '/profile', icon: <UserOutlined />, label: '我的' },
];

export default function Layout() {
  const navigate = useNavigate();       // 路由导航函数
  const location = useLocation();       // 当前路由路径（用于菜单高亮）
  const dispatch = useAppDispatch();    // Redux dispatch
  const user = useAppSelector((state) => state.auth.user);       // 当前用户信息
  const theme = useAppSelector((state) => state.ui.theme);       // 当前主题
  return (
    <AntLayout style={{ height: '100vh' }}>
      {/* 左侧侧边栏 */}
      <Sider width={80} style={{ backgroundColor: '#001529', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* 用户头像区域 */}
        <div style={{ padding: '16px 0' }}>
          <UserAvatar src={user?.avatar} size={40} status={user?.status} />
        </div>
        {/* 导航菜单：使用 inlineCollapsed 垂直折叠模式 */}
        <Menu
          mode="inline"
          theme="dark"                        // Sider始终深色背景，菜单始终使用深色主题确保图标可见
          selectedKeys={[location.pathname]}   // 根据当前路径设置高亮项
          items={menuItems}
          onClick={({ key }) => navigate(key)}  // 点击菜单项跳转路由
          style={{ width: 80, backgroundColor: 'transparent', border: 'none' }}
          inlineCollapsed
        />
        {/* 弹性空间，将底部按钮推到底部 */}
        <div style={{ flex: 1 }} />
        {/* 底部功能按钮区 */}
        <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          {/* 主题切换按钮 */}
          <BulbOutlined
            style={{ fontSize: 18, color: '#fff', cursor: 'pointer' }}
            onClick={() => dispatch(toggleTheme())}
          />
          {/* 退出登录按钮 */}
          <LogoutOutlined
            style={{ fontSize: 18, color: '#fff', cursor: 'pointer' }}
            onClick={() => {
              dispatch(logout());           // 清除 Redux 认证状态和 localStorage
              navigate('/login');           // 跳转到登录页
            }}
          />
        </div>
      </Sider>
      {/* 右侧内容区域 —— Outlet 渲染子路由对应的页面 */}
      <Content style={{ backgroundColor: theme === 'dark' ? '#141414' : '#f5f5f5' }}>
        <Outlet />
      </Content>
    </AntLayout>
  );
}