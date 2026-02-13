/**
 * 修复后的Token管理器
 */
export declare class FixedTokenManager {
    private appKey;
    private appSecret;
    private tokenEndpoint;
    private token;
    private tokenExpiry;
    private readonly TOKEN_BUFFER_SECONDS;
    constructor(appKey: string, appSecret: string, tokenEndpoint?: string);
    /**
     * 获取有效的Token - 同步版本
     */
    getValidToken(): string;
    /**
     * 生成新的访问Token - 同步版本
     */
    generateNewTokenSync(): string;
    /**
     * 设置Token
     */
    private setToken;
    /**
     * 检查Token是否过期
     */
    private isTokenExpired;
    /**
     * 获取Bearer认证头
     */
    getAuthHeader(): {
        Authorization: string;
    };
    /**
     * 检查是否已认证
     */
    isAuthenticated(): boolean;
    /**
     * 手动设置Token - 用于测试
     */
    setTokenManually(token: string): void;
}
//# sourceMappingURL=fixed-token-manager.d.ts.map