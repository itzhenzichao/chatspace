/**
 * 聊天 Slice —— 管理聊天室列表、消息列表、当前激活聊天室等状态
 *
 * 消息数据结构：
 *   messages 是一个 Record<string, Message[]>，以 roomId 为键，消息数组为值
 *   这样可以快速获取某个聊天室的消息，而不需要每次过滤
 *
 * 包含的 actions:
 * - setActiveRoom: 切换当前聊天室，同时清除该聊天室的未读计数
 * - sendMessage: 发送消息（当前用户发送，支持文字和图片类型）
 * - receiveMessage: 接收消息（模拟他人发来或系统推送）
 * - clearActiveRoom: 清除当前激活的聊天室
 * - addRoom: 创建新聊天室
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatRoom, ChatRoomType } from '../../types/chatroom';
import type { Message, MessageType } from '../../types/message';
import { mockRooms } from '../../mocks/data/rooms';
import { mockMessages } from '../../mocks/data/messages';

/** 聊天模块的状态类型 */
export interface ChatState {
  rooms: ChatRoom[];                        // 聊天室列表
  activeRoomId: string | null;              // 当前激活的聊天室 ID
  messages: Record<string, Message[]>;       // 以 roomId 为键的消息字典
  sendMessageLoading: boolean;              // 发送消息是否加载中（预留）
}

/** 初始状态 —— 从 mock 数据初始化，消息按 roomId 分组 */
const initialState: ChatState = {
  rooms: mockRooms,
  activeRoomId: null,
  // 将扁平的 mockMessages 数组按 roomId 分组为字典结构
  messages: mockMessages.reduce(
    (acc, msg) => {
      if (!acc[msg.roomId]) acc[msg.roomId] = [];
      acc[msg.roomId].push(msg);
      return acc;
    },
    {} as Record<string, Message[]>
  ),
  sendMessageLoading: false,
};

/** 聊天 Slice 定义 */
const chatSlice = createSlice({
  name: 'chat',
  initialState,

  reducers: {
    /**
     * 切换当前激活的聊天室
     * 同时将进入的聊天室未读计数归零（进入即视为已读）
     */
    setActiveRoom(state, action: PayloadAction<string>) {
      state.activeRoomId = action.payload;
      const room = state.rooms.find((r) => r.id === action.payload);
      if (room) room.unreadCount = 0;
    },

    /**
     * 发送消息 —— 当前用户发送一条新消息（支持文字和图片类型）
     * 同时更新聊天室的 lastMessage
     */
    sendMessage(state, action: PayloadAction<{ roomId: string; content: string; senderId: string; type?: MessageType }>) {
      const { roomId, content, senderId } = action.payload;
      const messageType = action.payload.type || 'text';  // 未指定类型时默认为文字
      const newMessage: Message = {
        id: `m_${Date.now()}`,   // 基于时间戳生成唯一 ID
        roomId,
        senderId,
        type: messageType,
        content,
        timestamp: Date.now(),
      };
      // 将消息添加到对应聊天室的消息列表
      if (!state.messages[roomId]) state.messages[roomId] = [];
      state.messages[roomId].push(newMessage);

      // 更新聊天室的最后一条消息（用于聊天室列表预览）
      const room = state.rooms.find((r) => r.id === roomId);
      if (room) room.lastMessage = newMessage;
    },

    /**
     * 接收消息 —— 模拟收到他人发来或系统推送的消息
     * 如果消息不在当前激活的聊天室，则增加未读计数
     */
    receiveMessage(state, action: PayloadAction<Message>) {
      const msg = action.payload;
      // 将消息添加到对应聊天室
      if (!state.messages[msg.roomId]) state.messages[msg.roomId] = [];
      state.messages[msg.roomId].push(msg);

      // 更新聊天室的最后一条消息
      const room = state.rooms.find((r) => r.id === msg.roomId);
      if (room) {
        room.lastMessage = msg;
        // 非当前激活聊天室的消息，增加未读计数
        if (msg.roomId !== state.activeRoomId) {
          room.unreadCount += 1;
        }
      }
    },

    /** 清除当前激活的聊天室 ID */
    clearActiveRoom(state) {
      state.activeRoomId = null;
    },

    /**
     * 创建新聊天室 —— 根据名称和类型生成新的 ChatRoom 对象
     * 自动生成 ID 和头像，初始化空消息列表
     */
    addRoom(state, action: PayloadAction<{ name: string; type: ChatRoomType }>) {
      const newRoom: ChatRoom = {
        id: `r_${Date.now()}`,                                       // 基于时间戳生成唯一 ID
        name: action.payload.name,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${action.payload.name}`, // 根据名称生成头像
        type: action.payload.type,
        members: [],                                                  // 新聊天室暂无成员
        unreadCount: 0,
      };
      state.rooms.push(newRoom);
      // 初始化新聊天室的消息列表为空数组
      state.messages[newRoom.id] = [];
    },
  },
});

// 导出 actions
export const { setActiveRoom, sendMessage, receiveMessage, clearActiveRoom, addRoom } = chatSlice.actions;
// 导出 reducer
export default chatSlice.reducer;