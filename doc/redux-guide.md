# ChatSpace Redux 使用指南

## 一、整体架构

项目使用 Redux Toolkit 管理全局状态，共 4 个 Slice，状态树结构如下：

```
RootState = {
  auth: {                    // 用户认证
    user: User | null,
  },
  chat: {                    // 聊天室 & 消息
    rooms: ChatRoom[],
  },
}
```

---

## 二、Store 配置

**文件**：`src/store/index.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import contactsReducer from './slices/contactsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: { auth, chat, contacts, ui },
});

// 从 store 自动推导类型，全局复用
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**要点**：
- `RootState` — 所有 Selector 的类型依据
- `AppDispatch` — 支持 `createAsyncThunk` 的 dispatch 类型

---

## 三、类型安全 Hook

**文件**：`src/store/hooks.ts`

```ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// 使用 withTypes API 预注入类型，组件中无需手动标注
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

**用法**：

```ts
// 读取状态 — 自动推导返回类型
const user = useAppSelector(state => state.auth.user);

// 派发动作 — 自动支持同步 action 和 async thunk
const dispatch = useAppDispatch();
dispatch(login(params));     // async thunk
dispatch(logout());          // sync action
```

---

## 四、各 Slice 详解

### 4.1 authSlice — 用户认证

**文件**：`src/store/slices/authSlice.ts`

**核心特点**：
- 使用 `createAsyncThunk` 处理异步登录
- localStorage 手动持久化登录态（不使用 redux-persist）
- 初始状态从 localStorage 恢复，刷新不丢登录

**异步 Thunk — login**：

```ts
export const login = createAsyncThunk(
  'auth/login',
  async (params: LoginParams, { rejectWithValue }) => {
    // 在 mockUsers 中匹配用户名 + 校验密码
    // 成功 → return { user, token }
    // 失败 → rejectWithValue('用户名或密码错误')
  }
);
```

**extraReducers 处理 thunk 生命周期**：

| 状态 | 处理 |
|---|---|
| `login.pending` | `loading = true`，清除 error |
| `login.fulfilled` | 存储 user/token 到 state 和 localStorage，`isAuthenticated = true` |
| `login.rejected` | `loading = false`，存储错误信息 |

**同步 Reducers**：

| Action | 效果 |
|---|---|
| `logout()` | 清空 user/token/error，移除 localStorage |
| `clearError()` | 清除 error 信息 |
| `updateProfile(Partial<User>)` | 合并部分用户数据，同步 localStorage |

---

### 4.2 chatSlice — 聊天室 & 消息

**文件**：`src/store/slices/chatSlice.ts`

**核心特点**：
- 纯同步 Reducers（无 async thunk）
- 消息按 roomId 分组存储（`Record<string, Message[]>`）
- 未读计数逻辑：进入房间清零，收到非活跃房间消息递增

**同步 Reducers**：

| Action | Payload | 效果 |
|---|---|---|
| `setActiveRoom` | `string` (roomId) | 设置活跃房间，清零该房间未读数 |
| `sendMessage` | `{ roomId, content, senderId, type? }` | 创建新消息追加到列表，type 默认 'text'，支持 'image' |
| `receiveMessage` | `Message` | 追加消息；非活跃房间未读数 +1 |
| `clearActiveRoom` | — | 清空活跃房间 ID |
| `addRoom` | `{ name, type: ChatRoomType }` | 创建新聊天室，初始化空消息列表 |

**未读计数核心逻辑**：

```
setActiveRoom → 该房间 unreadCount = 0（用户已进入，消息可见）
receiveMessage → 若 roomId !== activeRoomId → 该房间 unreadCount += 1
```

---

### 4.3 contactsSlice — 联系人

**文件**：`src/store/slices/contactsSlice.ts`

**核心特点**：
- 最简单的 Slice，仅存储联系人列表
- `searchKeyword` 目前未被组件使用（页面用本地 useState + useDebounce）

**同步 Reducers**：

| Action | Payload | 效果 |
|---|---|---|
| `setSearchKeyword` | `string` | 设置搜索关键词 |

---

### 4.4 uiSlice — UI 状态

**文件**：`src/store/slices/uiSlice.ts`

**核心特点**：
- 管理 亮/暗主题切换（驱动 Ant Design ConfigProvider）
- `sidebarCollapsed` 目前未用于渲染（预留移动端适配）

**同步 Reducers**：

| Action | Payload | 效果 |
|---|---|---|
| `toggleTheme()` | — | 亮 ↔ 暗 翻转 |
| `setTheme` | `'light' | 'dark'` | 设置指定主题 |
| `toggleSidebar()` | — | 侧边栏折叠翻转 |

---

## 五、组件中的 Redux 使用方式

| 组件/页面 | 读取 (Selector) | 派发 (Dispatch) |
|---|---|---|
| `App.tsx` | `state.ui.theme` | — |
| `Layout` | `state.auth.user`、`state.ui.theme` | `logout()`、`toggleTheme()` |
| `ProtectedRoute` | `state.auth.isAuthenticated` | — |
| `Login` | — | `login(params)`（async）、`clearError()` |
| `Chat` | `state.chat`（全量）、`state.auth.user` | `setActiveRoom`、`sendMessage`、`receiveMessage` |
| `Contacts` | `state.contacts.contacts` | — |
| `Profile` | `state.auth.user` | — |

---

## 六、自定义 Hook — useAuth

**文件**：`src/hooks/useAuth.ts`

将 auth 相关的状态和操作封装为单一 Hook：

```ts
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector(state => state.auth);
  return {
    user, isAuthenticated, loading, error,
    login: (params: LoginParams) => dispatch(login(params)),
    logout: () => dispatch(logout()),
  };
}
```

> 目前 Login 页面直接用 `useAppDispatch` + `login`，useAuth 可在后续组件中简化调用。

---

## 七、数据流图

```
用户操作 → dispatch(action)
                ↓
          Redux Store (Reducer 更新 state)
                ↓
          useAppSelector → 组件重新渲染
                ↓
          UI 更新（Ant Design 组件）

异步流程（仅 auth/login）：
用户点击登录 → dispatch(login(params))
                ↓
          login.pending → loading=true
                ↓
          异步函数执行（mock 数据匹配）
                ↓
      成功 → login.fulfilled → 存储 user/token → localStorage
      失败 → login.rejected → 存储 error → 页面提示
```

---

## 八、涉及的关键知识点

| 知识点 | 项目中的体现 |
|---|---|
| `configureStore` | 合并 4 个 Slice Reducer |
| `createSlice` | 每个 Slice 独立定义 state + reducers |
| `createAsyncThunk` | authSlice 的 login 异步登录 |
| `extraReducers` (builder 模式) | 处理 login thunk 的 pending/fulfilled/rejected |
| `PayloadAction<T>` | 为 action payload 提供类型约束 |
| `RootState` / `AppDispatch` 类型推导 | 从 store 自动生成，全局复用 |
| `useAppDispatch` / `useAppSelector` | 预类型化 Hook，组件中无需手动标注 |
| `Record<K, V>` 泛型工具类型 | chatSlice 消息按 roomId 分组 |
| `Partial<T>` 工具类型 | updateProfile 接受部分用户字段更新 |
| localStorage 手动持久化 | authSlice 登出/登录/更新均同步 localStorage |
