# ChatSpace — React + TypeScript 学习路线与项目方案

## 项目概述

一个类似 Slack/微信 的即时聊天室应用，涵盖 React 18 + TypeScript 全链路知识点。
无后端接口，使用 MSW (Mock Service Worker) 模拟 API 数据。

## 技术栈

| 类别       | 选择                           |
| ---------- | ------------------------------ |
| 构建工具   | Vite                           |
| React      | React 18                       |
| 语言       | TypeScript                     |
| UI 组件库  | Ant Design 5                   |
| 路由       | React Router v6                |
| 状态管理   | Redux Toolkit + react-redux    |
| Mock 数据  | MSW (Mock Service Worker)      |
| 图标       | @ant-design/icons              |
| 测试       | Vitest + React Testing Library |
| Lint       | ESLint + Prettier              |

## 编码规范

**所有代码文件必须包含注释**，注释要求如下：

1. **文件顶部文档注释** — 每个 `.ts` / `.tsx` / `.css` 文件开头必须有一段文档注释，说明：
   - 这个文件做什么（一句话概括）
   - 核心功能列表
   - 涉及的关键知识点（TS / React / Ant Design 等）

2. **接口/类型注释** — 每个 interface 和 type 别名的每个字段必须有行内注释，说明字段含义

3. **函数注释** — 每个导出函数必须有 JSDoc 注释，包含：
   - 函数用途描述
   - `@param` 参数说明
   - `@returns` 返回值说明

4. **组件注释** — 每个 React 组件必须有注释，包含：
   - 组件功能描述
   - Props 类型中每个属性的说明
   - 关键渲染逻辑的解释
   - 涉及的知识点标注

5. **逻辑注释** — 关键业务逻辑（如 Redux action 处理、useEffect 定时器清理、条件判断等）必须有行内注释说明意图

6. **常量注释** — 每个导出常量必须有注释说明用途

---

## 当前进度

### 阶段 1：项目搭建 + 登录注册 — ✅ 已完成

已交付功能：
- Vite + React 18 + TS 项目初始化
- Ant Design 引入与 ConfigProvider 主题配置
- 登录/注册页（Ant Design Form + TS 类型约束）
- Redux authSlice（login/logout/clearError/updateProfile + createAsyncThunk）
- localStorage 持久化登录态
- 基础布局框架（Ant Design Layout + Sider + Menu）
- 路由守卫（ProtectedRoute）

### 阶段 2：聊天核心功能 — ✅ 已完成

已交付功能：
- 聊天主界面布局（左侧聊天室列表 + 右侧消息区）
- 聊天室列表侧边栏（RoomCard + Badge 未读计数）
- 消息列表（ChatBubble 气泡样式，区分自己/他人/系统消息）
- 消息输入框 + 发送（MessageInput）
- 模拟 WebSocket 定时推送新消息（每 8 秒随机推送）
- 消息自动滚动到底部（useRef + scrollIntoView）
- 搜索聊天室（防抖搜索 useDebounce）

### 阶段 3：路由 + Context + 自定义 Hook — ✅ 已完成

已交付功能：
- React Router v6 配置（Login / Chat / Contacts / Profile）
- 路由守卫（ProtectedRoute — 未登录跳转登录页）
- 主题切换（Redux uiSlice + Ant Design ConfigProvider）
- 自定义 Hook：useAuth、useLocalStorage、useDebounce
- 联系人页面（好友列表 + 搜索防抖过滤）
- 个人信息页面（Card + Descriptions 展示）

### 阶段 4：Redux 全局状态 + Mock 异步 — ✅ 已完成

已完成：
- Redux Toolkit 4 个 Slice（auth / chat / contacts / ui）全部就绪
- useAppDispatch / useAppSelector 类型安全 Hook
- Mock 数据层（users / rooms / messages / contacts）
- 个人信息编辑功能（Form 编辑 + Redux updateProfile 部分更新）
- 创建聊天室 Modal（chatSlice addRoom + Chat 页面 Modal/Form）
- 消息图片类型支持（MessageInput Upload + 图片预览 + sendMessage type 字段）
- Mock 数据增加图片消息（picsum.photos URL）

（MSW 拦截层和 services API 层不做，继续使用直接 import mock 数据的方式）

### 阶段 5：性能优化 + 测试 + 工程化 — ✅ 已完成

已完成：
- React.memo 优化 ChatBubble、RoomCard、MessageInput
- useMemo 缓存 filteredRooms、activeRoom、activeMessages
- useCallback 稳定 handleSend、getSenderName 回调引用
- 代码分割（React.lazy + Suspense 按路由懒加载）
- Vitest 单元测试（authSlice 6 个、chatSlice 8 个、useDebounce 3 个，共 17 个测试）
- Prettier 代码格式化（.prettierrc + format script + eslint-config-prettier）
- Vite 打包配置优化（manualChunks 分包：vendor-react / vendor-antd / vendor-redux）

