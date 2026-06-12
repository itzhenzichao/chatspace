/**
 * Chat 页面 —— 聊天主页面
 *
 * 结构：
 * - 左侧：聊天室列表（搜索 + RoomCard 列表）
 * - 右侧：消息区（聊天室头部 + 消息列表 + 输入框）
 * - 未选择聊天室时显示空状态占位
 *
 * 核心功能：
 * - 聊天室搜索（防抖过滤）
 * - 消息列表渲染（区分自己/他人/系统消息）
 * - 发送消息
 * - 模拟消息自动推送（每 8 秒随机推送一条消息到当前聊天室）
 * - 新消息自动滚动到底部
 *
 * 知识点：
 * - useAppSelector 读取 Redux 状态
 * - useAppDispatch 派发 Redux actions
 * - useRef + scrollIntoView 实现自动滚动
 * - useEffect 定时器模拟 WebSocket 推送（清理函数避免内存泄漏）
 * - useDebounce 搜索防抖
 * - 条件渲染（有/无激活聊天室）
 * - 列表渲染 + Key
 */

import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setActiveRoom, sendMessage, receiveMessage } from '../../store/slices/chatSlice';
import RoomCard from '../../components/RoomCard';
import ChatBubble from '../../components/ChatBubble';
import MessageInput from '../../components/MessageInput';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { mockUsers } from '../../mocks/data/users';

export default function Chat() {
  const dispatch = useAppDispatch();
  // 从 Redux 中解构聊天相关的状态
  const { rooms, activeRoomId, messages } = useAppSelector((state) => state.chat);
  const user = useAppSelector((state) => state.auth.user);   // 当前登录用户

  // 搜索相关状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedKeyword = useDebounce(searchKeyword, 300);  // 300ms 防抖

  // 消息列表底部引用，用于自动滚动
  const messageEndRef = useRef<HTMLDivElement>(null);

  // 根据搜索关键词过滤聊天室列表
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
  );

  // 当前激活的聊天室对象
  const activeRoom = rooms.find((r) => r.id === activeRoomId);
  // 当前聊天室的消息列表
  const activeMessages = activeRoomId ? messages[activeRoomId] || [] : [];

  // 消息列表变化时自动滚动到底部
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  // 模拟 WebSocket 消息推送：每 8 秒向当前聊天室推送一条随机消息
  useEffect(() => {
    if (!activeRoomId) return;

    const timer = setInterval(() => {
      // 随机选择一个用户（排除自己）
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      if (randomUser.id === user?.id) return;

      // 随机选择一条消息内容
      const autoMessages = [
        '有人在线吗？',
        '刚看到一个不错的技术文章',
        '今天天气不错啊',
        '这个功能怎么实现的？',
        '哈哈，有意思',
      ];

      // 派发 receiveMessage action，模拟收到新消息
      dispatch(
        receiveMessage({
          id: `auto_${Date.now()}`,
          roomId: activeRoomId,
          senderId: randomUser.id,
          type: 'text',
          content: autoMessages[Math.floor(Math.random() * autoMessages.length)],
          timestamp: Date.now(),
        })
      );
    }, 8000);  // 每 8 秒推送一条

    // 清理函数：切换聊天室或组件卸载时清除定时器，避免内存泄漏
    return () => clearInterval(timer);
  }, [activeRoomId, dispatch, user?.id]);

  /** 发送消息处理函数 */
  const handleSend = (content: string) => {
    if (!activeRoomId || !user) return;
    dispatch(sendMessage({ roomId: activeRoomId, content, senderId: user.id }));
  };

  /** 根据 senderId 获取发送者昵称 */
  const getSenderName = (senderId: string) => {
    if (senderId === user?.id) return '我';
    const sender = mockUsers.find((u) => u.id === senderId);
    return sender?.nickname || '未知用户';
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* ===== 左侧聊天室列表 ===== */}
      <div
        style={{
          width: 280,
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafafa',
        }}
      >
        {/* 搜索框 */}
        <SearchBar value={searchKeyword} onChange={setSearchKeyword} placeholder="搜索聊天室" />
        {/* 聊天室列表 */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              name={room.name}
              avatar={room.avatar}
              lastMessageContent={room.lastMessage?.content}
              lastMessageTime={room.lastMessage?.timestamp}
              unreadCount={room.unreadCount}
              isActive={room.id === activeRoomId}
              onClick={() => dispatch(setActiveRoom(room.id))}  // 点击切换聊天室
            />
          ))}
        </div>
      </div>

      {/* ===== 右侧消息区 ===== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeRoom ? (
          <>
            {/* 聊天室头部 —— 显示名称和成员数 */}
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                fontWeight: 500,
                fontSize: 16,
              }}
            >
              {activeRoom.name}
              <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>
                ({activeRoom.members.length}人)
              </span>
            </div>
            {/* 消息列表 —— 滚动区域 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {activeMessages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  isSelf={msg.senderId === user?.id}   // 判断是否是自己发的
                  senderName={getSenderName(msg.senderId)}
                  type={msg.type}
                />
              ))}
              {/* 锚点 div —— 用于自动滚动到底部 */}
              <div ref={messageEndRef} />
            </div>
            {/* 消息输入框 */}
            <MessageInput onSend={handleSend} />
          </>
        ) : (
          // 未选择聊天室时的空状态
          <EmptyState description="选择一个聊天室开始聊天" />
        )}
      </div>
    </div>
  );
}