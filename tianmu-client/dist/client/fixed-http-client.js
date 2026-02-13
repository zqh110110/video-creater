"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedHttpClient = void 0;
/**
 * 修复后的HTTP客户端
 */
const axios_1 = __importDefault(require("axios"));
const fixed_token_manager_1 = require("../auth/fixed-token-manager");
class FixedHttpClient {
    constructor(config) {
        this.config = config;
        this.tokenManager = new fixed_token_manager_1.FixedTokenManager(config.app_key, config.app_secret);
        // 创建axios实例
        this.axiosInstance = axios_1.default.create({
            baseURL: config.baseURL || 'https://open-api.wondershare.cc',
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json',
                'X-App-Key': config.app_key
            }
        });
        // 请求拦截器 - 修复后的版本
        this.axiosInstance.interceptors.request.use((config) => {
            // 获取认证头 - 同步方式
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
            return { ...config, headers };
        }, (error) => {
            console.error('[Request Error]', error);
            return Promise.reject(error);
        });
        // 响应拦截器 - 修复后的版本
        this.axiosInstance.interceptors.response.use((response) => {
            console.log(`[Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data
            });
            return response;
        }, (error) => {
            console.error('[Response Error]', error.response?.data || error.message);
            return Promise.reject(error);
        });
    }
}
exports.FixedHttpClient = FixedHttpClient;
//# sourceMappingURL=fixed-http-client.js.map