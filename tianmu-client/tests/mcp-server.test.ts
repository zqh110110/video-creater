import { TianmuMCPServer } from '../src/mcp/server';

// Mock the MCP SDK
jest.mock('@modelcontextprotocol/sdk/server/index.js');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const mockServer = {
  setRequestHandler: jest.fn(),
  connect: jest.fn(),
  close: jest.fn(),
} as any;

(Server as jest.Mock).mockImplementation(() => mockServer);

describe('TianmuMCPServer', () => {
  let server: TianmuMCPServer;
  const mockConfig = {
    app_key: 'test_app_key',
    app_secret: 'test_app_secret',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    server = new TianmuMCPServer(mockConfig);
  });

  describe('构造函数', () => {
    it('应该正确初始化MCP服务器', () => {
      expect(Server).toHaveBeenCalledWith(
        {
          name: 'tianmu-mcp-server',
          version: '1.0.0',
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );
    });

    it('应该设置工具处理器', () => {
      expect(mockServer.setRequestHandler).toHaveBeenCalledTimes(2); // ListTools 和 CallTool
    });
  });

  describe('工具定义', () => {
    let toolsList: any[];

    beforeEach(() => {
      // 获取传递给 setRequestHandler 的回调
      const listToolsHandler = mockServer.setRequestHandler.mock.calls[0][1];
      toolsList = listToolsHandler();
    });

    it('应该包含所有视频生成工具', () => {
      const videoToolNames = toolsList.tools.map((tool: any) => tool.name);
      
      expect(videoToolNames).toContain('text_to_video');
      expect(videoToolNames).toContain('image_to_video');
      expect(videoToolNames).toContain('continue_video');
      expect(videoToolNames).toContain('frames_to_video');
    });

    it('应该包含所有音频生成工具', () => {
      const audioToolNames = toolsList.tools.map((tool: any) => tool.name);
      
      expect(audioToolNames).toContain('text_to_music');
      expect(audioToolNames).toContain('text_to_sound_effect');
      expect(audioToolNames).toContain('generate_video_soundtrack');
      expect(audioToolNames).toContain('text_to_speech');
    });

    it('应该包含所有图像处理工具', () => {
      const imageToolNames = toolsList.tools.map((tool: any) => tool.name);
      
      expect(imageToolNames).toContain('text_to_image');
      expect(imageToolNames).toContain('image_to_image');
      expect(imageToolNames).toContain('redrawing_image');
      expect(imageToolNames).toContain('recognize_image');
    });

    it('应该包含工具方法', () => {
      const utilityToolNames = toolsList.tools.map((tool: any) => tool.name);
      
      expect(utilityToolNames).toContain('get_task_status');
      expect(utilityToolNames).toContain('wait_for_task');
    });

    it('工具定义应该包含必需的属性', () => {
      const textToVideoTool = toolsList.tools.find((tool: any) => tool.name === 'text_to_video');
      
      expect(textToVideoTool).toHaveProperty('name', 'text_to_video');
      expect(textToVideoTool).toHaveProperty('description');
      expect(textToVideoTool).toHaveProperty('inputSchema');
      expect(textToVideoTool.inputSchema).toHaveProperty('type', 'object');
      expect(textToVideoTool.inputSchema).toHaveProperty('properties');
      expect(textToVideoTool.inputSchema).toHaveProperty('required');
    });

    it('text_to_video工具应该有正确的必需参数', () => {
      const textToVideoTool = toolsList.tools.find((tool: any) => tool.name === 'text_to_video');
      
      expect(textToVideoTool.inputSchema.required).toContain('prompt');
      expect(textToVideoTool.inputSchema.properties.prompt).toHaveProperty('type', 'string');
      expect(textToVideoTool.inputSchema.properties.prompt).toHaveProperty('description');
    });

    it('text_to_image工具应该有正确的必需参数', () => {
      const textToImageTool = toolsList.tools.find((tool: any) => tool.name === 'text_to_image');
      
      expect(textToImageTool.inputSchema.required).toContain('prompt');
      expect(textToImageTool.inputSchema.properties.prompt).toHaveProperty('type', 'string');
      expect(textToImageTool.inputSchema.properties.prompt).toHaveProperty('description');
    });
  });

  describe('工具调用处理', () => {
    let mockClient: any;
    let callToolHandler: any;

    beforeEach(() => {
      // Mock client methods
      mockClient = {
        textToVideo: jest.fn().mockResolvedValue({ task_id: 'test_task_123' }),
        imageToVideo: jest.fn().mockResolvedValue({ task_id: 'test_task_456' }),
        textToImage: jest.fn().mockResolvedValue({ task_id: 'test_task_image' }),
        getTaskStatus: jest.fn().mockResolvedValue({
          task_id: 'test_task_123',
          status: 'completed',
        }),
      };

      // 替换服务器实例的client
      (server as any).client = mockClient;

      // 获取工具调用处理器
      const callToolCall = mockServer.setRequestHandler.mock.calls[1][1];
      callToolHandler = callToolCall;
    });

    it('应该正确处理文生视频工具调用', async () => {
      const request = {
        params: {
          name: 'text_to_video',
          arguments: {
            prompt: '测试视频生成',
            resolution: '720p',
          },
        },
      };

      const result = await callToolHandler(request);

      expect(mockClient.textToVideo).toHaveBeenCalledWith({
        prompt: '测试视频生成',
        resolution: '720p',
      });
      expect(result.content[0].text).toContain('文生视频任务已创建');
      expect(result.content[0].text).toContain('test_task_123');
    });

    it('应该正确处理文生图工具调用', async () => {
      const request = {
        params: {
          name: 'text_to_image',
          arguments: {
            prompt: '一只可爱的小猫在花园里玩耍',
            style: 'realistic',
            width: 1024,
            height: 1024,
          },
        },
      };

      const result = await callToolHandler(request);

      expect(mockClient.textToImage).toHaveBeenCalledWith({
        prompt: '一只可爱的小猫在花园里玩耍',
        style: 'realistic',
        width: 1024,
        height: 1024,
      });
      expect(result.content[0].text).toContain('文生图任务已创建');
    });

    it('应该正确处理获取任务状态工具调用', async () => {
      const request = {
        params: {
          name: 'get_task_status',
          arguments: {
            task_id: 'test_task_123',
          },
        },
      };

      const result = await callToolHandler(request);

      expect(mockClient.getTaskStatus).toHaveBeenCalledWith('test_task_123');
      expect(result.content[0].text).toContain('任务状态');
    });

    it('应该处理未知工具错误', async () => {
      const request = {
        params: {
          name: 'unknown_tool',
          arguments: {},
        },
      };

      const result = await callToolHandler(request);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error: Unknown tool: unknown_tool');
    });

    it('应该处理工具执行错误', async () => {
      mockClient.textToVideo.mockRejectedValue(new Error('API调用失败'));

      const request = {
        params: {
          name: 'text_to_video',
          arguments: {
            prompt: '测试视频生成',
          },
        },
      };

      const result = await callToolHandler(request);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error: API调用失败');
    });
  });

  describe('服务器生命周期', () => {
    it('应该能够启动服务器', async () => {
      const mockTransport = {} as any;
      (StdioServerTransport as jest.Mock).mockReturnValue(mockTransport);

      await server.start();

      expect(StdioServerTransport).toHaveBeenCalled();
      expect(mockServer.connect).toHaveBeenCalledWith(mockTransport);
    });

    it('应该能够停止服务器', async () => {
      await server.stop();
      expect(mockServer.close).toHaveBeenCalled();
    });
  });
});