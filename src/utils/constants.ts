/**
 * 常量定义文件
 * 定义项目中使用的全局常量，如 localStorage 键名、默认头像等
 * 集中管理常量，避免硬编码散落在各处
 */

/** localStorage 中存储登录 Token 的键名 */
export const TOKEN_KEY = 'chatspace_token';

/** localStorage 中存储用户信息的键名 */
export const USER_KEY = 'chatspace_user';

/** 默认头像 URL —— 当用户没有自定义头像时使用 */
export const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';