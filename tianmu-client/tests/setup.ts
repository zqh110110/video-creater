// Jest测试环境设置文件
import { config } from 'dotenv';

// 加载测试环境变量
config({ path: '.env.test' });

// 设置测试超时
jest.setTimeout(30000);

// Mock console方法以避免测试输出污染
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};