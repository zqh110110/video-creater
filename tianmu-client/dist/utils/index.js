"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBasicToken = generateBasicToken;
exports.generateTaskId = generateTaskId;
exports.delay = delay;
exports.retry = retry;
exports.validateRequiredFields = validateRequiredFields;
exports.sanitizeUrl = sanitizeUrl;
exports.formatFileSize = formatFileSize;
const crypto_1 = require("crypto");
/**
 * 生成Basic认证token
 * @param app_key 应用密钥
 * @param app_secret 应用秘钥
 * @returns Basic认证token
 */
function generateBasicToken(app_key, app_secret) {
    const credentials = `${app_key}:${app_secret}`;
    const base64Credentials = Buffer.from(credentials, 'utf8').toString('base64');
    return `Basic ${base64Credentials}`;
}
/**
 * 生成任务ID
 * @param prefix 任务前缀
 * @returns 任务ID
 */
function generateTaskId(prefix = '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const hash = (0, crypto_1.createHash)('md5').update(`${prefix}${timestamp}${random}`).digest('hex');
    return `${prefix}-${timestamp}-${hash}`;
}
/**
 * 延迟函数
 * @param ms 延迟毫秒数
 * @returns Promise
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * 重试函数
 * @param fn 要重试的函数
 * @param maxRetries 最大重试次数
 * @param delayMs 重试间隔毫秒数
 * @returns Promise
 */
async function retry(fn, maxRetries = 3, delayMs = 1000) {
    let lastError;
    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (i < maxRetries) {
                await delay(delayMs * Math.pow(2, i)); // 指数退避
            }
        }
    }
    throw lastError;
}
/**
 * 验证必需参数
 * @param obj 要验证的对象
 * @param requiredFields 必需字段列表
 * @throws Error 如果缺少必需字段
 */
function validateRequiredFields(obj, requiredFields) {
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
function sanitizeUrl(url) {
    return url.trim().replace(/\s+/g, '%20');
}
/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化的文件大小字符串
 */
function formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0)
        return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
//# sourceMappingURL=index.js.map