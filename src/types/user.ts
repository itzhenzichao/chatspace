/**
 * 用户相关类型定义
 * 定义系统中用户对象的结构，以及登录/注册表单的参数类型
 */

/** 用户信息接口 —— 表示一个完整的用户对象 */
export interface User {
  id: string;             // 用户唯一标识
  username: string;       // 登录用户名
  nickname: string;       // 显示昵称
  avatar: string;         // 头像 URL
  status: 'online' | 'offline' | 'busy'; // 在线状态：在线/离线/忙碌（联合类型）
}

/** 登录参数接口 —— 登录表单提交时的数据结构 */
export interface LoginParams {
  username: string;       // 登录用户名
  password: string;       // 登录密码
}

/** 注册参数接口 —— 注册表单提交时的数据结构 */
export interface RegisterParams {
  username: string;       // 注册用户名
  password: string;       // 注册密码
  nickname: string;       // 注册昵称
}