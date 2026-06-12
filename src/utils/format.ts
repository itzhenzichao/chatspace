/**
 * 格式化工具函数
 * 提供时间和日期的格式化功能
 */

/**
 * 将时间戳格式化为友好的时间显示文本
 * 根据与当前时间的差距，显示不同的格式：
 * - 今天：显示"今天 HH:mm"
 * - 昨天：显示"昨天"
 * - 7天内：显示"X天前"
 * - 更早：显示"月/日"
 * @param timestamp - 毫秒时间戳
 * @returns 格式化后的时间字符串
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();         // 计算时间差（毫秒）
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // 转换为天数

  if (diffDays === 0) {
    // 今天的消息，显示具体时间
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  if (diffDays === 1) {
    return '昨天';
  }
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  // 超过7天，显示月/日格式
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * 将时间戳格式化为标准日期字符串
 * 格式为 YYYY-MM-DD
 * @param timestamp - 毫秒时间戳
 * @returns 格式化后的日期字符串
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}