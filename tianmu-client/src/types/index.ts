/**
 * 天幕API通用类型定义
 */

// 基础响应类型
export interface BaseResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

// 任务响应类型
export interface TaskResponse {
  task_id: string;
}

// 任务状态响应类型
export interface TaskStatusResponse {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  progress?: number;
}

// 认证配置
export interface AuthConfig {
  app_key: string;
  app_secret: string;
}

// API配置
export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  retry?: number;
}

// 客户端配置
export interface ClientConfig extends AuthConfig {
  api?: ApiConfig;
  useTokenAuth?: boolean; // 新增：是否使用Token认证
  tokenEndpoint?: string; // 新增：Token生成端点
}

// 请求选项
export interface RequestOptions {
  callback?: string;
  params?: string;
  timeout?: number;
}

// 视频相关类型
export interface VideoGenerationOptions extends RequestOptions {
  prompt: string;
  duration?: number; // 秒，目前只支持5
  resolution?: '720p' | '1080p';
  aspect_ratio?: '16:9' | '9:16' | '4:3' | '3:4' | '1:1';
  camera_move_index?: number; // 运镜控制类型
}

export interface ImageToVideoOptions extends RequestOptions {
  image_url: string;
  prompt?: string;
  duration?: number;
  resolution?: '720p' | '1080p';
  aspect_ratio?: '16:9' | '9:16' | '4:3' | '3:4' | '1:1';
  camera_move_index?: number;
}

export interface VideoContinuationOptions extends RequestOptions {
  video_url: string;
  prompt?: string;
  duration?: number;
}

export interface FrameToVideoOptions extends RequestOptions {
  start_frame_url: string;
  end_frame_url?: string;
  prompt?: string;
  duration?: number;
  resolution?: '720p' | '1080p';
  aspect_ratio?: '16:9' | '9:16' | '4:3' | '3:4' | '1:1';
}

// 音频相关类型
export interface TextToMusicOptions extends RequestOptions {
  prompt: string;
  duration?: number; // 秒
  style?: string; // 音乐风格
  mood?: string; // 情绪
}

export interface TextToSoundEffectOptions extends RequestOptions {
  prompt: string;
  duration?: number; // 秒
}

export interface VideoSoundtrackOptions extends RequestOptions {
  video_url: string;
  style?: string; // 配乐风格
  mood?: string; // 情绪
}

export interface TextToSpeechOptions extends RequestOptions {
  text: string;
  voice_id?: string; // 音色ID (speaker_choice)
  speed?: number; // 语速 0.5-2.0
  pitch?: number; // 音调 -12 to 12
  volume?: number; // 音量 -60 to 0
  emotion?: string; // 情绪: Happy, Sad, Surprise, Neutral, Angry
}

// 图像相关类型
export interface TextToImageOptions extends RequestOptions {
  prompt: string;
  negative_prompt?: string; // 反向提示词
  width?: number; // 图片宽度，默认1024
  height?: number; // 图片高度，默认1024
  style?: string; // 图片风格
  seed?: number; // 随机种子
  steps?: number; // 生成步数，默认20
  cfg_scale?: number; // 指导强度，默认7.0
  sampler?: string; // 采样器类型
  batch_size?: number; // 批量生成数量，默认1
  // 参考生图相关参数（天幕API使用参考生图模式）
  reference_image?: string; // 参考图像URL
  control_intensity?: number; // 控制强度, 0-1
  control_type?: string; // 控制类型: 0-轮廓 1-姿态 2-角色 3-景深
}

export interface ImageToImageOptions extends RequestOptions {
  prompt: string;
  width?: number; // 生成图片的宽, 单位像素
  height?: number; // 生成图片的高, 单位像素
  batch_size?: number; // 生成图片数量，范围1-8
  control_intensity?: number; // 控制强度, 0-1，浮点数
  control_type?: string; // 输入控制类型，分别对应: 0 - 轮廓控制（边缘） 1 - 姿态控制 2 - 角色控制（主体） 3 - 景深控制
  init_image?: string; // 原图图像地址, 图像格式JPG/PNG, 这个是进行图像识别前的图片 control_type为 2 （主体控制的时候必传）
  reference_image: string; // 参考图像地址, 图像格式JPG/PNG, 输入给模型里的是进行图像识别后的图片
  strength?: number; // 参考强度 0-1 (保持向后兼容)
  style?: string; // 风格
}

export interface ImageRedrawingOptions extends RequestOptions {
  image_url: string;
  mask_url?: string; // 局部重绘的遮罩图
  prompt: string;
  strength?: number;
}

export interface ImageRecognitionOptions extends RequestOptions {
  image_url: string;
  recognition_type?: 'object' | 'scene' | 'text' | 'all';
}