import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { TianmuClient } from '../client/tianmu-client';
import { ClientConfig } from '../types';

/**
 * 天幕MCP服务器
 */
export class TianmuMCPServer {
  private server: Server;
  private client: TianmuClient;

  constructor(config: ClientConfig) {
    this.client = new TianmuClient(config);
    
    this.server = new Server(
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

    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    // 列出可用工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getToolDefinitions(),
      };
    });

    // 调用工具
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'text_to_video':
            return await this.handleTextToVideo(args);
          case 'image_to_video':
            return await this.handleImageToVideo(args);
          case 'continue_video':
            return await this.handleContinueVideo(args);
          case 'frames_to_video':
            return await this.handleFramesToVideo(args);
          case 'text_to_music':
            return await this.handleTextToMusic(args);
          case 'text_to_sound_effect':
            return await this.handleTextToSoundEffect(args);
          case 'generate_video_soundtrack':
            return await this.handleGenerateVideoSoundtrack(args);
          case 'text_to_speech':
            return await this.handleTextToSpeech(args);
          case 'image_to_image':
            return await this.handleImageToImage(args);
          case 'redrawing_image':
            return await this.handleRedrawingImage(args);
          case 'text_to_image':
            return await this.handleTextToImage(args);
          case 'recognize_image':
            return await this.handleRecognizeImage(args);
          case 'get_task_status':
            return await this.handleGetTaskStatus(args);
          case 'wait_for_task':
            return await this.handleWaitForTask(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private getToolDefinitions(): Tool[] {
    return [
      // 视频工具
      {
        name: 'text_to_video',
        description: '文生视频：根据文字描述生成视频（默认5秒）',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: '视频描述文字，支持中英文，建议包含主体+动作+镜头',
            },
            duration: {
              type: 'number',
              description: '视频时长，5-60秒，默认5秒',
            },
            resolution: {
              type: 'string',
              enum: ['720p', '1080p'],
              description: '视频分辨率，默认720p',
            },
            aspect_ratio: {
              type: 'string',
              enum: ['16:9', '9:16', '4:3', '3:4', '1:1'],
              description: '视频宽高比，默认16:9',
            },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'image_to_video',
        description: '图生视频：根据图片生成动态视频',
        inputSchema: {
          type: 'object',
          properties: {
            image_url: {
              type: 'string',
              description: '输入图片URL',
            },
            prompt: {
              type: 'string',
              description: '视频描述文字',
            },
            resolution: {
              type: 'string',
              enum: ['720p', '1080p'],
              description: '视频分辨率，默认720p',
            },
            aspect_ratio: {
              type: 'string',
              enum: ['16:9', '9:16', '4:3', '3:4', '1:1'],
              description: '视频宽高比，默认16:9',
            },
            camera_move_index: {
              type: 'number',
              description: '运镜控制类型，1-46之间',
            },
          },
          required: ['image_url'],
        },
      },
      {
        name: 'continue_video',
        description: '视频续写：延长现有视频',
        inputSchema: {
          type: 'object',
          properties: {
            video_url: {
              type: 'string',
              description: '输入视频URL',
            },
            prompt: {
              type: 'string',
              description: '续写描述文字',
            },
            duration: {
              type: 'number',
              description: '续写时长，默认5秒',
            },
          },
          required: ['video_url'],
        },
      },
      {
        name: 'frames_to_video',
        description: '首尾帧生视频：根据起始帧和结束帧生成视频',
        inputSchema: {
          type: 'object',
          properties: {
            start_frame_url: {
              type: 'string',
              description: '起始帧图片URL',
            },
            end_frame_url: {
              type: 'string',
              description: '结束帧图片URL（可选）',
            },
            prompt: {
              type: 'string',
              description: '视频描述文字',
            },
            resolution: {
              type: 'string',
              enum: ['720p', '1080p'],
              description: '视频分辨率，默认720p',
            },
            aspect_ratio: {
              type: 'string',
              enum: ['16:9', '9:16', '4:3', '3:4', '1:1'],
              description: '视频宽高比，默认16:9',
            },
          },
          required: ['start_frame_url'],
        },
      },
      // 音频工具
      {
        name: 'text_to_music',
        description: '文生音乐：根据文字描述生成音乐',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: '音乐描述文字',
            },
            duration: {
              type: 'number',
              description: '音乐时长，默认10秒',
            },
            style: {
              type: 'string',
              description: '音乐风格',
            },
            mood: {
              type: 'string',
              description: '音乐情绪',
            },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'text_to_sound_effect',
        description: '文生音效：根据文字描述生成音效',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: '音效描述文字',
            },
            duration: {
              type: 'number',
              description: '音效时长，默认3秒',
            },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'generate_video_soundtrack',
        description: '视频配乐：为视频生成背景音乐',
        inputSchema: {
          type: 'object',
          properties: {
            video_url: {
              type: 'string',
              description: '视频URL',
            },
            style: {
              type: 'string',
              description: '配乐风格',
            },
            mood: {
              type: 'string',
              description: '配乐情绪',
            },
          },
          required: ['video_url'],
        },
      },
      {
        name: 'text_to_speech',
        description: '文字转语音：将文字转换为语音',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: '要转换的文字',
            },
            voice_id: {
              type: 'string',
              description: '音色ID，可选: GEN_ZH_F_001~007(女声), GEN_ZH_M_001~006(男声), CHAR_ZH_M_001~002(角色)',
            },
            speed: {
              type: 'number',
              description: '语速，0.5-2.0，默认1.0',
            },
            pitch: {
              type: 'number',
              description: '音调，-12到12，默认0',
            },
            volume: {
              type: 'number',
              description: '音量，-60到0，默认-10',
            },
            emotion: {
              type: 'string',
              description: '情绪，可选: Happy, Sad, Surprise, Neutral, Angry，默认Neutral',
            },
          },
          required: ['text'],
        },
      },
      // 图像工具
      {
        name: 'text_to_image',
        description: '文生图：根据文字描述生成图片',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: '图片描述文字，支持中英文',
            },
            negative_prompt: {
              type: 'string',
              description: '反向提示词，描述不希望出现的内容',
            },
            width: {
              type: 'number',
              description: '图片宽度，默认1024',
            },
            height: {
              type: 'number',
              description: '图片高度，默认1024',
            },
            style: {
              type: 'string',
              description: '图片风格，如写实、动漫、油画等',
            },
            seed: {
              type: 'number',
              description: '随机种子，用于固定生成结果',
            },
            steps: {
              type: 'number',
              description: '生成步数，默认20，数值越高质量越好但耗时越长',
            },
            cfg_scale: {
              type: 'number',
              description: '指导强度，默认7.0，控制AI对提示词的遵循程度',
            },
            sampler: {
              type: 'string',
              description: '采样器类型，如euler、euler_a、ddim等',
            },
            batch_size: {
              type: 'number',
              description: '批量生成数量，默认1，最大4',
            },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'image_to_image',
        description: '参考生图：根据参考图片和文字描述生成新图片',
        inputSchema: {
          type: 'object',
          properties: {
            reference_image_url: {
              type: 'string',
              description: '参考图片URL',
            },
            prompt: {
              type: 'string',
              description: '图片描述文字',
            },
            strength: {
              type: 'number',
              description: '参考强度，0-1，默认0.8',
            },
            style: {
              type: 'string',
              description: '图片风格',
            },
          },
          required: ['reference_image_url', 'prompt'],
        },
      },
      {
        name: 'redrawing_image',
        description: '图片重绘：对图片进行局部或整体重绘',
        inputSchema: {
          type: 'object',
          properties: {
            image_url: {
              type: 'string',
              description: '输入图片URL',
            },
            mask_url: {
              type: 'string',
              description: '重绘遮罩图URL（可选）',
            },
            prompt: {
              type: 'string',
              description: '重绘描述文字',
            },
            strength: {
              type: 'number',
              description: '重绘强度，0-1，默认0.8',
            },
          },
          required: ['image_url', 'prompt'],
        },
      },
      {
        name: 'recognize_image',
        description: '图像识别：识别图片中的内容',
        inputSchema: {
          type: 'object',
          properties: {
            image_url: {
              type: 'string',
              description: '图片URL',
            },
            recognition_type: {
              type: 'string',
              enum: ['object', 'scene', 'text', 'all'],
              description: '识别类型，默认all',
            },
          },
          required: ['image_url'],
        },
      },
      // 工具方法
      {
        name: 'get_task_status',
        description: '获取任务状态',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: {
              type: 'string',
              description: '任务ID',
            },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'wait_for_task',
        description: '等待任务完成并返回结果（图片约30秒，视频约60秒）',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: {
              type: 'string',
              description: '任务ID',
            },
            max_attempts: {
              type: 'number',
              description: '最大等待次数，默认40次（约2分钟）',
            },
            interval_ms: {
              type: 'number',
              description: '检查间隔毫秒数，默认3000ms',
            },
          },
          required: ['task_id'],
        },
      },
    ];
  }

  // 工具处理方法将在下一个文件中实现
  private async handleTextToVideo(args: any) {
    const result = await this.client.textToVideo(args);
    return {
      content: [
        {
          type: 'text',
          text: `文生视频任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleImageToVideo(args: any) {
    const result = await this.client.imageToVideo(args);
    return {
      content: [
        {
          type: 'text',
          text: `图生视频任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleContinueVideo(args: any) {
    const result = await this.client.continueVideo(args);
    return {
      content: [
        {
          type: 'text',
          text: `视频续写任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleFramesToVideo(args: any) {
    const result = await this.client.framesToVideo(args);
    return {
      content: [
        {
          type: 'text',
          text: `首尾帧生视频任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleTextToMusic(args: any) {
    const result = await this.client.textToMusic(args);
    return {
      content: [
        {
          type: 'text',
          text: `文生音乐任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleTextToSoundEffect(args: any) {
    const result = await this.client.textToSoundEffect(args);
    return {
      content: [
        {
          type: 'text',
          text: `文生音效任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleGenerateVideoSoundtrack(args: any) {
    const result = await this.client.generateVideoSoundtrack(args);
    return {
      content: [
        {
          type: 'text',
          text: `视频配乐任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleTextToSpeech(args: any) {
    const result = await this.client.textToSpeech(args);
    return {
      content: [
        {
          type: 'text',
          text: `文字转语音任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleTextToImage(args: any) {
    const result = await this.client.textToImage(args);
    return {
      content: [
        {
          type: 'text',
          text: `文生图任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleImageToImage(args: any) {
    const result = await this.client.imageToImage(args);
    return {
      content: [
        {
          type: 'text',
          text: `参考生图任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleRedrawingImage(args: any) {
    const result = await this.client.redrawingImage(args);
    return {
      content: [
        {
          type: 'text',
          text: `图片重绘任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleRecognizeImage(args: any) {
    const result = await this.client.recognizeImage(args);
    return {
      content: [
        {
          type: 'text',
          text: `图像识别任务已创建，任务ID: ${result.task_id}`,
        },
      ],
    };
  }

  private async handleGetTaskStatus(args: any) {
    const result = await this.client.getTaskStatus(args.task_id);
    return {
      content: [
        {
          type: 'text',
          text: `任务状态: ${JSON.stringify(result, null, 2)}`,
        },
      ],
    };
  }

  private async handleWaitForTask(args: any) {
    const { task_id, max_attempts, interval_ms } = args;
    
    try {
      const result = await this.client.waitForTaskCompletion(
        task_id,
        max_attempts || 40,  // 默认40次
        interval_ms || 3000   // 默认3秒
      );
      
      // 格式化输出
      let outputText = '✅ 任务完成!\n\n';
      
      if (result.images_path && result.images_path.length > 0) {
        outputText += '📷 图片URL:\n';
        result.images_path.forEach((url: string, i: number) => {
          outputText += `${i + 1}. ${url}\n`;
        });
      } else if (result.video_path && result.video_path.length > 0) {
        outputText += '🎬 视频URL:\n';
        result.video_path.forEach((url: string, i: number) => {
          outputText += `${i + 1}. ${url}\n`;
        });
      } else if (result.audio_path) {
        outputText += `🔊 语音URL: ${result.audio_path}\n`;
      } else {
        outputText += '结果:\n' + JSON.stringify(result, null, 2);
      }
      
      return {
        content: [
          {
            type: 'text',
            text: outputText,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `❌ 任务失败: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * 启动MCP服务器
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('天幕MCP服务器已启动');
  }

  /**
   * 停止MCP服务器
   */
  async stop(): Promise<void> {
    await this.server.close();
  }
}