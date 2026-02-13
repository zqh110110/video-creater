
/**
 * 修复后的Token管理器
 */
export class FixedTokenManager {
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private readonly TOKEN_BUFFER_SECONDS = 300;

  constructor(
    private appKey: string,
    private appSecret: string,
    private tokenEndpoint: string = 'https://open-api.wondershare.cc/v1/open/capacity/application/tob_text2video_b'
  ) {}

  /**
   * 获取有效的Token - 同步版本
   */
  getValidToken(): string {
    if (this.token && !this.isTokenExpired()) {
      return this.token;
    }
    
    // 如果没有有效token，返回空字符串而不是尝试异步生成
    console.warn('⚠️ 没有有效Token，需要先生成Token');
    return '';
  }

  /**
   * 生成新的访问Token - 同步版本
   */
  generateNewTokenSync(): string {
    try {
      const response = require('axios').post(
        this.tokenEndpoint,
        {},
        {
          headers: {
            'X-App-Key': this.appKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.code === 0) {
        const newToken = response.data.data.access_token;
        this.setToken(newToken);
        return newToken;
      } else {
        throw new Error(`Token生成失败: ${response.data.msg || '未知错误'}`);
      }
    } catch (error) {
      throw new Error(`Token生成请求失败: ${(error as Error).message}`);
    }
  }

  /**
   * 设置Token
   */
  private setToken(token: string): void {
    this.token = token;
    this.tokenExpiry = Date.now() + this.TOKEN_BUFFER_SECONDS * 1000;
    console.log(`✅ Token已设置: ${token.substring(0, 10)}...`);
  }

  /**
   * 检查Token是否过期
   */
  private isTokenExpired(): boolean {
    return Date.now() >= this.tokenExpiry;
  }

  /**
   * 获取Bearer认证头
   */
  getAuthHeader(): { Authorization: string } {
    const token = this.getValidToken();
    return {
      Authorization: token ? `Bearer ${token}` : ''
    };
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return this.token !== null && !this.isTokenExpired();
  }

  /**
   * 手动设置Token - 用于测试
   */
  setTokenManually(token: string): void {
    this.setToken(token);
  }
}
  