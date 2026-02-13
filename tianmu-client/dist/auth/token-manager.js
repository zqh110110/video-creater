"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
/**
 * Token管理器 - 处理天幕API的Token-Based认证
 */
class TokenManager {
    constructor(appKey, appSecret, tokenEndpoint = 'https://open-api.wondershare.cc/v1/open/capacity/application/tob_text2video_b') {
        this.appKey = appKey;
        this.appSecret = appSecret;
        this.tokenEndpoint = tokenEndpoint;
        this.token = null;
        this.tokenExpiry = 0;
        this.TOKEN_BUFFER_SECONDS = 300; // 5分钟缓冲时间
    }
    /**
     * 获取有效的Token
     */
    async getValidToken() {
        // 检查Token是否存在且未过期
        if (this.token && !this.isTokenExpired()) {
            return this.token;
        }
        // 生成新Token
        return await this.generateNewToken();
    }
    /**
     * 生成新的访问Token
     */
    async generateNewToken() {
        try {
            const axios = require('axios');
            // 调用Token生成接口
            const response = await axios.post(this.tokenEndpoint, {}, // 空body，只使用认证头
            {
                headers: {
                    'X-App-Key': this.appKey,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.code === 0) {
                const newToken = response.data.data.access_token;
                this.setToken(newToken);
                return newToken;
            }
            else {
                throw new Error(`Token生成失败: ${response.data.msg || '未知错误'}`);
            }
        }
        catch (error) {
            throw new Error(`Token生成请求失败: ${error.message}`);
        }
    }
    /**
     * 设置Token
     */
    setToken(token) {
        this.token = token;
        this.tokenExpiry = Date.now() + this.TOKEN_BUFFER_SECONDS * 1000;
    }
    /**
     * 检查Token是否过期
     */
    isTokenExpired() {
        return Date.now() >= this.tokenExpiry;
    }
    /**
     * 刷新Token
     */
    async refreshToken() {
        if (this.token) {
            try {
                await this.generateNewToken();
            }
            catch (error) {
                console.warn('Token刷新失败:', error.message);
                // 不抛出错误，允许使用现有Token继续尝试
            }
        }
    }
    /**
     * 获取Bearer认证头
     */
    getAuthHeader() {
        const token = this.token ? this.token : '';
        return {
            Authorization: `Bearer ${token}`
        };
    }
    /**
     * 清除Token
     */
    clearToken() {
        this.token = null;
        this.tokenExpiry = 0;
    }
    /**
     * 检查是否已认证
     */
    isAuthenticated() {
        return this.token !== null && !this.isTokenExpired();
    }
}
exports.TokenManager = TokenManager;
//# sourceMappingURL=token-manager.js.map