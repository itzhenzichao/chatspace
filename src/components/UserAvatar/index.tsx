/**
 * UserAvatar 组件 —— 带在线状态指示器的用户头像
 *
 * 功能：
 * - 显示用户头像（使用 Ant Design Avatar）
 * - 在头像右下角显示在线状态圆点（绿色=在线，黄色=忙碌，灰色=离线）
 * - 支持自定义头像大小
 * - 无头像时显示默认图标
 *
 * 知识点：Ant Design Avatar、Props 类型定义、Record 类型映射、条件渲染
 */

import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

/** UserAvatar 的 Props 类型 */
interface UserAvatarProps {
  src?: string;                      // 头像 URL（可选，无则显示默认图标）
  size?: number;                     // 头像大小（默认 40px）
  status?: 'online' | 'offline' | 'busy'; // 在线状态（可选，无则不显示状态点）
}

export default function UserAvatar({ src, size = 40, status }: UserAvatarProps) {
  // 状态颜色映射：使用 Record 类型确保每种状态对应一个颜色值
  const statusColor: Record<string, string> = {
    online: '#52c41a',    // 绿色 —— 在线
    busy: '#faad14',      // 黄色 —— 忙碌
    offline: '#d9d9d9',   // 灰色 —— 离线
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* 头像：有 src 时显示图片，无 src 时显示 UserOutlined 图标 */}
      <Avatar src={src} size={size} icon={!src && <UserOutlined />} />
      {/* 状态圆点：仅在传入 status 参数时显示 */}
      {status && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.3,            // 圆点大小随头像大小缩放
            height: size * 0.3,
            borderRadius: '50%',
            backgroundColor: statusColor[status],  // 根据 status 取对应颜色
            border: '2px solid #fff',              // 白色描边让圆点更清晰
          }}
        />
      )}
    </div>
  );
}