待完成：
- 虚拟滚动方案（长消息列表优化）
- React Testing Library 组件测试

---

## 一、学习路线

### 阶段一：TypeScript 基础（1-2 周）

1. 基础类型（string, number, boolean, array, tuple, enum）
2. 接口（interface）与类型别名（type）
3. 函数类型、可选参数、默认参数
4. 泛型（泛型函数、泛型接口、泛型类）
5. 联合类型（Union）、交叉类型（Intersection）
6. 类型守卫（typeof, instanceof, in, 自定义守卫）
7. 工具类型（Partial, Required, Pick, Omit, Record, Readonly）
8. 模块系统（import/export）、命名空间
9. 类型声明文件（.d.ts）

### 阶段二：React 18 基础（2-3 周）

1. JSX 语法与组件思维
2. 函数组件与 Props 传递
3. useState 状态管理
4. 事件处理（onClick, onChange 等）
5. 条件渲染（三元表达式、&& 渲染）
6. 列表渲染 & Key 的作用
7. useEffect 副作用与生命周期映射
8. useEffect 依赖数组与清理函数
9. useRef DOM 操作与持久引用
10. 组件通信（父→子 Props、子→父回调、兄弟组件）

### 阶段三：React + TypeScript 融合（2 周）

1. FC 类型与 Props TS 定义
2. useState 泛型用法（useState\<string\>）
3. useRef 泛型用法（useRef\<HTMLInputElement\>）
4. 事件对象的 TS 类型（ChangeEvent, MouseEvent）
5. Context + TypeScript（泛型 Context）
6. forwardRef + TypeScript（泛型转发）
7. 自定义 Hook + TS（返回类型推导）
8. children 类型处理（ReactNode vs ReactElement）

### 阶段四：进阶实战（2-3 周）

1. React Router v6 + TS（路由配置、useNavigate、useParams）
2. Redux Toolkit + TS（Slice、createAsyncThunk、RootState）
3. Ant Design 5 组件 + TS（Form、Table、Modal 类型）
4. Mock 数据层设计（MSW handlers）
5. 表单处理（Ant Design Form + TS 类型校验）
6. 性能优化（React.memo、useMemo、useCallback）
7. 错误边界（ErrorBoundary）与 Suspense

### 阶段五：工程化（1 周）

1. Vite + TS 项目配置与构建优化
2. ESLint + Prettier 规则配置
3. 代码分割（React.lazy + Suspense）
4. 单元测试（Vitest + React Testing Library）
5. Redux Slice 测试
6. 打包与部署

---

## 二、核心功能清单

### 用户模块

- 登录 / 注册页面（Mock 认证）
- 用户头像与昵称修改
- 在线状态显示（online / offline / busy）

### 聊天室模块

- 聊天室列表（加入 / 创建 / 退出）
- 消息发送与实时展示（模拟 WebSocket 定时推送）
- 消息类型：文字、图片、系统通知
- 消息时间戳分组显示（今天 / 昨天 / 更早）
- 消息搜索（防抖搜索）

### 联系人模块

- 好友列表
- 私聊功能

### 通用功能

- 暗色 / 亮色主题切换（Ant Design ConfigProvider）
- 未读消息计数（Redux 管理 + Ant Design Badge）
- 消息通知提醒
- localStorage 持久化（登录状态、聊天记录）
- 响应式布局（桌面端 + 移动端适配）

---

## 三、项目目录结构

