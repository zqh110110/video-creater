import { VideoGenerationOptions, ImageToVideoOptions, VideoContinuationOptions, FrameToVideoOptions, TextToMusicOptions, TextToSoundEffectOptions, VideoSoundtrackOptions, TextToSpeechOptions, TextToImageOptions, ImageToImageOptions, ImageRedrawingOptions, ImageRecognitionOptions, TaskResponse, TaskStatusResponse, ClientConfig } from '../types';
/**
 * 天幕API客户端
 */
export declare class TianmuClient {
    private http;
    constructor(config: ClientConfig);
    /**
     * 文生视频
     */
    textToVideo(options: VideoGenerationOptions): Promise<TaskResponse>;
    /**
     * 图生视频
     */
    imageToVideo(options: ImageToVideoOptions): Promise<TaskResponse>;
    /**
     * 视频续写
     */
    continueVideo(options: VideoContinuationOptions): Promise<TaskResponse>;
    /**
     * 首尾帧生视频
     */
    framesToVideo(options: FrameToVideoOptions): Promise<TaskResponse>;
    /**
     * 文生音乐
     */
    textToMusic(options: TextToMusicOptions): Promise<TaskResponse>;
    /**
     * 文生音效
     */
    textToSoundEffect(options: TextToSoundEffectOptions): Promise<TaskResponse>;
    /**
     * 视频配乐
     */
    generateVideoSoundtrack(options: VideoSoundtrackOptions): Promise<TaskResponse>;
    /**
     * 文字转语音
     */
    textToSpeech(options: TextToSpeechOptions): Promise<TaskResponse>;
    /**
     * 文生图/参考生图
     * 天幕API使用参考生图模式实现图像生成
     */
    textToImage(options: TextToImageOptions): Promise<TaskResponse>;
    /**
     * 参考生图
     */
    imageToImage(options: ImageToImageOptions): Promise<TaskResponse>;
    /**
     * 图片重绘
     */
    redrawingImage(options: ImageRedrawingOptions): Promise<TaskResponse>;
    /**
     * 图像识别
     */
    recognizeImage(options: ImageRecognitionOptions): Promise<TaskResponse>;
    /**
     * 获取任务状态
     */
    getTaskStatus(task_id: string): Promise<TaskStatusResponse>;
    /**
     * 轮询任务直到完成
     */
    waitForTaskCompletion(task_id: string, maxAttempts?: number, intervalMs?: number): Promise<any>;
    /**
     * 上传文件
     */
    uploadFile(file: Buffer | string, fileName: string): Promise<string>;
    /**
     * 批量处理任务
     */
    batchProcess<T>(tasks: Array<() => Promise<TaskResponse>>, options?: {
        concurrent?: number;
        pollInterval?: number;
        onProgress?: (completed: number, total: number) => void;
    }): Promise<Array<{
        task_id: string;
        result?: T;
        error?: string;
    }>>;
}
//# sourceMappingURL=tianmu-client.d.ts.map