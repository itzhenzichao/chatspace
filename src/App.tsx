/**
 * App 根组件
 *
 * 职责：
 * 1. 使用 Ant Design ConfigProvider 提供全局主题和中文国际化配置
 * 2. 根据 Redux 中的主题状态（light/dark）切换 Ant Design 的算法
 * 3. 使用 React Router 的 RouterProvider 渲染路由
 *
 * 知识点：
 * - Ant Design ConfigProvider + theme.darkAlgorithm/theme.defaultAlgorithm 主题切换
 * - antd/locale/zh_CN 中文国际化
 * - RouterProvider 接收路由配置对象
 * - useAppSelector 在根组件中读取全局状态
 */

import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useAppSelector } from './store/hooks';
import router from './router';

export default function App() {
  // 从 Redux 中读取当前主题
  const appTheme = useAppSelector((state) => state.ui.theme);

  return (
    <ConfigProvider
      locale={zhCN}    // Ant Design 中文语言包
      theme={{
        // 根据主题状态切换 Ant Design 的渲染算法
        algorithm: appTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {/* 渲染路由配置中定义的所有页面 */}
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}