```
chatspace/
├── public/
│   └── mock/                   # 静态 mock 数据 JSON
├── src/
│   ├── assets/                 # 图片、字体等静态资源
│   ├── components/             # 通用组件
│   │   ├── ChatBubble/         # 消息气泡
│   │   ├── UserAvatar/         # 用户头像（含在线状态点）
│   │   ├── SearchBar/          # 搜索框
│   │   ├── Layout/             # 全局布局（Sider + Content）
│   │   ├── ProtectedRoute/     # 路由守卫
│   │   ├── EmptyState/         # 空状态占位
│   │   ├── MessageInput/       # 消息输入框
│   │   ├── RoomCard/           # 聊天室卡片
│   │   ├── TimeDivider/        # 时间分隔线
│   │   └── NotificationToast/  # 通知提示（待开发）
│   ├── pages/
│   │   ├── Login/              # 登录注册页
│   │   ├── Chat/               # 聊天主页面
│   │   ├── Contacts/           # 联系人页
│   │   └── Profile/            # 个人信息页
│   ├── store/                  # Redux Toolkit
│   │   ├── index.ts            # configureStore
│   │   ├── slices/
│   │   │   ├── authSlice.ts    # 用户认证
│   │   │   ├── chatSlice.ts    # 聊天室 & 消息
│   │   │   ├── contactsSlice.ts # 联系人
│   │   │   └── uiSlice.ts      # 主题、侧边栏状态
│   │   └── hooks.ts            # useAppDispatch, useAppSelector
│   ├── hooks/                  # 自定义 Hook
│   │   ├── useAuth.ts          # 认证逻辑封装
│   │   ├── useLocalStorage.ts  # localStorage 持久化
│   │   ├── useDebounce.ts      # 防抖
│   │   └── useMockWebSocket.ts # 模拟 WebSocket 推送（待开发）
│   ├── types/                  # TS 类型定义
│   │   ├── user.ts             # User, LoginParams, RegisterParams
│   │   ├── message.ts          # Message, MessageType
│   │   ├── chatroom.ts         # ChatRoom, ChatRoomType, ChatRoomMember
│   │   ├── common.ts           # ApiResponse, PaginationParams
│   │   └── store.ts            # RootState, AppDispatch
│   ├── services/               # API 调用层（待开发）
│   │   ├── auth.ts             # 登录注册接口
│   │   ├── chat.ts             # 聊天室 & 消息接口
│   │   └── contacts.ts         # 联系人接口
│   ├── mocks/                  # MSW Mock（handlers 待开发）
│   │   ├── handlers.ts         # 请求处理器汇总（待开发）
│   │   ├── browser.ts          # MSW 浏览器初始化（待开发）
│   │   └── data/               # Mock 数据
│   │   │   ├── users.ts        # 用户数据
│   │   │   ├── rooms.ts        # 聊天室数据
│   │   │   ├── messages.ts     # 消息数据
│   │   │   └── contacts.ts     # 联系人数据
│   ├── context/                # Context（待开发，当前用 Redux uiSlice 替代）
│   ├── utils/                  # 工具函数
│   │   ├── storage.ts          # localStorage 封装
│   │   ├── format.ts           # 时间/文本格式化
│   │   └── constants.ts        # 常量定义
│   ├── router/                 # 路由配置
│   │   └── index.tsx
│   ├── App.tsx                 # 根组件
│   └── main.tsx                # 入口
├── __tests__/                  # 测试文件（待开发）
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 四、各阶段详细拆解

### 阶段 1：项目搭建 + 登录注册（1-2 周） — ✅ 已完成

> 知识点：TS 基础类型、接口、Ant Design 入门、函数组件、Props

**知识点映射**

| 功能          | TS 知识点                    | React 知识点          | Ant Design 组件       |
| ------------- | ----------------------------- | --------------------- | --------------------- |
| 登录表单      | LoginParams 接口定义          | useState、事件处理    | Form, Input, Button   |
| 注册表单      | RegisterParams、可选属性      | 条件渲染              | Form.Item, Select     |
| 用户数据      | User 接口、联合类型(status)   | 列表渲染              | Avatar, Tag           |
| 登录态存储    | 泛型 localStorage 封装        | useEffect 初始化      | Message 提示          |
| 主题配置      | ThemeConfig 类型              | Provider 模式         | ConfigProvider        |

---

### 阶段 2：聊天核心功能（2 周） — ✅ 已完成

> 知识点：useState/useEffect、列表渲染、事件类型、useRef、联合类型

**知识点映射**

| 功能            | TS 知识点                      | React 知识点              | Ant Design 组件        |
| --------------- | ------------------------------- | ------------------------- | ---------------------- |
| 消息类型        | MessageType 联合类型            | 条件渲染不同气泡          | -                      |
| 消息列表        | Message 接口、泛型数组          | 列表渲染 & Key            | List, List.Item        |
| 消息发送        | ChangeEvent\<HTMLTextAreaElement\> | useState 更新列表     | Input.TextArea         |
| 自动推送        | 类型安全的定时器引用            | useEffect + setInterval   | -                      |
| 自动滚动        | useRef\<HTMLDivElement\>        | useRef DOM 操作           | -                      |
| 未读计数        | number 类型                     | 状态计算                  | Badge                  |
| 时间分组        | Date 格式化函数返回类型         | 条件渲染分隔线            | Divider                |

---

### 阶段 3：路由 + Context + 自定义 Hook（1-2 周） — ✅ 已完成

> 知识点：React Router、Context 泛型、自定义 Hook 类型推导、路由守卫

**知识点映射**

| 功能          | TS 知识点                    | React 知识点              | Ant Design 组件       |
| ------------- | ----------------------------- | ------------------------- | --------------------- |
| 路由配置      | 路由类型 RouteObject          | Routes, Route, Outlet     | -                      |
| 路由守卫      | Props 类型 children: ReactNode | 条件渲染 + navigate     | -                      |
| 主题切换      | uiSlice state 类型            | Redux dispatch            | ConfigProvider        |
| useAuth       | Hook 返回类型推导              | 自定义 Hook 封装          | -                      |
| useLocalStorage | 泛型 \<T\> 参数              | useState + localStorage   | -                      |
| useDebounce   | 泛型 \<T\> 延迟值             | useEffect + setTimeout    | -                      |
| 搜索防抖      | string 类型参数                | useDebounce 实际应用      | Input.Search          |
| 联系人列表    | User[] 类型                    | 列表渲染 + 事件回调       | List, Avatar          |

---

### 阶段 4：Redux 全局状态 + Mock 异步（2 周） — 🔄 部分完成

> 知识点：Redux Toolkit + TS、createAsyncThunk、MSW、RootState/AppDispatch

已完成部分的知识点映射：

| 功能          | TS 知识点                          | Redux 知识点                | 状态   |
| ------------- | ----------------------------------- | --------------------------- | ------ |
| authSlice     | LoginParams / User / AsyncThunk 泛型 | createSlice, createAsyncThunk | ✅    |
| chatSlice     | ChatRoom / Message / PayloadAction  | createSlice, extraReducers  | ✅    |
| contactsSlice | User[] / PaginationParams           | createSlice                 | ✅    |
| uiSlice       | boolean / string 状态               | createSlice                 | ✅    |
| Store 配置    | RootState / AppDispatch 类型推导    | configureStore              | ✅    |

待完成部分的知识点映射：

| 功能          | TS 知识点                          | Redux / MSW 知识点          | 状态   |
| ------------- | ----------------------------------- | --------------------------- | ------ |
| MSW handlers  | Response 类型                       | http.get / http.post        | ❌    |
| services 层   | API 函数返回类型                    | async/await + fetch          | ❌    |
| 图片上传      | UploadFile 类型                     | -                           | ❌    |
| 创建聊天室    | ChatRoom 创建参数类型               | dispatch action              | ❌    |
| 编辑个人信息  | Partial\<User\> 类型                | dispatch updateProfile       | ❌    |

---

### 阶段 5：性能优化 + 测试 + 工程化（1 周） — ❌ 未开始

> 知识点：memo/useMemo/useCallback、Vitest、代码分割、ESLint

**知识点映射**

| 功能          | TS 知识点                | React / 工程化知识点           |
| ------------- | ------------------------ | ------------------------------ |
| memo 优化     | Props 类型比较            | React.memo、浅比较策略         |
| useMemo       | 依赖项类型               | useMemo 缓存计算结果           |
| useCallback   | 回调函数类型             | useCallback 稳定引用           |
| 单元测试      | 测试类型断言             | Vitest、describe/it/expect     |
| 组件测试      | render 泛型              | RTL render、fireEvent、waitFor |
| 代码分割      | lazy 组件类型            | React.lazy + Suspense          |
| ESLint        | 规则配置类型             | .eslintrc.cjs 规则详解         |
| 打包优化      | Vite 配置类型            | build.rollupOptions            |

---

## 五、学习节奏总览

| 阶段 | 时长    | 里程碑                                    | 状态   |
| ---- | ------- | ----------------------------------------- | ------ |
| 1    | 1-2 周  | 能登录注册，看到页面框架                   | ✅     |
| 2    | 2 周    | 能收发消息，有聊天基本体验                 | ✅     |
| 3    | 1-2 周  | 多页面切换，主题切换，搜索可用             | ✅     |
| 4    | 2 周    | Redux 管理全局状态，功能完善               | ✅     |
| 5    | 1 周    | 性能优化，测试覆盖，打包优化               | ✅     |

每个阶段结束都 **可运行、可交互**，随时能看到阶段性成果。

---

## 六、推荐学习资源

### TypeScript

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Type Challenges](https://github.com/type-challenges/type-challenges) — 类型体操练习

### React 18

- [React 官方文档（新版）](https://react.dev/)
- [React 18 新特性](https://react.dev/blog/2022/03/29/react-v18)

### Redux Toolkit

- [Redux Toolkit 官方文档](https://redux-toolkit.js.org/)
- [Redux Toolkit + TypeScript](https://redux-toolkit.js.org/usage/usage-with-typescript)

### Ant Design

- [Ant Design 5 官方文档](https://ant.design/)
- [Ant Design + TypeScript](https://ant.design/docs/react/use-in-typescript-cn)

### 其他

- [React Router v6 文档](https://reactrouter.com/)
- [MSW 官方文档](https://mswjs.io/)
- [Vitest 官方文档](https://vitest.dev/)