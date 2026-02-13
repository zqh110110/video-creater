/**
 * Token管理器 - 处理天幕API的Token-Based认证
 */
export class TokenManager {
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private readonly TOKEN_BUFFER_SECONDS = 300; // 5分钟缓冲时间

  constructor(
    private appKey: string,
    private appSecret: string,
    private tokenEndpoint: string = 'https://open-api.wondershare.cc/v1/open/capacity/application/tob_text2video_b'
  ) {}

  /**
   * 获取有效的Token
   */
  async getValidToken(): Promise<string> {
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
  private async generateNewToken(): Promise<string> {
    try {
      const axios = require('axios');
      
      // 调用Token生成接口
      const response = await axios.post(
        this.tokenEndpoint,
        {}, // 空body，只使用认证头
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
  }

  /**
   * 检查Token是否过期
   */
  private isTokenExpired(): boolean {
    return Date.now() >= this.tokenExpiry;
  }

  /**
   * 刷新Token
   */
  async refreshToken(): Promise<void> {
    if (this.token) {
      try {
        await this.generateNewToken();
      } catch (error) {
        console.warn('Token刷新失败:', (error as Error).message);
        // 不抛出错误，允许使用现有Token继续尝试
      }
    }
  }

  /**
   * 获取Bearer认证头
   */
  getAuthHeader(): { Authorization: string } {
    const token = this.token ? this.token : '';
    return {
      Authorization: `Bearer ${token}`
    };
  }

  /**
   * 清除Token
   */
  clearToken(): void {
    this.token = null;
    this.tokenExpiry = 0;
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return this.token !== null && !this.isTokenExpired();
  }
}