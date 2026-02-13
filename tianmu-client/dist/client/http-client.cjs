"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
const token_manager_1 = require("../auth/token-manager");
/**
 * 天幕API HTTP客户端
 */
class HttpClient {
    constructor(config) {
        this.config = config;
        // 初始化Token管理器
        this.tokenManager = new token_manager_1.TokenManager(config.app_key, config.app_secret);
        // 创建axios实例
        this.axiosInstance = axios_1.default.create({
            baseURL: config.baseURL || 'https://open-api.wondershare.cc',
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                'X-App-Key': config.app_key
            }
        });
        // 请求拦截器 - 添加Token认证
        this.axiosInstance.interceptors.request.use((config) => {
            // 合并认证头，使用同步方式获取token
            const authHeader = this.tokenManager.getAuthHeader();
            // 合并认证头
            const headers = {
                ...config.headers,
                ...authHeader
            };
            console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`, {
                data: config.data,
                headers: headers
            });
            // 返回修改后的配置，类型断言避免编译错误
            return { ...config, headers };
        }, (error) => {
            console.error('[Request Error]', error);
            return Promise.reject(error);
        });
        // 响应拦截器 - 处理Token过期和刷新
        this.axiosInstance.interceptors.response.use((response) => {
            console.log(`[Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data
            });
            // 检查Token过期或权限错误
            if (response.status === 401 || response.status === 403) {
                console.log('🔄 Token可能过期，尝试刷新...');
                this.tokenManager.refreshToken().catch(error => {
                    console.warn('Token刷新失败:', error.message);
                });
            }
            return response;
        }, (error) => {
            console.error('[Response Error]', error.response?.data || error.message);
            return Promise.reject(error);
        });
    }
    /**
     * 发送GET请求
     */
    async get(url, config) {
        const maxRetries = 3;
        return (0, utils_1.retry)(async () => {
            const response = await this.axiosInstance.get(url, config);
            if (response.data.code !== 0) {
                throw new Error(`API Error: ${response.data.msg} (Code: ${response.data.code})`);
            }
            return response.data.data;
        }, maxRetries);
    }
    /**
     * 发送POST请求
     */
    async post(url, data, config) {
        const maxRetries = 3;
        return (0, utils_1.retry)(async () => {
            const response = await this.axiosInstance.post(url, data, config);
            if (response.data.code !== 0) {
                throw new Error(`API Error: ${response.data.msg} (Code: ${response.data.code})`);
            }
            return response.data.data;
        }, maxRetries);
    }
    /**
     * 轮询任务状态
     */
    async pollTaskStatus(task_id, maxAttempts = 60, intervalMs = 5000) {
        console.log(`开始轮询任务状态: ${task_id}`);
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                // 使用文档中的正确端点格式
                const result = await this.get(`/v1/open/video/taf/result/${task_id}`);
                console.log(`任务状态检查 (${attempt + 1}/${maxAttempts}):`, result);
                if (result.status === 'completed') {
                    console.log(`任务完成: ${task_id}`);
                    return result.result;
                }
                else if (result.status === 'failed') {
                    throw new Error(`任务失败: ${result.error || '未知错误'}`);
                }
                // 如果任务还在进行中，等待后继续检查
                await (0, utils_1.delay)(intervalMs);
            }
            catch (error) {
                console.error(`检查任务状态时出错 (${attempt + 1}/${maxAttempts}):`, error);
                // 如果不是最后一次尝试，继续重试
                if (attempt < maxAttempts - 1) {
                    await (0, utils_1.delay)(intervalMs);
                }
                else {
                    throw error;
                }
            }
        }
        throw new Error(`任务超时: ${task_id}`);
    }
    /**
     * 上传文件
     */
    async uploadFile(file, fileName) {
        // 简化实现，实际使用中需要根据具体环境实现
        throw new Error('uploadFile功能需要根据具体运行环境实现');
    }
    /**
     * 获取axios实例（用于自定义配置）
     */
    getAxiosInstance() {
        return this.axiosInstance;
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=http-client.js.map