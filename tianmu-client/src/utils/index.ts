import { createHash } from 'crypto';

/**
 * 生成Basic认证token
 * @param app_key 应用密钥
 * @param app_secret 应用秘钥
 * @returns Basic认证token
 */
export function generateBasicToken(app_key: string, app_secret: string): string {
  const credentials = `${app_key}:${app_secret}`;
  const base64Credentials = Buffer.from(credentials, 'utf8').toString('base64');
  return `Basic ${base64Credentials}`;
}

/**
 * 生成任务ID
 * @param prefix 任务前缀
 * @returns 任务ID
 */
export function generateTaskId(prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const hash = createHash('md5').update(`${prefix}${timestamp}${random}`).digest('hex');
  return `${prefix}-${timestamp}-${hash}`;
}

/**
 * 延迟函数
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 * @param fn 要重试的函数
 * @param maxRetries 最大重试次数
 * @param delayMs 重试间隔毫秒数
 * @returns Promise
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries) {
        await delay(delayMs * Math.pow(2, i)); // 指数退避
      }
    }
  }
  
  throw lastError!;
}

/**
 * 验证必需参数
 * @param obj 要验证的对象
 * @param requiredFields 必需字段列表
 * @throws Error 如果缺少必需字段
 */
export function validateRequiredFields(obj: any, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(field => !obj[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
}

/**
 * 清理URL参数
 * @param url 原始URL
 * @returns 清理后的URL
 */
export function sanitizeUrl(url: string): string {
  return url.trim().replace(/\s+/g, '%20');
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}