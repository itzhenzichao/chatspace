/**
 * EmojiPicker —— 表情选择面板组件
 *
 * 功能：
 * - 按分类展示常见 emoji（6 类共约 100 个 + 2 个网络图片）
 * - 支持纯 emoji 字符和网络图片两种表情类型
 * - 点击表情后通过 onSelect 回调通知父组件（传递 ExpressionValue）
 * - 使用 Ant Design Popover 实现弹出面板
 * - 选中后自动关闭面板
 *
 * 知识点：
 * - React 函数组件 + TypeScript Props 类型定义
 * - Ant Design Popover 组件（content + trigger）
 * - 列表渲染 & Key（emoji grid）
 * - 条件渲染（visible 控制面板显示）
 * - 联合类型区分纯 emoji 和网络图片表情
 */

import { Popover } from 'antd';
import { EMOJI_LISTS } from './emojiData';
import type { EmojiCategory, EmojiItem } from './emojiData';
import type { ExpressionValue } from './ExpressionBlot';
import './EmojiPicker.scss';

/** EmojiPicker 的 Props 类型 */
interface EmojiPickerProps {
  visible: boolean;                          // 面板是否可见
  onSelect: (value: ExpressionValue) => void;  // 选择表情后的回调，传递 ExpressionValue
  onClose: () => void;                       // 关闭面板的回调
  children: React.ReactNode;                 // Popover 触发元素（如 toolbar 按钮）
}

/**
 * resolveEmojiItem —— 将 EmojiItem 转换为 ExpressionValue
 * 纯 emoji 字符串转为 { code: emoji }，对象类型直接返回
 * @param item - 表情项（emoji 字符串或 ExpressionValue 对象）
 * @returns ExpressionValue 对象
 */
const resolveEmojiItem = (item: EmojiItem): ExpressionValue => {
  console.log('item:', item);
  return typeof item === 'string' ? { code: item } : item;
};

/**
 * EmojiPicker 组件 —— 表情选择面板
 * 使用 Ant Popover 包裹触发按钮，面板内容为 emoji 分类 grid
 */
const EmojiPicker = ({ visible, onSelect, onClose, children }: EmojiPickerProps) => {
  /**
   * handleSelect —— 点击单个表情的处理
   * 将 EmojiItem 转换为 ExpressionValue 后触发回调并关闭面板
   * @param item - 选中的表情项
   */
  const handleSelect = (item: EmojiItem) => {
    onSelect(resolveEmojiItem(item));
    onClose();
  };

  /**
   * renderCategory —— 渲染单个表情分类区块
   * @param category - 分类数据（label + emojis）
   * @returns 分类标题 + emoji grid
   */
  const renderCategory = (category: EmojiCategory) => (
    <div key={category.label} className="lx-emoji-category">
      {/* 分类标题 */}
      <div className="lx-emoji-category-label">{category.label}</div>
      {/* emoji grid：每个表情一个可点击格子 */}
      <div className="lx-emoji-grid">
        {category.emojis.map((item, idx) => {
          const value = resolveEmojiItem(item);
          // 网络图片表情：渲染 img + emoji code
          if (value.src) {
            return (
              <button
                key={`img-${idx}`}
                className="lx-emoji-item lx-emoji-image-item"
                onClick={() => handleSelect(item)}
                title={value.code}
              >
                <img src={value.src} alt={value.code} width={24} height={24} />
              </button>
            );
          }
          // 纯 emoji 字符表情：直接渲染 emoji
          return (
            <button
              key={value.code}
              className="lx-emoji-item"
              onClick={() => handleSelect(item)}
              title={value.code}
            >
              {value.code}
            </button>
          );
        })}
      </div>
    </div>
  );

  /** Popover 面板内容 —— 所有分类的 emoji grid */
  const pickerContent = (
    <div className="lx-emoji-picker-content">
      {EMOJI_LISTS.map(renderCategory)}
    </div>
  );

  return (
    <Popover
      content={pickerContent}
      trigger="click"
      open={visible}
      onOpenChange={(open) => {
        // Popover 关闭时（点击外部）触发 onClose
        if (!open) onClose();
      }}
      placement="topLeft"
    >
      {children}
    </Popover>
  );
};

export default EmojiPicker;
