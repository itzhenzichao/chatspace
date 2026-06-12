/**
 * localStorage 封装工具
 * 提供类型安全的 localStorage 读写删除操作
 * 使用泛型确保存取数据类型的正确性
 */

/**
 * 从 localStorage 中读取数据
 * @param key - 存储键名
 * @param defaultValue - 默认值（当键不存在或解析失败时返回）
 * @returns 解析后的数据，类型由泛型 T 决定
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    // 如果有值则 JSON 解析，否则返回默认值
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    // JSON 解析失败时安全返回默认值
    return defaultValue;
  }
}

/**
 * 将数据写入 localStorage
 * @param key - 存储键名
 * @param value - 要存储的数据，会自动 JSON 序列化
 */
export function setStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 从 localStorage 中删除指定键的数据
 * @param key - 要删除的键名
 */
export function removeStorageItem(key: string): void {
  localStorage.removeItem(key);
}