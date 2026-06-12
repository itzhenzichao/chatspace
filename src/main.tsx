/**
 * 应用入口文件
 *
 * 职责：
 * 1. 创建 React 根节点并渲染
 * 2. 使用 StrictMode 开发模式检查（检测不安全的生命周期、过时 API 等）
 * 3. 使用 Redux Provider 包裹根组件，将 Store 注入整个应用
 * 4. 引入全局样式
 *
 * 知识点：
 * - React 18 的 createRoot API（替代旧版 ReactDOM.render）
 * - Redux Provider 组件 + store 属性
 * - StrictMode 严格模式（仅开发环境生效）
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Redux Provider：将 store 注入组件树，所有子组件可通过 useSelector/useDispatch 访问 */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);