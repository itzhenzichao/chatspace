/**
 * ExpressionBlot —— Quill 自定义表情嵌入格式
 *
 * 功能：
 * - 注册 'expression' 格式到 Quill，支持 insertEmbed 插入表情
 * - 渲染 emoji 文字字符 + 可选头像图片
 * - contentEditable="false" 保证表情作为原子嵌入不可编辑
 *
 * 知识点：
 * - Quill Parchment EmbedBlot 自定义格式（blotName、tagName、create、value）
 * - DOM 操作（createElement、setAttribute、appendChild）
 * - Quill.register 注册自定义 Blot 到全局 registry
 */

import { EmbedBlot } from 'parchment';
import Quill from 'quill';

/** 表情嵌入值的数据结构 —— code 为 emoji 字符，src 为可选的网络图片 URL */
export interface ExpressionValue {
  code: string;  // emoji 字符，如 '😀'
  src?: string;  // 可选的头像图片 URL
}

/**
 * ExpressionBlot —— 自定义 EmbedBlot，用于在 Quill 编辑器中渲染表情
 *
 * blotName: 'expression' — 对应 insertEmbed 使用的格式名
 * tagName: 'SPAN' — 渲染为 inline span 元素
 */
class ExpressionBlot extends EmbedBlot {
  static blotName = 'expression';
  static tagName = 'SPAN';
  static className = 'lx-expression-blot';

  /**
   * create —— 根据 value 创建 DOM 节点
   * @param value - 表情数据，支持 { code, src? } 对象或纯 emoji 字符串
   * @returns 渲染后的 span 元素
   */
  static create(value: ExpressionValue | string): HTMLElement {
    // 兼容字符串参数，直接作为 code 使用
    const data: ExpressionValue = typeof value === 'string'
      ? { code: value }
      : value;

    // 调用父类 create 获取基础 span 元素
    const node = super.create() as HTMLElement;
    // 设置 contentEditable="false"，使表情作为原子嵌入不可被编辑拆分
    node.setAttribute('contenteditable', 'false');
    // 存储数据属性，用于 value() 方法回读
    node.setAttribute('data-code', data.code);
    if (data.src) {
      node.setAttribute('data-src', data.src);
    }

    // 有网络图片 src 时：只渲染图片，不显示 emoji 文字
    if (data.src) {
      const img = document.createElement('img');
      img.src = data.src;
      img.className = 'lx-emoji-avatar';
      img.setAttribute('width', '24');
      img.setAttribute('height', '24');
      node.appendChild(img);
    } else {
      // 无图片时：渲染 emoji 文字字符
      const emojiSpan = document.createElement('span');
      emojiSpan.textContent = data.code;
      emojiSpan.className = 'lx-emoji-text';
      node.appendChild(emojiSpan);
    }

    return node;
  }

  /**
   * value —— 从 DOM 节点提取数据，用于 Delta 序列化
   * @param domNode - 渲染后的 DOM 元素
   * @returns 表情数据对象 { code, src }
   */
  static value(domNode: HTMLElement): ExpressionValue {
    const code = domNode.getAttribute('data-code') || '';
    const src = domNode.getAttribute('data-src') || undefined;
    return { code, src };
  }
}

// 注册到 Quill 全局 registry，允许 overwrite 以防 HMR 重复注册
// 必须在创建 Quill 实例之前调用
Quill.register(ExpressionBlot, true);

export default ExpressionBlot;
