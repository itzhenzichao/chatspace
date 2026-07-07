/**
 * emojiData —— 表情分类数据常量
 *
 * 功能：
 * - 定义 EmojiItem 接口（emoji 字符或网络图片 URL）
 * - 定义 EmojiCategory 接口（分类标签 + emoji 数组）
 * - 导出 EMOJI_LISTS 常量，供 EmojiPicker 使用
 * - 包含 2 个网络图片表情（picsum.photos 提供的随机图片）
 *
 * 知识点：
 * - interface 定义（字段行内注释）
 * - 联合类型（EmojiItem = string | ExpressionValue）
 * - 常量导出与类型约束
 */

import type { ExpressionValue } from './ExpressionBlot';

/** 表情项类型 —— 支持纯 emoji 字符或带网络图片的 expression 值 */
type EmojiItem = string | ExpressionValue;

/** 表情分类接口 —— 表示一组同类别 emoji */
interface EmojiCategory {
  label: string;       // 分类名称，如"笑脸"、"网络图片"
  emojis: EmojiItem[]; // 该分类下的表情项数组（emoji 字符或 ExpressionValue）
}

/** 表情分类列表 —— 6 大类常见 emoji + 网络图片，供 EmojiPicker 渲染 */
const EMOJI_LISTS: EmojiCategory[] = [
  {
    label: '笑脸与表情',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '🥰', '😍', '🤩', '😘', '😗', '😋', '😛', '😜', '🤪', '😝'],
  },
  {
    label: '人物与手势',
    emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👋', '🤚', '✋', '🖖', '👏', '🙌', '🤝', '🙏', '💪', '🤗', '🤔', '🤫'],
  },
  {
    label: '自然与动物',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🔥', '⭐', '🌟', '✨', '🌈', '☀️'],
  },
  {
    label: '物品与符号',
    emojis: ['🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🎯', '🎮', '🎵', '🎶', '✅', '❌', '⭕', '❓', '❗', '⚠️', '🚀', '💡', '📌', '📎'],
  },
  {
    label: '动物与植物',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🌸', '🌺', '🌻', '🍀'],
  },
  {
    label: '网络图片',
    // 2 个网络图片表情 —— 使用 picsum.photos 提供的随机图片作为 src
    emojis: [
      { code: '🌻', src: 'https://picsum.photos/seed/flower1/24/24' },  // 随机花朵图片
      { code: '🐱', src: 'https://picsum.photos/seed/cat2/24/24' },     // 随机猫咪图片
    ],
  },
];

export { EmojiItem, EmojiCategory, EMOJI_LISTS };
