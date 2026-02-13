export { HttpClient } from './client/http-client';
import { TianmuClient } from './client/tianmu-client';
export { TianmuClient } from './client/tianmu-client';

// 导出所有类型
export * from './types';

// 导出工具函数
export * from './utils';

// 便捷的客户端创建函数
export function createTianmuClient(config: {
  app_key: string;
  app_secret: string;
  baseURL?: string;
  timeout?: number;
}) {
  return new TianmuClient(config);
}

// 默认导出客户端类
export default TianmuClient;