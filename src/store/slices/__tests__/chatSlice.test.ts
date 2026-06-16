/**
 * chatSlice 单元测试
 *
 * 测试覆盖：
 * - setActiveRoom：切换聊天室 + 清零未读计数
 * - sendMessage：发送文字/图片消息 + 更新 lastMessage
 * - receiveMessage：接收消息 + 非活跃房间增加未读计数
 * - clearActiveRoom：清除活跃聊天室
 * - addRoom：创建新聊天室 + 初始化空消息列表
 *
 * 知识点：
 * - Vitest describe/it/expect
 * - Redux Toolkit PayloadAction 测试
 * - immer 不可变更新在测试中的验证
 */

import { describe, it, expect } from 'vitest';
import chatSlice, { setActiveRoom, sendMessage, receiveMessage, clearActiveRoom, addRoom } from '../chatSlice';
import type { ChatState } from '../chatSlice';
import { mockRooms } from '../../../mocks/data/rooms';

/** 使用 mock 数据构造的初始状态，与 Slice 的 initialState 一致 */
const createInitialState = (): ChatState => ({
  rooms: [...mockRooms],
  activeRoomId: null,
  messages: {},
  sendMessageLoading: false,
});

describe('chatSlice', () => {
  describe('setActiveRoom', () => {
    it('设置 activeRoomId 并清零该房间未读计数', () => {
      const state = createInitialState();
      // r1 的初始 unreadCount 为 3
      const r1 = state.rooms.find((r) => r.id === 'r1');
      expect(r1?.unreadCount).toBe(3);

      const newState = chatSlice(state, setActiveRoom('r1'));
      expect(newState.activeRoomId).toBe('r1');
      // 进入 r1 后未读计数应归零
      const updatedR1 = newState.rooms.find((r) => r.id === 'r1');
      expect(updatedR1?.unreadCount).toBe(0);
    });
  });

  describe('sendMessage', () => {
    it('发送文字消息到指定聊天室', () => {
      const state = createInitialState();
      state.activeRoomId = 'r1';
      state.messages['r1'] = [];

      const newState = chatSlice(state, sendMessage({
        roomId: 'r1',
        content: '测试消息',
        senderId: 'u1',
        type: 'text',
      }));

      // 消息应被添加到 r1 的消息列表
      expect(newState.messages['r1']).toHaveLength(1);
      expect(newState.messages['r1'][0].content).toBe('测试消息');
      expect(newState.messages['r1'][0].type).toBe('text');
      // lastMessage 应更新
      const room = newState.rooms.find((r) => r.id === 'r1');
      expect(room?.lastMessage?.content).toBe('测试消息');
    });

    it('发送图片消息', () => {
      const state = createInitialState();
      state.messages['r1'] = [];

      const newState = chatSlice(state, sendMessage({
        roomId: 'r1',
        content: 'https://picsum.photos/300/200',
        senderId: 'u1',
        type: 'image',
      }));

      expect(newState.messages['r1'][0].type).toBe('image');
      expect(newState.messages['r1'][0].content).toBe('https://picsum.photos/300/200');
    });

    it('未指定 type 时默认为 text', () => {
      const state = createInitialState();
      state.messages['r1'] = [];

      const newState = chatSlice(state, sendMessage({
        roomId: 'r1',
        content: '默认文字',
        senderId: 'u1',
      }));

      expect(newState.messages['r1'][0].type).toBe('text');
    });
  });

  describe('receiveMessage', () => {
    it('接收消息并增加非活跃房间的未读计数', () => {
      const state = createInitialState();
      // 当前在 r2，消息来自 r1（非活跃房间）
      state.activeRoomId = 'r2';
      state.messages['r1'] = [];

      const newState = chatSlice(state, receiveMessage({
        id: 'incoming_1',
        roomId: 'r1',
        senderId: 'u2',
        type: 'text',
        content: '有人在吗？',
        timestamp: Date.now(),
      }));

      // 消息应被添加到 r1
      expect(newState.messages['r1']).toHaveLength(1);
      // r1 的未读计数应增加 1
      const r1 = newState.rooms.find((r) => r.id === 'r1');
      expect(r1?.unreadCount).toBe(4);   // 原始 3 + 1
    });

    it('活跃房间的消息不增加未读计数', () => {
      const state = createInitialState();
      state.activeRoomId = 'r1';
      state.messages['r1'] = [];
      // r1 进入时未读归零
      chatSlice(state, setActiveRoom('r1'));
      const r1Before = state.rooms.find((r) => r.id === 'r1');

      const newState = chatSlice(state, receiveMessage({
        id: 'incoming_2',
        roomId: 'r1',
        senderId: 'u2',
        type: 'text',
        content: '收到消息',
        timestamp: Date.now(),
      }));

      const r1After = newState.rooms.find((r) => r.id === 'r1');
      // 未读计数不应增加（因为 r1 是活跃房间）
      expect(r1After?.unreadCount).toBe(r1Before?.unreadCount);
    });
  });

  describe('clearActiveRoom', () => {
    it('清除 activeRoomId', () => {
      const state = createInitialState();
      state.activeRoomId = 'r1';

      const newState = chatSlice(state, clearActiveRoom());
      expect(newState.activeRoomId).toBeNull();
    });
  });

  describe('addRoom', () => {
    it('创建新聊天室并初始化空消息列表', () => {
      const state = createInitialState();
      const originalCount = state.rooms.length;

      const newState = chatSlice(state, addRoom({ name: '新群聊', type: 'group' }));

      // 聊天室数量应增加 1
      expect(newState.rooms.length).toBe(originalCount + 1);
      // 新聊天室应存在
      const newRoom = newState.rooms.find((r) => r.name === '新群聊');
      expect(newRoom).not.toBeNull();
      expect(newRoom?.type).toBe('group');
      expect(newRoom?.unreadCount).toBe(0);
      // 新聊天室的消息列表应为空数组
      expect(newState.messages[newRoom!.id]).toEqual([]);
    });
  });
});
