/**
 * QuillEditor —— 基于 Quill 2.x 的富文本编辑器组件
 *
 * 功能：
 * - 初始化 Quill 编辑器实例（自定义 toolbar 配置）
 * - 自定义表情格式（ExpressionBlot），支持 insertEmbed 插入 emoji
 * - 表情选择面板（EmojiPicker），通过 Popover 弹出选择 emoji
 * - 图片上传（本地文件选择 → FileReader → insertEmbed image）
 * - Toolbar 自定义按钮（expression 打开表情面板、image 打开文件选择）
 * - 发送按钮读取编辑器 Delta 内容
 *
 * 知识点：
 * - Quill 2.x 自定义 Embed Blot 注册与渲染
 * - Quill toolbar 自定义 handler（通过 ref bridge 连接 React state）
 * - useRef / useEffect / useState 管理 Quill 实例和交互状态
 * - FileReader 将本地文件转为 data URL
 * - Ant Design Popover 组件集成
 */

import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import EmojiPicker from './EmojiPicker';
import './ExpressionBlot';  // 侧效果导入：注册 ExpressionBlot 到 Quill registry
import type { ExpressionValue } from './ExpressionBlot';
import './index.scss';

// 注册 expression 格式的 toolbar icon —— Snow 主题的 buildButtons 会读取 icons 对象设置按钮内容
// 如果不注册，自定义格式按钮会显示为空白
const icons = Quill.import('ui/icons') as Record<string, string>;
icons['expression'] = '😀';

/** QuillEditor toolbar 配置 —— 自定义按钮组 */
const TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline', 'strike'],  // 文本格式化
  ['image', 'expression'],                     // 图片 + 表情
  ['clean'],                                   // 清除格式
];

/**
 * QuillEditor 组件 —— Quill 富文本编辑器
 *
 * Props: 无（自包含组件，仅在 Test 页面使用）
 * State:
 * - emojiPickerVisible: 控制表情面板是否显示
 *
 * Refs:
 * - quillRef: Quill 编辑器挂载的 div DOM
 * - quill: Quill 实例引用
 * - emojiToggleRef: ref bridge，让 Quill toolbar handler 能触发 React state 更新
 * - fileInputRef: 隐藏的 file input，用于图片选择
 */
const QuillEditor = () => {
  // Quill 编辑器挂载的 DOM 容器
  const quillRef = useRef<HTMLDivElement>(null);
  // Quill 实例引用，在 useEffect 中创建
  const quill = useRef<Quill | null>(null);
  // 表情面板是否可见
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  // ref bridge —— 让非 React 环境的 toolbar handler 能触发 React state 更新
  const emojiToggleRef = useRef<() => void>(() => {});
  // 隐藏的 file input ref，用于触发图片文件选择
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 更新 emojiToggleRef，使其始终指向最新的 setEmojiPickerVisible
  emojiToggleRef.current = () => setEmojiPickerVisible(true);

  /**
   * useEffect —— 初始化 Quill 编辑器实例
   * 配置自定义 toolbar、注册 handler、设置按钮 icon
   */
  useEffect(() => {
    if (!quillRef.current) return;

    // 创建 Quill 实例，使用自定义 toolbar 配置
    quill.current = new Quill(quillRef.current, {
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
      placeholder: '输入消息...',
      theme: 'snow',
    });

    // 获取 toolbar 模块，注册自定义 handler
    const toolbar = quill.current.getModule('toolbar');

    // 表情按钮 handler —— 打开表情面板（通过 ref bridge 触发 React state）
    toolbar.addHandler('expression', () => {
      emojiToggleRef.current();
    });

    // 图片按钮 handler —— 触发隐藏的 file input 选择文件
    toolbar.addHandler('image', () => {
      fileInputRef.current?.click();
    });

  }, []);

  /**
   * handleEmojiSelect —— 选中表情后插入到编辑器
   * @param value - ExpressionValue 对象（包含 emoji code 和可选的网络图片 src）
   */
  const handleEmojiSelect = (value: ExpressionValue) => {
    if (!quill.current) return;
    // 获取当前光标位置，如果没有选区则定位到末尾
    const selection = quill.current.getSelection(true);
    const index = selection ? selection.index : quill.current.getLength();
    // 插入表情 Blot（ExpressionBlot 渲染 emoji 文字 + 可选网络图片）
    quill.current.insertEmbed(index, 'expression', value);
    // 光标后移一位，允许继续输入
    quill.current.setSelection(index + 1, 0);
    // 关闭表情面板
    setEmojiPickerVisible(false);
  };

  /**
   * handleEmojiClose —— 关闭表情面板
   */
  const handleEmojiClose = () => {
    setEmojiPickerVisible(false);
  };

  /**
   * handleImageSelect —— 图片文件选择后插入到编辑器
   * 使用 FileReader 读取本地文件为 data URL，再通过 insertEmbed 插入
   * @param e - file input 的 change 事件
   */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !quill.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      // 获取光标位置
      const selection = quill.current!.getSelection(true);
      const index = selection ? selection.index : quill.current!.getLength();
      // 插入图片（Quill 内置 image 格式）
      quill.current!.insertEmbed(index, 'image', dataUrl);
      // 光标后移
      quill.current!.setSelection(index + 1, 0);
    };
    reader.readAsDataURL(file);
    // 重置 input value，允许重复选择同一文件
    e.target.value = '';
  };

  /**
   * handleSend —— 发送按钮处理
   * 读取编辑器 Delta 内容并输出到 console
   */
  const handleSend = () => {
    if (!quill.current) return;
    const delta = quill.current.getContents();
    console.log('Quill Delta:', delta);
    // 也可以获取纯文本：quill.current.getText()
    const text = quill.current.getText();
    console.log('纯文本:', text);
    console.log('getLength', quill.current.getLength());
  };

  return (
    <>
      {/* Quill 编辑器容器 */}
      <div ref={quillRef} className="lx-quill" />

      {/* 表情选择面板 —— 包裹 toolbar 的 expression 按钮 */}
      <EmojiPicker
        visible={emojiPickerVisible}
        onSelect={handleEmojiSelect}
        onClose={handleEmojiClose}
      >
        {/* 表情按钮触发元素 —— Popover 会将此元素作为 click trigger */}
        <span></span>
      </EmojiPicker>

      {/* 隐藏的 file input —— 图片上传用 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageSelect}
      />

      {/* 发送按钮 */}
      <Button onClick={handleSend} style={{ marginLeft: 20 }}>发送</Button>
    </>
  );
};

export default QuillEditor;
