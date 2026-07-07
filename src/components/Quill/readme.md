# QuillEditor 组件说明

## 组件概述

基于 Quill 2.x 的富文本编辑器组件，支持自定义表情（emoji + 网络图片）和本地图片上传。仅在 Test 页面使用，不影响聊天页 MessageInput。

## 文件结构

```
Quill/
  index.tsx            — 主组件：初始化 Quill、配置 toolbar、集成 EmojiPicker 和图片上传
  index.scss           — 编辑器容器样式 + ExpressionBlot 渲染样式
  ExpressionBlot.ts    — 自定义 Embed Blot：注册 'expression' 格式，渲染 emoji 文字或网络图片
  EmojiPicker.tsx      — 表情选择面板：Ant Popover + 分类 emoji grid
  EmojiPicker.scss     — 面板样式：grid 布局、hover 高亮
  emojiData.ts         — 表情数据常量：6 类 emoji + 2 个网络图片
  readme.md            — 本文件
```

## 核心知识点

### 1. Quill 自定义 Embed Blot（ExpressionBlot）

`expression` 不是 Quill 官方内置格式，是我们自定义的。遵循 Quill 官方自定义 Blot 规范：

**必须实现的静态属性/方法：**

| 属性/方法 | 说明 |
|-----------|------|
| `blotName` | 格式名，对应 `insertEmbed` 的 type 参数（如 `'expression'`） |
| `tagName` | 渲染的 HTML 标签（如 `'SPAN'`） |
| `static create(value)` | 根据 `insertEmbed` 传入的 value 创建 DOM 节点 |
| `static value(domNode)` | 从 DOM 反提取数据，用于 Delta 序列化 |

**注册方式：**

```ts
Quill.register(ExpressionBlot, true);  // true 允许覆盖，防止 HMR 重复报错
```

必须在创建 Quill 实例之前调用。

**insertEmbed API 签名：**

```
quill.insertEmbed(index, type, value, source)
```

- `type` 必须对应已注册 blot 的 `blotName`
- `value` 传给 blot 的 `create()` 方法

**value 类型说明：** 官方文档标注为 `Scalar`（字符串/数字/布尔值），但实际传对象也能用。我们的 `{ code, src }` 就是对象类型。官方推荐做法是把复杂数据编码为字符串（如 JSON），在 `create()` 中解析。

### 2. ExpressionValue 数据结构

```ts
interface ExpressionValue {
  code: string;   // emoji 字符，如 '😀'
  src?: string;   // 可选的网络图片 URL
}
```

| 场景 | 传入值 | 渲染效果 |
|------|--------|----------|
| 纯 emoji | `{ code: '😀' }` 或 `'😀'` | emoji 文字（.lx-emoji-text） |
| 网络图片 | `{ code: '🌻', src: 'https://...' }` | 只渲染 `<img>`，不显示 emoji 文字 |

### 3. Toolbar 自定义 handler

Quill toolbar handler 在非 React 环境执行，需要 **ref bridge** 模式触发 React state 更新：

```ts
const emojiToggleRef = useRef<() => void>(() => {});
emojiToggleRef.current = () => setEmojiPickerVisible(true);

// toolbar handler 中调用
toolbar.addHandler('expression', () => {
  emojiToggleRef.current();  // 间接触发 React setState
});
```

### 4. Toolbar icon 注册

自定义格式按钮默认显示空白，需通过 `Quill.import('ui/icons')` 注册 icon：

```ts
const icons = Quill.import('ui/icons');
icons['expression'] = '😀';  // Snow 主题 buildButtons 会读取此对象设置按钮内容
```

### 5. 图片上传

使用 Quill 内置 `image` 格式 + 自定义 handler：

- toolbar `image` 按钮 → 触发隐藏 `<input type="file">`
- `FileReader.readAsDataURL()` → 本地文件转 data URL
- `quill.insertEmbed(index, 'image', dataUrl)` → Quill 内置 Image Blot 渲染

### 6. EmojiPicker

- 使用 Ant Design `Popover` 组件包裹
- `EmojiItem` 联合类型：`string | ExpressionValue`
- 有 `src` 的项渲染 `<img>`，无 `src` 渲染 emoji 字符
- 选中后 `onSelect` 回调传递 `ExpressionValue`，关闭面板

## 官方文档参考

| 文档 | 链接 |
|------|------|
| 自定义 Blot | https://quilljs.com/docs/custom-blots/ |
| Formats 格式列表 | https://quilljs.com/docs/formats/ |
| insertEmbed API | https://quilljs.com/docs/api/#insertembed |
| Parchment 源码 | https://github.com/slab/parchment |
| Quill GitHub | https://github.com/slab/quill |

## 关键注意事项

1. **Blot 注册时机**：`Quill.register()` 必须在创建 Quill 实例之前
2. **HMR 覆盖注册**：用 `Quill.register(Blot, true)` 防止 Vite HMR 重复注册报错
3. **Embed 不可有子节点**：EmbedBlot 是 Parchment 的叶子节点，每个 embed 占 1 个索引位
4. **contentEditable="false"**：设置在 blot 外层 span 上，保证表情作为原子嵌入不可被编辑拆分
5. **光标后移**：`insertEmbed` 后需 `setSelection(index + 1, 0)` 让光标继续输入
