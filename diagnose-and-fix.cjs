#!/usr/bin/env node

const fs = require('fs');

/**
 * 天幕API诊断和修复脚本
 */

// 测试不同的认证方式
async function testAuthenticationMethods() {
  console.log('🔍 诊断认证问题...');
  
  const axios = require('axios');
  const config = {
    app_key: '93dc75fe9be26c8a0530dad18b498087',
    app_secret: '545377213f382142231a74fc108c0495'
  };
  
  const methods = [
    {
      name: 'Basic Auth (Original URL)',
      url: 'https://open-api.wondershare.cc/v1/open/capacity/application/tm_text2video_b',
      auth: {
        'X-App-Key': config.app_key,
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${config.app_key}:${config.app_secret}`).toString('base64')
      }
    },
    {
      name: 'Token Auth Test',
      url: 'https://open-api.wondershare.cc/v1/open/capacity/application/tob_text2video_b',
      auth: {
        'X-App-Key': config.app_key,
        'Content-Type': 'application/json'
      },
      isTokenGeneration: true
    },
    {
      name: 'Basic Auth (AI URL)',
      url: 'https://ai-api-eus.300624.com/v1/ai/capacity/application/tm_text2video',
      auth: {
        'X-App-Key': config.app_key,
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${config.app_key}:${config.app_secret}`).toString('base64')
      }
    },
    {
      name: 'Direct Token Request',
      url: 'https://open-api.wondershare.cc/v1/open/capacity/application/auth',
      auth: {
        'X-App-Key': config.app_key,
        'Content-Type': 'application/json'
      },
      method: 'GET'
    }
  ];
  
  for (const method of methods) {
    try {
      console.log(`\n🧪 测试: ${method.name}`);
      console.log(`URL: ${method.url}`);
      
      let response;
      if (method.isTokenGeneration) {
        response = await axios.post(method.url, {}, {
          headers: method.auth
        });
        console.log('Token生成响应:', response.data);
        
        if (response.data.code === 0 && response.data.data.access_token) {
          console.log('✅ Token生成成功，使用Token测试API...');
          const token = response.data.data.access_token;
          
          const apiResponse = await axios.post(
            'https://ai-api-eus.300624.com/v1/ai/capacity/application/tm_text2video',
            {
              prompt: 'Token认证测试',
              duration: 5
            },
            {
              headers: {
                'X-App-Key': config.app_key,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log('Token认证API响应:', apiResponse.data);
        }
      } else {
        response = await axios.post(method.url, 
          { prompt: '测试视频', duration: 5 }, 
          { headers: method.auth }
        );
        console.log('API响应:', response.data);
      }
      
    } catch (error) {
      console.error(`${method.name} 失败:`, error.response?.data || error.message);
    }
  }
}

// 修复Token管理器
async function createFixedTokenManager() {
  console.log('\n🔧 创建修复后的Token管理器...');
  
  const fs = require('fs');
  
  const fixedTokenManager = `
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
        throw new Error(\`Token生成失败: \${response.data.msg || '未知错误'}\`);
      }
    } catch (error) {
      throw new Error(\`Token生成请求失败: \${(error as Error).message}\`);
    }
  }

  /**
   * 设置Token
   */
  private setToken(token: string): void {
    this.token = token;
    this.tokenExpiry = Date.now() + this.TOKEN_BUFFER_SECONDS * 1000;
    console.log(\`✅ Token已设置: \${token.substring(0, 10)}...\`);
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
      Authorization: token ? \`Bearer \${token}\` : ''
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
  `;
  
  fs.writeFileSync('./tianmu-client/src/auth/fixed-token-manager.ts', fixedTokenManager);
  console.log('✅ 修复后的Token管理器已创建');
  
  return true;
}

// 修复HTTP客户端
async function createFixedHttpClient() {
  console.log('\n🔧 创建修复后的HTTP客户端...');
  
  const fixedHttpClient = `
/**
 * 修复后的HTTP客户端
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseResponse, AuthConfig, ApiConfig } from '../types';
import { FixedTokenManager } from '../auth/fixed-token-manager';
import { retry, delay } from '../utils';

export class FixedHttpClient {
  private axiosInstance: AxiosInstance;
  private config: AuthConfig;
  private tokenManager: FixedTokenManager;

  constructor(config: AuthConfig & ApiConfig) {
    this.config = config;
    this.tokenManager = new FixedTokenManager(config.app_key, config.app_secret);
    
    // 创建axios实例
    this.axiosInstance = axios.create({
      baseURL: config.baseURL || 'https://open-api.wondershare.cc',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-App-Key': config.app_key
      }
    });

    // 请求拦截器 - 修复后的版本
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 获取认证头 - 同步方式
        const authHeader = this.tokenManager.getAuthHeader();
        
        // 合并认证头
        const headers = {
          ...config.headers,
          ...authHeader
        };
        
        console.log(\`[Request] \${config.method?.toUpperCase()} \${config.url}\`, {
          data: config.data,
          headers: headers
        });
        return { ...config, headers };
      },
      (error) => {
        console.error('[Request Error]', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 修复后的版本
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<BaseResponse>) => {
        console.log(\`[Response] \${response.config.method?.toUpperCase()} \${response.config.url}\`, {
          status: response.status,
          data: response.data
        });
        return response;
      },
      (error) => {
        console.error('[Response Error]', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // ... 其他方法保持不变
}
  `;
  
  fs.writeFileSync('./tianmu-client/src/client/fixed-http-client.ts', fixedHttpClient);
  console.log('✅ 修复后的HTTP客户端已创建');
  
  return true;
}

// 创建测试用的客户端
async function createTestClient() {
  console.log('\n🧪 创建测试客户端...');
  
  const testClientCode = `
/**
 * 测试用的TianmuClient
 */
import { FixedHttpClient } from '../client/fixed-http-client';
import { FixedTokenManager } from '../auth/fixed-token-manager';
import {
  VideoGenerationOptions,
  TextToImageOptions,
  TextToMusicOptions,
  TaskResponse,
  TaskStatusResponse,
  ClientConfig
} from '../types';
import { validateRequiredFields } from '../utils';

export class TestTianmuClient {
  private http: FixedHttpClient;
  private tokenManager: FixedTokenManager;

  constructor(config: ClientConfig) {
    this.tokenManager = new FixedTokenManager(config.app_key, config.app_secret);
    this.http = new FixedHttpClient(config);
  }

  /**
   * 手动设置Token用于测试
   */
  setAuthToken(token: string): void {
    this.tokenManager.setTokenManually(token);
  }

  /**
   * 测试文生视频
   */
  async testTextToVideo(options: VideoGenerationOptions): Promise<TaskResponse> {
    validateRequiredFields(options, ['prompt']);
    
    const payload = {
      prompt: options.prompt,
      duration: options.duration || 5,
      resolution: options.resolution || '720p',
      aspect_ratio: options.aspect_ratio || '16:9',
      camera_move_index: options.camera_move_index,
      callback: options.callback,
      params: options.params
    };

    return this.http.post<TaskResponse>(
      '/v1/ai/capacity/application/tm_text2video',
      payload
    );
  }
}
  `;
  
  fs.writeFileSync('./tianmu-client/src/client/test-tianmu-client.ts', testClientCode);
  console.log('✅ 测试客户端已创建');
  
  return true;
}

// 主函数
async function runDiagnosticsAndFixes() {
  console.log('🚀 天幕API诊断和修复开始...');
  console.log('='.repeat(80));
  
  // 步骤1: 诊断认证问题
  await testAuthenticationMethods();
  
  // 步骤2: 创建修复后的组件
  await createFixedTokenManager();
  await createFixedHttpClient();
  await createTestClient();
  
  // 步骤3: 重新构建
  console.log('\n🔨 重新构建项目...');
  const { exec } = require('child_process');
  
  return new Promise((resolve, reject) => {
    exec('cd tianmu-client && npm run build', (error, stdout, stderr) => {
      if (error) {
        console.error('构建失败:', error);
        reject(error);
      } else {
        console.log('✅ 构建成功');
        console.log(stdout);
        resolve({ success: true });
      }
    });
  });
}

// 执行诊断和修复
if (require.main === module) {
  runDiagnosticsAndFixes().then(() => {
    console.log('\n🎯 诊断和修复完成！');
    console.log('\n📋 下一步操作:');
    console.log('1. cd tianmu-client');
    console.log('2. const { TestTianmuClient } = require(\'./dist/client/test-tianmu-client.js\');');
    console.log('3. const client = new TestTianmuClient({ app_key: "your_key", app_secret: "your_secret" });');
    console.log('4. client.testTextToVideo({ prompt: \'测试\' })');
    console.log('\n🔧 或者启动修复后的MCP服务器:');
    console.log('export TIANMU_APP_KEY=your_key');
    console.log('export TIANMU_APP_SECRET=your_secret');
    console.log('npm run mcp');
  }).catch(error => {
    console.error('诊断和修复失败:', error);
    process.exit(1);
  });
}

module.exports = { runDiagnosticsAndFixes };