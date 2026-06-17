# React 函数式（18） vs Vue 2 — 生命周期 & 组件通信对比

## 一、生命周期对比

### React 18 函数式（Hooks）

函数组件没有"生命周期方法"，用 **Hooks 替代**，核心思路从"在某个阶段执行"变成"同步副作用"。

| Hook | 对应阶段 | 触发时机 |
|---|---|---|
| `useState` / `useReducer` | 组件初始化 | 首次渲染时创建状态 |
| `useEffect(() => {}, [])` | 挂载（mounted） | 首次渲染后执行，`[]` 依赖为空 |
| `useEffect(() => {})` | 每次更新 | 每次渲染后都执行（无依赖数组） |
| `useEffect(() => {}, [dep])` | 依赖更新 | `dep` 变化时执行 |
| `useEffect(() => { return () => {} }, [])` | 卸载（unmounted） | 返回的清理函数在组件卸载时执行 |
| `useLayoutEffect` | DOM 更新后、浏览器绘制前 | 同步执行，阻塞渲染（少用） |
| `useInsertionEffect` | DOM 变更前 | CSS-in-JS 库专用 |

**关键区别**：React 没有 beforeMount / beforeUpdate，渲染和副作用的"前"阶段不存在。

### Vue 2 Options API

| 钩子 | 触发时机 |
|---|---|
| `beforeCreate` | 实例初始化之后、数据观测之前 |
| `created` | 实例创建完成，可访问 data/methods，但 DOM 未挂载 |
| `beforeMount` | 模板编译完成，挂载之前 |
| `mounted` | 实例挂载到 DOM |
| `beforeUpdate` | 数据变化、DOM 更新前 |
| `updated` | 数据变化、DOM 更新后 |
| `beforeDestroy` | 实例销毁前 |
| `destroyed` | 实例销毁完成 |
| `activated` / `deactivated` | keep-alive 组件专用，激活/停用时 |

### 对照表

| 阶段 | React 18 函数式 | Vue 2 |
|---|---|---|
| 初始化完成 | `useEffect(() => {}, [])` | `mounted` |
| **渲染前（无 DOM）** | **不存在** | `beforeMount` |
| 每次更新后 | `useEffect(() => {})` | `updated` |
| **每次更新前** | **不存在** | `beforeUpdate` |
| 依赖变化 | `useEffect(() => {}, [dep])` | `watch: { dep() {} }` |
| 卸载清理 | `useEffect(() => { return () => {} }, [])` | `beforeDestroy` |
| 计算属性 | `useMemo(() => value, [dep])` | `computed: { key() {} }` |

### React 函数式没有的

- **没有 beforeMount / beforeUpdate**：React 的渲染是"描述 UI 应该长什么样"，内部调度，不暴露"渲染前"给用户
- **没有 created**：函数组件执行体本身就是 created 的效果 — 每次都跑
- **没有 keep-alive 钩子**：需要用 `<KeepAlive>` 第三方库或自己实现

### Vue 2 没有的

- **没有 useLayoutEffect 等价物**：`updated` 在 DOM 更新后但**异步执行**，无法保证在浏览器绘制前运行
- **没有 useInsertionEffect**：Vue 的样式在 `<style scoped>` 层面处理，不需要 JS 侧注入

---

## 二、组件通信对比

### Props 向下传递（父子通信）

| | React 18 | Vue 2 |
|---|---|---|
| 父传子 | `<Child name={value} />` | `<child :name="value" />` |
| 子接收 | `function Child({ name }: Props)` | `props: { name: String }` |
| 单向性 | 严格单向，子不能改 props | 同样单向，改了会警告 |
| 类型约束 | TypeScript `interface` | `props: { name: { type: String } }` |

### 子向父通信

| | React 18 | Vue 2 |
|---|---|---|
| 方式 | 回调函数 prop | `$emit` 事件 |
| 写法 | `<Child onChange={fn} />` 子调 `props.onChange(val)` | `<child @change="fn" />` 子调 `this.$emit('change', val)` |
| 类型 | TypeScript 定义函数签名 | 不需要，运行时事件 |

### 兄弟组件 / 跨层级通信

| 场景 | React 18 | Vue 2 |
|---|---|---|
| 全局状态 | Redux / Zustand / Context | Vuex |
| 局部共享 | Context + Provider | provide / inject |
| 事件总线 | 不推荐（违背单向数据流） | `new Vue()` 作为 EventBus（Vue 3 废弃） |
| ref 直接访问 | `useImperativeHandle` + `forwardRef` | `this.$refs.xxx` |

### Subscribe 通知模式

| 场景 | React 18 | Vue 2 |
|---|---|---|
| 数据变→自动更新 | Context 值变化，所有 Consumer 重渲染 | 响应式系统自动追踪，精准更新 |
| 通知粒度 | 全量 Consumer 重渲染（需手动优化） | 自动精准到具体绑定的 DOM |
| 优化手段 | `memo`、`useMemo`、`useCallback`、拆分 Context | 不需要，框架自动  |

### 核心差异对比表

| 对比维度 | React 18 函数式 | Vue 2 |
|---|---|---|
| 通信哲学 | 单向数据流 + 回调 | 单向数据流 + 事件发射 |
| 跨层级方案 | Context（粗粒度）+ 状态库 | provide/inject + Vuex |
| 通知机制 | 状态提升 + props 下钻 | 响应式自动通知 + 精准更新 |
| 兄弟通信 | 状态提升到公共父组件 | EventBus（不推荐）/ Vuex |
| 类型安全 | TypeScript 一等公民 | 需额外配置，体验不如 React |
| ref 暴露 | forwardRef + useImperativeHandle | 直接 `this.$refs` |
| slot / children | `children` prop 或 render props | `<slot />` 具名插槽 / 作用域插槽 |

### slot vs children

```tsx
// React：children prop
function Card({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
// 使用
<Card><span>内容</span></Card>
```

```vue
<!-- Vue 2：slot -->
<template>
  <div><slot /></div>
</template>
<!-- 使用 -->
<card><span>内容</span></card>

<!-- 具名插槽（Vue 特有，React 需手动实现） -->
<template>
  <div><slot name="header" /><slot /></div>
</template>
<card>
  <template #header><h1>标题</h1></template>
  内容
</card>
```

---

## 三、关键心智模型区别

| | React 18 函数式 | Vue 2 |
|---|---|---|
| 渲染模型 | `state → UI = fn(state)`，每次状态变化**全量重跑函数** | 响应式依赖追踪，**只更新变化部分** |
| 组件的本质 | 一个函数，每次渲染重新执行 | 一个有状态的对象实例，创建一次长期存在 |
| 状态更新 | `setState` 触发重新执行函数 | 直接赋值，响应式系统自动追踪 |
| 优化 | 需要开发者手动（memo、useMemo） | 框架自动处理 |
| 数据流 | 显式传递，容易追踪 | 显式 + 隐式（响应式自动传播） |
| 学习曲线 | 闭包陷阱、依赖数组、stale closure | 响应式陷阱、`$set`、原型链问题 |
