/**
 * Token管理器 - 处理天幕API的Token-Based认证
 */
export declare class TokenManager {
    private appKey;
    private appSecret;
    private tokenEndpoint;
    private token;
    private tokenExpiry;
    private readonly TOKEN_BUFFER_SECONDS;
    constructor(appKey: string, appSecret: string, tokenEndpoint?: string);
    /**
     * 获取有效的Token
     */
    getValidToken(): Promise<string>;
    /**
     * 生成新的访问Token
     */
    private generateNewToken;
    /**
     * 设置Token
     */
    private setToken;
    /**
     * 检查Token是否过期
     */
    private isTokenExpired;
    /**
     * 刷新Token
     */
    refreshToken(): Promise<void>;
    /**
     * 获取Bearer认证头
     */
    getAuthHeader(): {
        Authorization: string;
    };
    /**
     * 清除Token
     */
    clearToken(): void;
    /**
     * 检查是否已认证
     */
    isAuthenticated(): boolean;
}
//# sourceMappingURL=token-manager.d.ts.map