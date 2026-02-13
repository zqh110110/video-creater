import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthConfig, ApiConfig } from '../types';
/**
 * 天幕API HTTP客户端
 */
export declare class HttpClient {
    private axiosInstance;
    private config;
    private accessToken;
    private tokenExpiry;
    constructor(config: AuthConfig & ApiConfig);
    /**
     * 获取有效的访问token
     */
    private getValidToken;
    /**
     * 生成Basic认证头（fallback）
     */
    private getBasicAuthHeader;
    /**
     * 发送GET请求
     */
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    /**
     * 发送POST请求
     */
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    /**
     * 轮询任务状态
     * @param task_id 任务ID
     * @param maxAttempts 最大尝试次数，默认40次（约2分钟）
     * @param intervalMs 轮询间隔毫秒，默认3000ms
     */
    pollTaskStatus(task_id: string, maxAttempts?: number, intervalMs?: number): Promise<any>;
    /**
     * 上传文件
     */
    uploadFile(file: Buffer | string, fileName: string): Promise<string>;
    /**
     * 获取axios实例（用于自定义配置）
     */
    getAxiosInstance(): AxiosInstance;
}
//# sourceMappingURL=http-client.d.ts.map