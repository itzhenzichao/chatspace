/**
 * 通用类型定义
 * 定义 API 响应、分页等与业务无关的基础数据结构
 * 使用泛型，可适配不同的数据类型
 */

/** API 响应接口 —— 标准化的接口返回格式 */
export interface ApiResponse<T> {
  code: number;        // 状态码（0 表示成功，其他为错误码）
  data: T;             // 响应数据（泛型，可以是任意类型）
  message: string;     // 响应提示信息
}

/** 分页请求参数接口 —— 列表查询时的分页参数 */
export interface PaginationParams {
  page: number;        // 当前页码
  pageSize: number;    // 每页条数
}

/** 分页响应接口 —— 分页查询返回的数据结构 */
export interface PaginatedResponse<T> {
  list: T[];           // 数据列表
  total: number;       // 总条数
  page: number;        // 当前页码
  pageSize: number;    // 每页条数
}