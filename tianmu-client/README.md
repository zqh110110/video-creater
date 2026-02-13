# 天幕API客户端和MCP服务器

一个功能完整的万兴天幕API客户端和MCP（Model Context Protocol）服务器实现，支持天幕平台的所有AI功能。

## 功能特性

### 🎥 视频大模型
- **文生视频**: 根据文字描述生成高质量视频
- **图生视频**: 将静态图片转换为动态视频
- **视频续写**: 延长现有视频内容
- **首尾帧生视频**: 根据起始帧和结束帧生成过渡视频

### 🎵 音频大模型
- **文生音乐**: 根据描述生成背景音乐
- **文生音效**: 生成各种音效
- **视频配乐**: 为视频自动生成匹配的背景音乐
- **文字转语音**: 将文字转换为自然语音

### 🖼️ 图像大模型
- **文生图**: 根据文字描述生成高质量图片
- **参考生图**: 根据参考图片生成新图片
- **图片重绘**: 对图片进行局部或整体重绘
- **图像识别**: 识别图片中的内容

### 🔧 MCP服务器功能
- 完整的MCP工具定义
- 自动任务状态管理
- 错误处理和重试机制
- 标准化工具接口

## 安装

```bash
npm install tianmu-client
```

或者克隆本项目：

```bash
git clone <repository-url>
cd tianmu-client
npm install
npm run build
```

## 快速开始

### 1. 获取API凭证

