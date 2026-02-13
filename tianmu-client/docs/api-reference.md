# 天幕API客户端参考文档

## 目录

- [快速开始](#快速开始)
- [客户端配置](#客户端配置)
- [视频API](#视频api)
- [音频API](#音频api)
- [图像API](#图像api)
- [任务管理](#任务管理)
- [错误处理](#错误处理)
- [类型定义](#类型定义)

## 快速开始

```typescript
import { createTianmuClient } from 'tianmu-client';

const client = createTianmuClient({
  app_key: 'your_app_key',
  app_secret: 'your_app_secret'
});

// 第一个视频生成
const result = await client.textToVideo({
  prompt: '一只小猫在花园里玩耍'
});
```

## 客户端配置

### TianmuClient

构造函数创建一个天幕API客户端实例。

```typescript
import { TianmuClient, ClientConfig } from 'tianmu-client';

const config: ClientConfig = {
  app_key: string,        // 必需：应用密钥
  app_secret: string,     // 必需：应用秘钥
  api?: {
    baseURL?: string,      // 可选：API基础URL，默认 'https://open-api.wondershare.cc'
    timeout?: number,      // 可选：请求超时时间(ms)，默认 30000
    retry?: number        // 可选：重试次数，默认 3
  }
};

const client = new TianmuClient(config);
```

### 便捷函数

```typescript
// 使用便捷函数创建客户端
const client = createTianmuClient({
  app_key: 'your_app_key',
  app_secret: 'your_app_secret'
});
```

## 视频API

### textToVideo - 文生视频

根据文字描述生成视频。

```typescript
async textToVideo(options: VideoGenerationOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| prompt | string | ✅ | - | 视频描述文字，支持中英文，建议包含主体+动作+镜头 |
| duration | number | ❌ | 5 | 视频时长（秒），目前只支持5 |
| resolution | string | ❌ | '720p' | 视频分辨率，支持 '720p', '1080p' |
| aspect_ratio | string | ❌ | '16:9' | 视频宽高比，支持 '16:9', '9:16', '4:3', '3:4', '1:1' |
| camera_move_index | number | ❌ | - | 运镜控制类型，1-46之间 |
| callback | string | ❌ | - | 回调地址 |
| params | string | ❌ | - | 透传参数 |

#### 返回值

```typescript
interface TaskResponse {
  task_id: string;
}
```

#### 示例

```typescript
const result = await client.textToVideo({
  prompt: '一只橘黄色的小猫在向日葵花田中欢快奔跑，阳光明媚',
  resolution: '720p',
  aspect_ratio: '16:9',
  camera_move_index: 9  // 静态镜头
});

console.log('任务ID:', result.task_id);
```

### imageToVideo - 图生视频

将静态图片转换为动态视频。

```typescript
async imageToVideo(options: ImageToVideoOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| image_url | string | ✅ | - | 输入图片URL |
| prompt | string | ❌ | - | 视频描述文字 |
| duration | number | ❌ | 5 | 视频时长（秒） |
| resolution | string | ❌ | '720p' | 视频分辨率 |
| aspect_ratio | string | ❌ | '16:9' | 视频宽高比 |
| camera_move_index | number | ❌ | - | 运镜控制类型 |

#### 示例

```typescript
const result = await client.imageToVideo({
  image_url: 'https://example.com/image.jpg',
  prompt: '让图片中的人物动起来',
  resolution: '720p',
  aspect_ratio: '1:1'
});
```

### continueVideo - 视频续写

延长现有视频内容。

```typescript
async continueVideo(options: VideoContinuationOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| video_url | string | ✅ | - | 输入视频URL |
| prompt | string | ❌ | - | 续写描述文字 |
| duration | number | ❌ | 5 | 续写时长（秒） |
| callback | string | ❌ | - | 回调地址 |
| params | string | ❌ | - | 透传参数 |

### framesToVideo - 首尾帧生视频

根据起始帧和结束帧生成视频。

```typescript
async framesToVideo(options: FrameToVideoOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| start_frame_url | string | ✅ | - | 起始帧图片URL |
| end_frame_url | string | ❌ | - | 结束帧图片URL |
| prompt | string | ❌ | - | 视频描述文字 |
| duration | number | ❌ | 5 | 视频时长（秒） |
| resolution | string | ❌ | '720p' | 视频分辨率 |
| aspect_ratio | string | ❌ | '16:9' | 视频宽高比 |

## 音频API

### textToMusic - 文生音乐

根据文字描述生成音乐。

```typescript
async textToMusic(options: TextToMusicOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| prompt | string | ✅ | - | 音乐描述文字 |
| duration | number | ❌ | 10 | 音乐时长（秒） |
| style | string | ❌ | - | 音乐风格 |
| mood | string | ❌ | - | 音乐情绪 |
| callback | string | ❌ | - | 回调地址 |
| params | string | ❌ | - | 透传参数 |

#### 示例

```typescript
const result = await client.textToMusic({
  prompt: '轻快的钢琴曲，适合早晨聆听',
  duration: 15,
  style: 'classical',
  mood: 'happy'
});
```

### textToSoundEffect - 文生音效

根据文字描述生成音效。

```typescript
async textToSoundEffect(options: TextToSoundEffectOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| prompt | string | ✅ | - | 音效描述文字 |
| duration | number | ❌ | 3 | 音效时长（秒） |
| callback | string | ❌ | - | 回调地址 |
| params | string | ❌ | - | 透传参数 |

### generateVideoSoundtrack - 视频配乐

为视频生成背景音乐。

```typescript
async generateVideoSoundtrack(options: VideoSoundtrackOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| video_url | string | ✅ | - | 视频URL |
| style | string | ❌ | - | 配乐风格 |
| mood | string | ❌ | - | 配乐情绪 |
| callback | string | ❌ | - | 回调地址 |
| params | string | ❌ | - | 透传参数 |

### textToSpeech - 文字转语音

将文字转换为语音。

```typescript
async textToSpeech(options: TextToSpeechOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| text | string | ✅ | - | 要转换的文字 |
| voice_id | string | ❌ | - | 音色ID |
| speed | number | ❌ | 1.0 | 语速，范围 0.5-2.0 |
| pitch | number | ❌ | 1.0 | 音调，范围 0.5-2.0 |
| volume | number | ❌ | 1.0 | 音量，范围 0.5-2.0 |
| callback | string | ❌ | - | 回调地址 |
| params | string | ❌ | - | 透传参数 |

#### 示例

```typescript
const result = await client.textToSpeech({
  text: '你好，欢迎使用天幕创作引擎！',
  voice_id: 'female_01',
  speed: 1.2,
  pitch: 0.9
});
```

## 图像API

### textToImage - 文生图

根据文字描述生成图片。

```typescript
async textToImage(options: TextToImageOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| prompt | string | ✅ | - | 图片描述文字，支持中英文 |
| negative_prompt | string | ❌ | - | 反向提示词，描述不希望出现的内容 |
| width | number | ❌ | 1024 | 图片宽度 |
| height | number | ❌ | 1024 | 图片高度 |
| style | string | ❌ | - | 图片风格，如写实、动漫、油画等 |
| seed | number | ❌ | - | 随机种子，用于固定生成结果 |
| steps | number | ❌ | 20 | 生成步数，数值越高质量越好但耗时越长 |
| cfg_scale | number | ❌ | 7.0 | 指导强度，控制AI对提示词的遵循程度 |
| sampler | string | ❌ | - | 采样器类型，如euler、euler_a、ddim等 |
| batch_size | number | ❌ | 1 | 批量生成数量，最大4 |
| callback | string | ❌ | - | 回调地址 |
| params | string | ❌ | - | 透传参数 |

#### 示例

```typescript
const result = await client.textToImage({
  prompt: '一只可爱的小猫在花园里玩耍，阳光明媚，写实风格，高清细节',
  negative_prompt: '模糊，低质量，变形，丑陋',
  width: 1024,
  height: 1024,
  style: 'realistic',
  steps: 25,
  cfg_scale: 8.0,
  sampler: 'euler',
  batch_size: 1,
});

console.log('任务ID:', result.task_id);
```

### imageToImage - 参考生图

根据参考图片生成新图片。

```typescript
async imageToImage(options: ImageToImageOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| reference_image_url | string | ✅ | - | 参考图片URL |
| prompt | string | ✅ | - | 图片描述文字 |
| strength | number | ❌ | 0.8 | 参考强度，范围 0-1 |
| style | string | ❌ | - | 图片风格 |
| callback | string | ❌ | - | 回调地址 |
| params | string | ❌ | - | 透传参数 |

### redrawingImage - 图片重绘

对图片进行局部或整体重绘。

```typescript
async redrawingImage(options: ImageRedrawingOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| image_url | string | ✅ | - | 输入图片URL |
| mask_url | string | ❌ | - | 重绘遮罩图URL |
| prompt | string | ✅ | - | 重绘描述文字 |
| strength | number | ❌ | 0.8 | 重绘强度，范围 0-1 |
| callback | string | ❌ | - | 回调地址 |
| params | string | ❌ | - | 透传参数 |

### recognizeImage - 图像识别

识别图片中的内容。

```typescript
async recognizeImage(options: ImageRecognitionOptions): Promise<TaskResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| image_url | string | ✅ | - | 图片URL |
| recognition_type | string | ❌ | 'all' | 识别类型：'object', 'scene', 'text', 'all' |
| callback | string | ❌ | - | 回调地址 |
| params | string | ❌ | - | 透传参数 |

## 任务管理

### getTaskStatus - 获取任务状态

查询任务的当前状态。

```typescript
async getTaskStatus(task_id: string): Promise<TaskStatusResponse>
```

#### 参数

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| task_id | string | ✅ | 任务ID |

#### 返回值

```typescript
interface TaskStatusResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;        // 任务完成时的结果
  error?: string;      // 任务失败时的错误信息
  progress?: number;   // 任务进度（0-100）
}
```

#### 示例

```typescript
const status = await client.getTaskStatus('task_id_123');
console.log(`任务状态: ${status.status}`);
if (status.status === 'completed') {
  console.log('结果:', status.result);
}
```

### waitForTaskCompletion - 等待任务完成

轮询任务直到完成并返回结果。

```typescript
async waitForTaskCompletion(
  task_id: string,
  maxAttempts?: number,    // 最大尝试次数，默认 60
  intervalMs?: number     // 检查间隔毫秒数，默认 5000
): Promise<any>
```

#### 示例

```typescript
const result = await client.waitForTaskCompletion('task_id_123', 30, 3000);
console.log('任务完成:', result);
```

### batchProcess - 批量处理

并发处理多个任务。

```typescript
async batchProcess<T>(
  tasks: Array<() => Promise<TaskResponse>>,
  options?: {
    concurrent?: number;           // 并发数，默认 3
    pollInterval?: number;        // 轮询间隔，默认 2000ms
    onProgress?: (completed: number, total: number) => void;
  }
): Promise<Array<{ task_id: string; result?: T; error?: string }>>
```

#### 示例

```typescript
const tasks = [
  () => client.textToVideo({ prompt: '视频1' }),
  () => client.textToVideo({ prompt: '视频2' }),
  () => client.textToVideo({ prompt: '视频3' })
];

const results = await client.batchProcess(tasks, {
  concurrent: 2,
  onProgress: (completed, total) => {
    console.log(`进度: ${completed}/${total}`);
  }
});
```

### uploadFile - 上传文件

上传文件到天幕服务器。

```typescript
async uploadFile(file: Buffer | string, fileName: string): Promise<string>
```

#### 参数

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| file | Buffer | string | ✅ | 文件内容或文件路径 |
| fileName | string | ✅ | 文件名 |

#### 返回值

返回文件的访问URL。

## 错误处理

### 错误类型

```typescript
// API错误
class ApiError extends Error {
  code: number;
  message: string;
}

// 验证错误
class ValidationError extends Error {
  field: string;
  message: string;
}

// 网络错误
class NetworkError extends Error {
  message: string;
  originalError?: Error;
}
```

### 错误处理示例

```typescript
try {
  const result = await client.textToVideo(options);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('参数验证失败:', error.field, error.message);
  } else if (error instanceof ApiError) {
    console.error('API调用失败:', error.code, error.message);
  } else if (error instanceof NetworkError) {
    console.error('网络错误:', error.message);
  } else {
    console.error('未知错误:', error);
  }
}
```

## 类型定义

### 基础类型

```typescript
// 任务响应
interface TaskResponse {
  task_id: string;
}

// 任务状态响应
interface TaskStatusResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  progress?: number;
}

// 客户端配置
interface ClientConfig {
  app_key: string;
  app_secret: string;
  api?: {
    baseURL?: string;
    timeout?: number;
    retry?: number;
  };
}
```

### 视频相关类型

```typescript
interface VideoGenerationOptions {
  prompt: string;
  duration?: number;
  resolution?: '720p' | '1080p';
  aspect_ratio?: '16:9' | '9:16' | '4:3' | '3:4' | '1:1';
  camera_move_index?: number;
  callback?: string;
  params?: string;
}

interface ImageToVideoOptions {
  image_url: string;
  prompt?: string;
  duration?: number;
  resolution?: '720p' | '1080p';
  aspect_ratio?: '16:9' | '9:16' | '4:3' | '3:4' | '1:1';
  camera_move_index?: number;
  callback?: string;
  params?: string;
}
```

### 音频相关类型

```typescript
interface TextToMusicOptions {
  prompt: string;
  duration?: number;
  style?: string;
  mood?: string;
  callback?: string;
  params?: string;
}

interface TextToSpeechOptions {
  text: string;
  voice_id?: string;
  speed?: number;    // 0.5-2.0
  pitch?: number;    // 0.5-2.0
  volume?: number;   // 0.5-2.0
  callback?: string;
  params?: string;
}
```

### 图像相关类型

```typescript
interface TextToImageOptions {
  prompt: string;
  negative_prompt?: string;
  width?: number;     // 默认 1024
  height?: number;    // 默认 1024
  style?: string;
  seed?: number;
  steps?: number;     // 默认 20
  cfg_scale?: number; // 默认 7.0
  sampler?: string;
  batch_size?: number; // 默认 1
  callback?: string;
  params?: string;
}

interface ImageToImageOptions {
  reference_image_url: string;
  prompt: string;
  strength?: number;  // 0-1
  style?: string;
  callback?: string;
  params?: string;
}

interface ImageRecognitionOptions {
  image_url: string;
  recognition_type?: 'object' | 'scene' | 'text' | 'all';
  callback?: string;
  params?: string;
}
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
| 11 | others | 其他 |
| 12 | object pov | 物体视角 |
| 13 | super dolly in | 超级推近 |
| 14 | super dolly out | 超级拉远 |
| 15 | snorricam | 斯诺里相机 |
| 16 | head tracking | 头部跟踪 |
| 17 | car grip | 车载拍摄 |
| 18 | screen transition | 屏幕转场 |
| 19 | car chasing | 追车拍摄 |
| 20 | fisheye | 鱼眼镜头 |
| 21 | FPV drone | 第一人称无人机 |
| 22 | crane over the head | 起重机过顶 |
| 23 | timelapse landscape | 延时风景 |
| 24 | dolly in | 滑轨推近 |
| 25 | dolly out | 滑轨拉远 |
| 26 | zoom in | 变焦推近 |
| 27 | zoom out | 变焦拉远 |
| 28 | full shot | 全景镜头 |
| 29 | close-up shot | 近景镜头 |
| 30 | extreme close-up | 极近特写 |
| 31 | Macro shot | 微距镜头 |
| 32 | bird's-eye view | 鸟瞰视角 |
| 33 | rule of thirds | 三分法则构图 |
| 34 | symmetrical composition | 对称构图 |
| 35 | handheld | 手持拍摄 |
| 36 | FPV shot | 第一人称镜头 |
| 37 | jib up | 摇臂上升 |
| 38 | jib down | 摇臂下降 |
| 39 | full shot | 全景镜头 |
| 40 | Time lapse shot | 延时镜头 |
| 41 | aerial shot | 航拍镜头 |
| 42 | low angle shot | 低角度镜头 |
| 43 | Eye-level shot | 平视镜头 |
| 44 | diagonal composition | 对角线构图 |
| 45 | over shoulder shot | 过肩镜头 |
| 46 | crane down | 起重机下降 |

这个参考文档提供了天幕API客户端的完整使用指南，涵盖了所有功能、参数和使用示例。