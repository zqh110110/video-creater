import { TianmuClient } from '../src/client/tianmu-client';
import { generateBasicToken, generateTaskId } from '../src/utils';

// Mock axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TianmuClient - TextToImage', () => {
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

  describe('文生图', () => {
    it('应该能够发送文生图请求', async () => {
      const mockResponse = {
        data: {
          code: 0,
          msg: '',
          data: { task_id: 'test_task_id_image' },
        },
      };

      const mockInstance = mockedAxios.create(mockedAxios.create.mock.calls[0][0] as any);
      mockInstance.post.mockResolvedValue(mockResponse);

      const result = await client.textToImage({
        prompt: '一只可爱的小猫在花园里玩耍，阳光明媚，写实风格',
        negative_prompt: '模糊，低质量，变形',
        width: 1024,
        height: 1024,
        style: 'realistic',
        seed: 12345,
        steps: 25,
        cfg_scale: 8.0,
        sampler: 'euler',
        batch_size: 1,
      });

      expect(result.task_id).toBe('test_task_id_image');
      expect(mockInstance.post).toHaveBeenCalledWith(
        '/v1/open/capacity/application/tm_text2image_b',
        {
          prompt: '一只可爱的小猫在花园里玩耍，阳光明媚，写实风格',
          negative_prompt: '模糊，低质量，变形',
          width: 1024,
          height: 1024,
          style: 'realistic',
          seed: 12345,
          steps: 25,
          cfg_scale: 8.0,
          sampler: 'euler',
          batch_size: 1,
          callback: undefined,
          params: undefined,
        }
      );
    });

    it('应该使用默认参数当未提供可选参数时', async () => {
      const mockResponse = {
        data: {
          code: 0,
          msg: '',
          data: { task_id: 'test_task_id_defaults' },
        },
      };

      const mockInstance = mockedAxios.create(mockedAxios.create.mock.calls[0][0] as any);
      mockInstance.post.mockResolvedValue(mockResponse);

      const result = await client.textToImage({
        prompt: '简单的图片描述',
      });

      expect(result.task_id).toBe('test_task_id_defaults');
      expect(mockInstance.post).toHaveBeenCalledWith(
        '/v1/open/capacity/application/tm_text2image_b',
        {
          prompt: '简单的图片描述',
          negative_prompt: undefined,
          width: 1024,
          height: 1024,
          style: undefined,
          seed: undefined,
          steps: 20,
          cfg_scale: 7.0,
          sampler: undefined,
          batch_size: 1,
          callback: undefined,
          params: undefined,
        }
      );
    });

    it('应该抛出错误当缺少必需参数时', async () => {
      await expect(
        client.textToImage({} as any)
      ).rejects.toThrow('Missing required fields: prompt');
    });

    it('应该支持批量生成', async () => {
      const mockResponse = {
        data: {
          code: 0,
          msg: '',
          data: { task_id: 'test_task_id_batch' },
        },
      };

      const mockInstance = mockedAxios.create(mockedAxios.create.mock.calls[0][0] as any);
      mockInstance.post.mockResolvedValue(mockResponse);

      const result = await client.textToImage({
        prompt: '生成测试图片',
        batch_size: 4,
      });

      expect(result.task_id).toBe('test_task_id_batch');
      expect(mockInstance.post).toHaveBeenCalledWith(
        '/v1/open/capacity/application/tm_text2image_b',
        expect.objectContaining({
          prompt: '生成测试图片',
          batch_size: 4,
        })
      );
    });

    it('应该支持不同的采样器', async () => {
      const mockResponse = {
        data: {
          code: 0,
          msg: '',
          data: { task_id: 'test_task_id_sampler' },
        },
      };

      const mockInstance = mockedAxios.create(mockedAxios.create.mock.calls[0][0] as any);
      mockInstance.post.mockResolvedValue(mockResponse);

      const result = await client.textToImage({
        prompt: '测试采样器',
        sampler: 'ddim',
      });

      expect(result.task_id).toBe('test_task_id_sampler');
      expect(mockInstance.post).toHaveBeenCalledWith(
        '/v1/open/capacity/application/tm_text2image_b',
        expect.objectContaining({
          prompt: '测试采样器',
          sampler: 'ddim',
        })
      );
    });
  });

  describe('文生图参数验证', () => {
    const mockInstance = mockedAxios.create(mockedAxios.create.mock.calls[0][0] as any);
    
    beforeEach(() => {
      const mockResponse = {
        data: {
          code: 0,
          msg: '',
          data: { task_id: 'test_task_id' },
        },
      };
      mockInstance.post.mockResolvedValue(mockResponse);
    });

    it('应该支持不同的图片尺寸', async () => {
      await client.textToImage({
        prompt: '测试尺寸',
        width: 512,
        height: 768,
      });

      expect(mockInstance.post).toHaveBeenCalledWith(
        '/v1/open/capacity/application/tm_text2image_b',
        expect.objectContaining({
          width: 512,
          height: 768,
        })
      );
    });

    it('应该支持风格参数', async () => {
      await client.textToImage({
        prompt: '测试风格',
        style: 'anime',
      });

      expect(mockInstance.post).toHaveBeenCalledWith(
        '/v1/open/capacity/application/tm_text2image_b',
        expect.objectContaining({
          style: 'anime',
        })
      );
    });

    it('应该支持不同的步数和指导强度', async () => {
      await client.textToImage({
        prompt: '测试参数',
        steps: 30,
        cfg_scale: 9.5,
      });

      expect(mockInstance.post).toHaveBeenCalledWith(
        '/v1/open/capacity/application/tm_text2image_b',
        expect.objectContaining({
          steps: 30,
          cfg_scale: 9.5,
        })
      );
    });
  });
});