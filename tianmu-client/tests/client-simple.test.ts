import { TianmuClient } from '../src/client/tianmu-client';

// 创建简化的mock来避免类型问题
const mockPost = jest.fn();
const mockGet = jest.fn();
const mockCreate = jest.fn(() => ({
  post: mockPost,
  get: mockGet,
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
}));

// Mock axios
jest.mock('axios', () => mockCreate);

describe('TianmuClient - Simplified', () => {
  let client: TianmuClient;
  const mockConfig = {
    app_key: 'test_app_key',
    app_secret: 'test_app_secret',
    baseURL: 'https://test-api.example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPost.mockClear();
    mockGet.mockClear();
    client = new TianmuClient(mockConfig);
  });

  describe('构造函数', () => {
    it('应该正确初始化客户端', () => {
      expect(client).toBeInstanceOf(TianmuClient);
      expect(mockCreate).toHaveBeenCalledWith({
        baseURL: 'https://test-api.example.com',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': 'test_app_key',
          'Authorization': expect.any(String), // Basic token
        },
      });
    });
  });

  describe('文生视频', () => {
    it('应该能够发送文生视频请求', async () => {
      const mockResponse = {
        data: {
          code: 0,
          msg: '',
          data: { task_id: 'test_task_id_123' },
        },
      };

      mockPost.mockResolvedValue(mockResponse);

      const result = await client.textToVideo({
        prompt: '一只小猫在花园里玩耍',
        resolution: '720p',
        aspect_ratio: '16:9',
      });

      expect(result.task_id).toBe('test_task_id_123');
      expect(mockPost).toHaveBeenCalledWith(
        '/v1/open/capacity/application/tm_text2video_b',
        {
          prompt: '一只小猫在花园里玩耍',
          duration: 5,
          resolution: '720p',
          aspect_ratio: '16:9',
          camera_move_index: undefined,
          callback: undefined,
          params: undefined,
        }
      );
    });

    it('应该抛出错误当缺少必需参数时', async () => {
      await expect(
        client.textToVideo({} as any)
      ).rejects.toThrow('Missing required fields: prompt');
    });
  });

  describe('获取任务状态', () => {
    it('应该能够查询任务状态', async () => {
      const mockResponse = {
        data: {
          code: 0,
          msg: '',
          data: { 
            task_id: 'test_task_123',
            status: 'completed',
            result: { video_url: 'https://example.com/video.mp4' }
          },
        },
      };

      mockGet.mockResolvedValue(mockResponse);

      const result = await client.getTaskStatus('test_task_123');

      expect(result.status).toBe('completed');
      expect(mockGet).toHaveBeenCalledWith(
        '/v1/open/capacity/application/get_result',
        { params: { task_id: 'test_task_123' } }
      );
    });
  });
});