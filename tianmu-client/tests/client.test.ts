import { TianmuClient } from '../src/client/tianmu-client';
import { generateBasicToken, generateTaskId } from '../src/utils';

// Mock axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as any;

describe('TianmuClient', () => {
  let client: TianmuClient;
  const mockConfig = {
    app_key: 'test_app_key',
    app_secret: 'test_app_secret',
    baseURL: 'https://test-api.example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock axios instance
    const mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };
    
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    client = new TianmuClient(mockConfig);
  });

  describe('构造函数', () => {
    it('应该正确初始化客户端', () => {
      expect(client).toBeInstanceOf(TianmuClient);
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://test-api.example.com',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'X-App-Key': 'test_app_key',
          'Authorization': generateBasicToken('test_app_key', 'test_app_secret'),
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

      const mockInstance = mockedAxios.create(mockedAxios.create.mock.calls[0][0] as any);
      mockInstance.post.mockResolvedValue(mockResponse);

      const result = await client.textToVideo({
        prompt: '一只小猫在花园里玩耍',
        resolution: '720p',
        aspect_ratio: '16:9',
      });

      expect(result.task_id).toBe('test_task_id_123');
      expect(mockInstance.post).toHaveBeenCalledWith(
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

  describe('图生视频', () => {
    it('应该能够发送图生视频请求', async () => {
      const mockResponse = {
        data: {
          code: 0,
          msg: '',
          data: { task_id: 'test_task_id_456' },
        },
      };

      const mockInstance = mockedAxios.create(mockedAxios.create.mock.calls[0][0] as any);
      mockInstance.post.mockResolvedValue(mockResponse);

      const result = await client.imageToVideo({
        image_url: 'https://example.com/image.jpg',
        prompt: '让图片中的人物动起来',
      });

      expect(result.task_id).toBe('test_task_id_456');
      expect(mockInstance.post).toHaveBeenCalledWith(
        '/v1/open/capacity/application/tm_image2video_b',
        {
          image_url: 'https://example.com/image.jpg',
          prompt: '让图片中的人物动起来',
          duration: 5,
          resolution: '720p',
          aspect_ratio: '16:9',
          camera_move_index: undefined,
          callback: undefined,
          params: undefined,
        }
      );
    });

    it('应该抛出错误当缺少image_url时', async () => {
      await expect(
        client.imageToVideo({} as any)
      ).rejects.toThrow('Missing required fields: image_url');
    });
  });

  describe('文生音乐', () => {
    it('应该能够发送文生音乐请求', async () => {
      const mockResponse = {
        data: {
          code: 0,
          msg: '',
          data: { task_id: 'test_task_id_music' },
        },
      };

      const mockInstance = mockedAxios.create(mockedAxios.create.mock.calls[0][0] as any);
      mockInstance.post.mockResolvedValue(mockResponse);

      const result = await client.textToMusic({
        prompt: '轻快的钢琴曲',
        duration: 15,
        style: 'classical',
        mood: 'happy',
      });

      expect(result.task_id).toBe('test_task_id_music');
      expect(mockInstance.post).toHaveBeenCalledWith(
        '/v1/open/capacity/application/tm_text2music_b',
        {
          prompt: '轻快的钢琴曲',
          duration: 15,
          style: 'classical',
          mood: 'happy',
          callback: undefined,
          params: undefined,
        }
      );
    });
  });

  describe('文字转语音', () => {
    it('应该能够发送文字转语音请求', async () => {
      const mockResponse = {
        data: {
          code: 0,
          msg: '',
          data: { task_id: 'test_task_id_speech' },
        },
      };

      const mockInstance = mockedAxios.create(mockedAxios.create.mock.calls[0][0] as any);
      mockInstance.post.mockResolvedValue(mockResponse);

      const result = await client.textToSpeech({
        text: '你好，欢迎使用天幕API',
        voice_id: 'female_01',
        speed: 1.2,
        pitch: 0.9,
        volume: 1.1,
      });

      expect(result.task_id).toBe('test_task_id_speech');
      expect(mockInstance.post).toHaveBeenCalledWith(
        '/v1/open/capacity/application/tm_text2speech_b',
        {
          text: '你好，欢迎使用天幕API',
          voice_id: 'female_01',
          speed: 1.2,
          pitch: 0.9,
          volume: 1.1,
          callback: undefined,
          params: undefined,
        }
      );
    });
  });

  describe('获取任务状态', () => {
    it('应该能够获取任务状态', async () => {
      const mockResponse = {
        data: {
          code: 0,
          msg: '',
          data: {
            task_id: 'test_task_id',
            status: 'processing',
            progress: 45,
          },
        },
      };

      const mockInstance = mockedAxios.create(mockedAxios.create.mock.calls[0][0] as any);
      mockInstance.get.mockResolvedValue(mockResponse);

      const result = await client.getTaskStatus('test_task_id');

      expect(result.task_id).toBe('test_task_id');
      expect(result.status).toBe('processing');
      expect(result.progress).toBe(45);
      expect(mockInstance.get).toHaveBeenCalledWith(
        '/v1/open/capacity/application/get_result',
        { params: { task_id: 'test_task_id' } }
      );
    });
  });
});