1. 访问 [天幕创作引擎](https://www.tomoviee.cn/developers.html)
2. 创建应用并获取 `app_key` 和 `app_secret`

### 2. 环境变量配置

创建 `.env` 文件：

```env
TIANMU_APP_KEY=your_app_key_here
TIANMU_APP_SECRET=your_app_secret_here
TIANMU_BASE_URL=https://open-api.wondershare.cc
TIANMU_TIMEOUT=30000
```

### 3. 基础使用

#### 直接使用客户端

```typescript
import { createTianmuClient } from 'tianmu-client';

// 创建客户端
const client = createTianmuClient({
  app_key: 'your_app_key',
  app_secret: 'your_app_secret'
});

// 文生视频
async function generateVideo() {
  try {
    const result = await client.textToVideo({
      prompt: '一只小猫在花园里玩耍，阳光明媚',
      resolution: '720p',
      aspect_ratio: '16:9',
      camera_move_index: 9 // 静态镜头
    });

    console.log('任务ID:', result.task_id);

    // 等待任务完成
    const finalResult = await client.waitForTaskCompletion(result.task_id);
    console.log('视频生成完成:', finalResult);

  } catch (error) {
    console.error('生成失败:', error);
  }
}

// 文生图
async function generateImage() {
  try {
    const result = await client.textToImage({
      prompt: '一只可爱的小猫在花园里玩耍，阳光明媚，写实风格，高清细节',
      negative_prompt: '模糊，低质量，变形，丑陋',
      width: 1024,
      height: 1024,
      style: 'realistic',
      steps: 25,
      cfg_scale: 8.0,
      sampler: 'euler',
    });

    console.log('图片生成任务ID:', result.task_id);

    // 等待任务完成
    const finalResult = await client.waitForTaskCompletion(result.task_id);
    console.log('图片生成完成:', finalResult);

  } catch (error) {
    console.error('图片生成失败:', error);
  }
}

// 调用示例
generateVideo();
generateImage();
```

#### 使用MCP服务器

1. 启动MCP服务器：

```bash
# 设置环境变量
export TIANMU_APP_KEY=your_app_key
export TIANMU_APP_SECRET=your_app_secret

# 启动服务器
npm run mcp
```

2. 在Claude Desktop等支持MCP的工具中配置：

```json
{
  "mcpServers": {
    "tianmu": {
      "command": "node",
      "args": ["dist/server.js"],
      "env": {
        "TIANMU_APP_KEY": "your_app_key",
        "TIANMU_APP_SECRET": "your_app_secret"
      }
    }
  }
}
```

3. 在AI助手中使用：

```
请生成一个关于"夕阳下的海滩"的5秒视频
```

## API文档

### 视频生成

#### 文生视频

```typescript
const result = await client.textToVideo({
  prompt: string,                    // 必需：视频描述
  resolution?: '720p' | '1080p',    // 可选：分辨率，默认720p
  aspect_ratio?: '16:9' | '9:16' | '4:3' | '3:4' | '1:1', // 可选：宽高比，默认16:9
  camera_move_index?: number,       // 可选：运镜类型，1-46
  callback?: string,                // 可选：回调地址
  params?: string                    // 可选：透传参数
});
```

#### 图生视频

```typescript
const result = await client.imageToVideo({
  image_url: string,                // 必需：图片URL
  prompt?: string,                   // 可选：视频描述
  resolution?: '720p' | '1080p',    // 可选：分辨率
  aspect_ratio?: string,            // 可选：宽高比
  camera_move_index?: number        // 可选：运镜类型
});
```

### 音频生成

#### 文生音乐

```typescript
const result = await client.textToMusic({
  prompt: string,                    // 必需：音乐描述
  duration?: number,                 // 可选：时长，默认10秒
  style?: string,                    // 可选：音乐风格
  mood?: string                      // 可选：音乐情绪
});
```

#### 文字转语音

```typescript
const result = await client.textToSpeech({
  text: string,                      // 必需：要转换的文字
  voice_id?: string,                 // 可选：音色ID
  speed?: number,                    // 可选：语速 0.5-2.0
  pitch?: number,                    // 可选：音调 0.5-2.0
  volume?: number                    // 可选：音量 0.5-2.0
});
```

### 图像处理

#### 文生图

```typescript
const result = await client.textToImage({
  prompt: string,                    // 必需：图片描述文字，支持中英文
  negative_prompt?: string,           // 可选：反向提示词，描述不希望出现的内容
  width?: number,                    // 可选：图片宽度，默认1024
  height?: number,                   // 可选：图片高度，默认1024
  style?: string,                    // 可选：图片风格，如写实、动漫、油画等
  seed?: number,                     // 可选：随机种子，用于固定生成结果
  steps?: number,                    // 可选：生成步数，默认20，数值越高质量越好但耗时越长
  cfg_scale?: number,                // 可选：指导强度，默认7.0，控制AI对提示词的遵循程度
  sampler?: string,                  // 可选：采样器类型，如euler、euler_a、ddim等
  batch_size?: number                // 可选：批量生成数量，默认1，最大4
});
```

#### 参考生图

```typescript
const result = await client.imageToImage({
  reference_image_url: string,        // 必需：参考图片URL
  prompt: string,                    // 必需：图片描述
  strength?: number,                 // 可选：参考强度 0-1
  style?: string                     // 可选：图片风格
});
```

### 任务管理

#### 获取任务状态

```typescript
const status = await client.getTaskStatus('task_id');
console.log(status);
// {
//   task_id: 'xxx',
//   status: 'completed',
//   result: { video_url: 'xxx' }
// }
```

#### 等待任务完成

```typescript
const result = await client.waitForTaskCompletion(
  'task_id',        // 任务ID
  60,               // 最大尝试次数，默认60
  5000              // 检查间隔毫秒数，默认5000
);
```

## 进阶功能

### 批量处理

```typescript
const tasks = [
  () => client.textToVideo({ prompt: '视频1' }),
  () => client.textToVideo({ prompt: '视频2' }),
  () => client.textToVideo({ prompt: '视频3' })
];

const results = await client.batchProcess(tasks, {
  concurrent: 2,                      // 并发数，默认3
  pollInterval: 3000,                 // 轮询间隔，默认2000ms
  onProgress: (completed, total) => { // 进度回调
    console.log(`进度: ${completed}/${total}`);
  }
});

console.log('批量处理结果:', results);
```

### 错误处理

```typescript
import { TianmuClient, ApiError } from 'tianmu-client';

try {
  const result = await client.textToVideo(options);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API错误:', error.message);
    console.error('错误码:', error.code);
  } else {
    console.error('未知错误:', error);
  }
}
```

### 自定义配置

```typescript
const client = new TianmuClient({
  app_key: 'your_app_key',
  app_secret: 'your_app_secret',
  api: {
    baseURL: 'https://custom-api.example.com',
    timeout: 60000,
    retry: 5
  }
});
```

## 运镜控制参考

| 索引 | 运镜类型 | 描述 |
|------|----------|------|
| 1 | orbit | 环绕 |
| 2 | spin | 旋转 |
| 3 | pan left | 左摇 |
| 4 | pan right | 右摇 |
| 5 | tilt up | 上摇 |
| 6 | tilt down | 下摇 |
| 7 | push in | 推近 |
| 8 | pull out | 拉远 |
| 9 | static | 静态 |
| 10 | tracking | 跟踪 |

更多运镜类型请参考天幕官方文档。

## 开发和测试

### 安装依赖

```bash
npm install
```

### 运行测试

```bash
npm test
```

### 构建项目

```bash
npm run build
```

### 运行示例

```bash
npm run dev
```

## 项目结构

```
tianmu-client/
├── src/
│   ├── client/           # 客户端实现
│   │   ├── http-client.ts    # HTTP客户端
│   │   └── tianmu-client.ts  # 天幕API客户端
│   ├── mcp/              # MCP服务器
│   │   └── server.ts         # MCP服务器实现
│   ├── types/            # 类型定义
│   │   └── index.ts          # 通用类型
│   ├── utils/            # 工具函数
│   │   └── index.ts          # 通用工具
│   ├── index.ts          # 入口文件
│   └── server.ts         # MCP服务器启动脚本
├── tests/                # 测试文件
├── docs/                 # 文档
├── examples/             # 示例代码
└── dist/                 # 构建输出
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 支持

如有问题，请：
1. 查看 [天幕官方文档](https://www.tomoviee.cn/doc/)
2. 提交 [Issue](https://github.com/your-repo/issues)
3. 联系开发团队

## 更新日志

### v1.0.0
- 初始版本发布
- 支持所有天幕API功能
- 完整的MCP服务器实现
- TypeScript类型支持
- 完善的错误处理和重试机制