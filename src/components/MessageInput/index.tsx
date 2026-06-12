/**
 * MessageInput 组件 —— 聊天消息输入框
 *
 * 功能：
 * - 提供多行文本输入框（Ant Design Input.TextArea）
 * - Enter 键发送消息，Shift+Enter 换行
 * - 发送按钮点击也可发送
 * - 发送后自动清空输入框
 * - 输入框自适应高度（1-4行）
 *
 * 知识点：useState、事件处理（onPressEnter）、Ant Design Input.TextArea + Button
 */

import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useState } from 'react';

/** MessageInput 的 Props 类型 */
interface MessageInputProps {
  onSend: (content: string) => void; // 发送消息的回调函数
}

export default function MessageInput({ onSend }: MessageInputProps) {
  // 输入框的当前值
  const [value, setValue] = useState('');

  /** 发送消息处理函数 */
  const handleSend = () => {
    if (!value.trim()) return;       // 空内容不发送
    onSend(value.trim());            // 调用回调发送消息
    setValue('');                     // 发送后清空输入框
  };

  return (
    <div style={{ display: 'flex', gap: 8, padding: '8px 16px' }}>
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
      {/* 发送按钮 */}
      <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
    </div>
  );
}