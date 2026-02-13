import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseResponse, AuthConfig, ApiConfig } from '../types';
import { retry, delay } from '../utils';

/**
 * 天幕API HTTP客户端
 */
export class HttpClient {
  private axiosInstance: AxiosInstance;
  private config: AuthConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: AuthConfig & ApiConfig) {
    this.config = config;
    
    // 创建axios实例
    this.axiosInstance = axios.create({
      baseURL: config.baseURL || 'https://open-api.wondershare.cc',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-App-Key': config.app_key
      }
    });

    // 请求拦截器 - 自动添加token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // 确保有有效的token
        const token = await this.getValidToken();
        config.headers['Authorization'] = token;
        
        console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[Request Error]', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 日志记录
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<BaseResponse>) => {
        console.log(`[Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          code: response.data.code
        });
        return response;
      },
      (error) => {
        console.error('[Response Error]', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * 获取有效的访问token
   */
  private async getValidToken(): Promise<string> {
    // 如果token有效（有效期1小时，提前5分钟刷新）
    if (this.accessToken && Date.now() < this.tokenExpiry - 5 * 60 * 1000) {
      return this.accessToken;
    }

    // 获取新token
    try {
      const response = await axios.get(
        'https://open-api.wondershare.cc/v1/open/capacity/get/token',
        {
          params: {
            access_key: this.config.app_key,
            secret: this.config.app_secret
          }
        }
      );

      if (response.data.code === 0 && response.data.data?.access_token) {
        const token = response.data.data.access_token;
        this.accessToken = token;
        this.tokenExpiry = Date.now() + 60 * 60 * 1000; // 1小时有效期
        console.log('[Token] 获取token成功');
        return token;
      } else {
        throw new Error(`获取token失败: ${response.data.msg}`);
      }
    } catch (error) {
      // 如果获取token失败，回退到Basic认证
      console.warn('[Token] 获取token失败，使用Basic认证');
      return this.getBasicAuthHeader();
    }
  }

  /**
   * 生成Basic认证头（fallback）
   */
  private getBasicAuthHeader(): string {
    const credentials = Buffer.from(`${this.config.app_key}:${this.config.app_secret}`).toString('base64');
    return `Basic ${credentials}`;
  }

  /**
   * 发送GET请求
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const maxRetries = 3;
    
    return retry(async () => {
      const response = await this.axiosInstance.get<BaseResponse<T>>(url, config);
      
      if (response.data.code !== 0) {
        throw new Error(`API Error: ${response.data.msg} (Code: ${response.data.code})`);
      }
      
      return response.data.data as T;
    }, maxRetries);
  }

  /**
   * 发送POST请求
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const maxRetries = 3;
    
    return retry(async () => {
      const response = await this.axiosInstance.post<BaseResponse<T>>(url, data, config);
      
      if (response.data.code !== 0) {
        throw new Error(`API Error: ${response.data.msg} (Code: ${response.data.code})`);
      }
      
      return response.data.data as T;
    }, maxRetries);
  }

  /**
   * 轮询任务状态
   * @param task_id 任务ID
   * @param maxAttempts 最大尝试次数，默认40次（约2分钟）
   * @param intervalMs 轮询间隔毫秒，默认3000ms
   */
  async pollTaskStatus(
    task_id: string,
    maxAttempts: number = 40,
    intervalMs: number = 3000
  ): Promise<any> {
    console.log(`开始轮询任务: ${task_id}`);
    
    const statusMap: Record<number, string> = {
      1: '排队中',
      2: '处理中', 
      3: '成功',
      4: '失败',
      5: '已取消',
      6: '超时'
    };
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // 直接使用axios发请求，避免post方法的错误检查
        const response = await this.axiosInstance.post('/v1/open/pub/task', { task_id });
        const result = response.data.data;
        
        // 检查响应是否有数据
        if (!result) {
          // 如果API返回错误但可能只是暂时的，继续等待
          if (attempt < maxAttempts - 1) {
            await delay(intervalMs);
            continue;
          }
          throw new Error('无法获取任务状态');
        }
        
        const status = result.status;
        const statusText = statusMap[status] || `未知(${status})`;
        const progress = result.progress || 0;
        
        // 只在状态变化或进度更新时输出日志
        if (status === 3 || status >= 4 || progress > 0 || attempt === 0) {
          console.log(`[${attempt + 1}/${maxAttempts}] ${statusText} | 进度:${progress}%`);
        }
        
        // status: 1-排队中 2-处理中 3-处理成功 4-处理失败 5-已关闭 6-已超时
        if (status === 3) {
          console.log(`✅ 任务完成: ${task_id}`);
          // 解析结果
          if (result.result && typeof result.result === 'string') {
            try {
              return JSON.parse(result.result);
            } catch {
              return result.result;
            }
          }
          return result.result || {};
        } else if (status === 4) {
          throw new Error(`任务失败: ${result.reason || '未知错误'}`);
        } else if (status === 5) {
          throw new Error(`任务已取消`);
        } else if (status === 6) {
          throw new Error(`任务超时`);
        }
        
        // 如果任务还在进行中，等待后继续检查
        await delay(intervalMs);
        
      } catch (error) {
        // 如果是我们的错误（任务失败等），直接抛出
        if (error instanceof Error && error.message.includes('任务')) {
          throw error;
        }
        
        // 网络错误等，等待后重试
        if (attempt < maxAttempts - 1) {
          await delay(intervalMs);
          continue;
        }
        throw error;
      }
    }
    
    throw new Error(`任务轮询超时: ${task_id}`);
  }

  /**
   * 上传文件
   */
  async uploadFile(file: Buffer | string, fileName: string): Promise<string> {
    // 简化实现，实际使用中需要根据具体环境实现
    throw new Error('uploadFile功能需要根据具体运行环境实现');
  }

  /**
   * 获取axios实例（用于自定义配置）
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}