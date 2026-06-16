/**
 * Mock 消息数据
 * 模拟各个聊天室中的历史消息
 * 使用当前时间戳减去偏移量来模拟不同时间的消息
 */

import type { Message } from '../../types/message';

/** 当前时间戳，用于计算各消息的相对时间 */
const now = Date.now();

/** Mock 消息列表 —— 涵盖 4 个聊天室的历史消息 */
export const mockMessages: Message[] = [
  // ===== 前端技术交流群 (r1) 的消息 =====
  {
    id: 'm1',
    roomId: 'r1',             // 所属聊天室 ID
    senderId: 'u2',           // 发送者：李四
    type: 'text',             // 文字消息
    content: '大家好，最近在研究 React 18 的新特性',
    timestamp: now - 3600000 * 5,  // 5小时前
  },
  {
    id: 'm2',
    roomId: 'r1',
    senderId: 'u3',           // 发送者：王五
    type: 'text',
    content: 'Automatic Batching 确实很有意思',
    timestamp: now - 3600000 * 4,  // 4小时前
  },
  {
    id: 'm3',
    roomId: 'r1',
    senderId: 'u1',           // 发送者：张三（自己）
    type: 'text',
    content: '推荐看看 Suspense 的用法，配合 React Router 很好用',
    timestamp: now - 3600000 * 3,  // 3小时前
  },
  {
    id: 'm4',
    roomId: 'r1',
    senderId: 'u4',           // 发送者：赵六
    type: 'text',
    content: '有人用过 Redux Toolkit 吗？比老版 Redux 简洁太多了',
    timestamp: now - 3600000 * 2,  // 2小时前
  },
  {
    id: 'm5',
    roomId: 'r1',
    senderId: 'u1',
    type: 'text',
    content: 'RTK + TypeScript 体验非常好，强类型推导',
    timestamp: now - 3600000,      // 1小时前
  },
  {
    id: 'm6',
    roomId: 'r1',
    senderId: 'u2',
    type: 'system',           // 系统通知消息
    content: '王五 加入了群聊',
    timestamp: now - 1800000,      // 30分钟前
  },
  {
    id: 'm7',
    roomId: 'r1',
    senderId: 'u3',
    type: 'text',
    content: '大家好！刚加进来，请多关照',
    timestamp: now - 900000,       // 15分钟前
  },
  {
    id: 'm8',
    roomId: 'r1',
    senderId: 'u4',
    type: 'text',
    content: '欢迎欢迎！',
    timestamp: now - 600000,       // 10分钟前
  },
  {
    id: 'm9',
    roomId: 'r1',
    senderId: 'u2',
    type: 'image',            // 图片消息
    content: 'https://picsum.photos/300/200?random=1',  // 随机图片 URL
    timestamp: now - 500000,       // 约8分钟前
  },

  // ===== 私聊消息 (r3) —— 与李四的对话 =====
  {
    id: 'm20',
    roomId: 'r3',
    senderId: 'u2',
    type: 'text',
    content: '在吗？项目方案你看了吗',
    timestamp: now - 7200000,      // 2小时前
  },
  {
    id: 'm21',
    roomId: 'r3',
    senderId: 'u1',
    type: 'text',
    content: '看了，整体没问题，有几个细节想讨论下',
    timestamp: now - 6000000,      // 约1.7小时前
  },
  {
    id: 'm22',
    roomId: 'r3',
    senderId: 'u2',
    type: 'text',
    content: '好的，下午开会聊？',
    timestamp: now - 3000000,      // 50分钟前
  },

  // ===== 项目组消息 (r2) =====
  {
    id: 'm30',
    roomId: 'r2',
    senderId: 'u5',
    type: 'text',
    content: '这周的迭代进度大家同步下',
    timestamp: now - 86400000,     // 1天前
  },
  {
    id: 'm31',
    roomId: 'r2',
    senderId: 'u1',
    type: 'text',
    content: '前端部分已完成 80%',
    timestamp: now - 82800000,     // 约23小时前
  },

  // ===== 摸鱼大队消息 (r4) =====
  {
    id: 'm40',
    roomId: 'r4',
    senderId: 'u2',
    type: 'text',
    content: '中午吃什么？',
    timestamp: now - 7200000,
  },
  {
    id: 'm41',
    roomId: 'r4',
    senderId: 'u3',
    type: 'text',
    content: '黄焖鸡！',
    timestamp: now - 7000000,
  },
  {
    id: 'm42',
    roomId: 'r4',
    senderId: 'u4',
    type: 'text',
    content: '麻辣烫+1',
    timestamp: now - 6800000,
  },
  {
    id: 'm43',
    roomId: 'r4',
    senderId: 'u5',
    type: 'text',
    content: '外卖吧，今天不想出门',
    timestamp: now - 6600000,
  },
  {
    id: 'm44',
    roomId: 'r4',
    senderId: 'u1',
    type: 'text',
    content: '我也外卖，拼单吗',
    timestamp: now - 6400000,
  },
  {
    id: 'm45',
    roomId: 'r4',
    senderId: 'u3',
    type: 'image',            // 图片消息
    content: 'https://picsum.photos/300/200?random=2',  // 随机图片 URL
    timestamp: now - 6200000,
  },
];