/**
 * MessageInput 组件 —— 聊天消息输入框
 *
 * 功能：
 * - 提供多行文本输入框（Ant Design Input.TextArea）
 * - Enter 键发送消息，Shift+Enter 换行
 * - 发送按钮点击也可发送
 * - 图片上传按钮（Ant Design Upload），选择图片后显示预览
 * - 发送后自动清空输入框和图片预览
 * - 输入框自适应高度（1-4行）
 *
 * 知识点：
 * - useState（输入值、图片预览）
 * - 事件处理（onPressEnter）
 * - Ant Design Input.TextArea + Button + Upload + Image
 * - FileReader 读取本地文件为 URL
 * - beforeUpload 返回 false 阻止自动上传
 */

import { Input, Button, Image } from 'antd';
import { SendOutlined, PictureOutlined, CloseOutlined } from '@ant-design/icons';
import { useState, useRef, memo } from 'react';
import type { MessageType } from '../../types/message';

/** MessageInput 的 Props 类型 */
interface MessageInputProps {
  onSend: (content: string, type: MessageType) => void;  // 发送消息的回调函数（增加 type 参数）
}

/**
 * MessageInput 组件 —— 使用 React.memo 包裹避免不必要的重新渲染
 * onSend 是函数类型 props，父组件需用 useCallback 稳定引用才能发挥 memo 效果
 */
const MessageInput = memo(function MessageInput({ onSend }: MessageInputProps) {
  // 输入框的当前值
  const [value, setValue] = useState('');
  // 图片预览 URL（选择图片后通过 FileReader 读取）
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // 隐藏的 file input ref，用于触发图片选择
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 发送消息处理函数 —— 根据是否有图片预览决定发送类型
   * 有图片时发送图片消息（content 为图片 URL），否则发送文字消息
   */
  const handleSend = () => {
    if (imagePreview) {
      // 有图片预览时发送图片消息
      onSend(imagePreview, 'image');
      setImagePreview(null);     // 发送后清除图片预览
      setValue('');              // 同时清空文字输入框
    } else if (value.trim()) {
      // 无图片时发送文字消息
      onSend(value.trim(), 'text');
      setValue('');              // 发送后清空输入框
    }
  };

  /**
   * 图片选择处理函数 —— 通过 FileReader 将本地文件转为 URL 用于预览
   * 不进行真正的上传（因为无后端），仅在前端展示
   */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 使用 FileReader 读取文件为本地 URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setImagePreview(url);    // 设置图片预览
    };
    reader.readAsDataURL(file);
    // 重置 file input value，允许重复选择同一文件
    e.target.value = '';
  };

  return (
    <div style={{ padding: '8px 16px' }}>
      {/* 图片预览区域 —— 仅在有图片时显示 */}
      {imagePreview && (
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image
            src={imagePreview}
            alt="预览"
            width={80}
            height={80}
            style={{ borderRadius: 4, objectFit: 'cover' }}
          />
          {/* 清除图片预览按钮 */}
          <CloseOutlined
            style={{ cursor: 'pointer', color: '#999' }}
            onClick={() => setImagePreview(null)}
          />
        </div>
      )}

      {/* 输入区域：文本框 + 图片按钮 + 发送按钮 */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        {/* 隐藏的 file input —— 点击图片按钮触发 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageSelect}
        />
        {/* 多行文本输入框 */}
        <Input.TextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}  // 更新输入值
          onPressEnter={(e) => {
            // Enter 键发送消息，Shift+Enter 换行（不发送）
            if (!e.shiftKey) {
              e.preventDefault();    // 阻止默认换行行为
              handleSend();           // 触发发送
            }
          }}
          placeholder="输入消息，Enter 发送，Shift+Enter换行"
          autoSize={{ minRows: 1, maxRows: 4 }}  // 自适应高度，1-4行
          style={{ flex: 1 }}
        />
        {/* 图片选择按钮 —— 触发隐藏的 file input */}
        <Button
          icon={<PictureOutlined />}
          onClick={() => fileInputRef.current?.click()}
          title="发送图片"
        />
        {/* 发送按钮 */}
        <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
      </div>
    </div>
  );
});

export default MessageInput;