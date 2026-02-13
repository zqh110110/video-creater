/**
 * 生成Basic认证token
 * @param app_key 应用密钥
 * @param app_secret 应用秘钥
 * @returns Basic认证token
 */
export declare function generateBasicToken(app_key: string, app_secret: string): string;
/**
 * 生成任务ID
 * @param prefix 任务前缀
 * @returns 任务ID
 */
export declare function generateTaskId(prefix?: string): string;
/**
 * 延迟函数
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export declare function delay(ms: number): Promise<void>;
/**
 * 重试函数
 * @param fn 要重试的函数
 * @param maxRetries 最大重试次数
 * @param delayMs 重试间隔毫秒数
 * @returns Promise
 */
export declare function retry<T>(fn: () => Promise<T>, maxRetries?: number, delayMs?: number): Promise<T>;
/**
 * 验证必需参数
 * @param obj 要验证的对象
 * @param requiredFields 必需字段列表
 * @throws Error 如果缺少必需字段
 */
export declare function validateRequiredFields(obj: any, requiredFields: string[]): void;
/**
 * 清理URL参数
 * @param url 原始URL
 * @returns 清理后的URL
 */
export declare function sanitizeUrl(url: string): string;
/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化的文件大小字符串
 */
export declare function formatFileSize(bytes: number): string;
//# sourceMappingURL=index.d.ts.map