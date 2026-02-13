/**
 * 天幕API通用类型定义
 */
export interface BaseResponse<T = any> {
    code: number;
    msg: string;
    data?: T;
}
export interface TaskResponse {
    task_id: string;
}
export interface TaskStatusResponse {
    task_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: any;
    error?: string;
    progress?: number;
}
export interface AuthConfig {
    app_key: string;
    app_secret: string;
}
export interface ApiConfig {
    baseURL?: string;
    timeout?: number;
    retry?: number;
}
export interface ClientConfig extends AuthConfig {
    api?: ApiConfig;
    useTokenAuth?: boolean;
    tokenEndpoint?: string;
}
export interface RequestOptions {
    callback?: string;
    params?: string;
    timeout?: number;
}
export interface VideoGenerationOptions extends RequestOptions {
    prompt: string;
    duration?: number;
    resolution?: '720p' | '1080p';
    aspect_ratio?: '16:9' | '9:16' | '4:3' | '3:4' | '1:1';
    camera_move_index?: number;
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
export interface TextToMusicOptions extends RequestOptions {
    prompt: string;
    duration?: number;
    style?: string;
    mood?: string;
}
export interface TextToSoundEffectOptions extends RequestOptions {
    prompt: string;
    duration?: number;
}
export interface VideoSoundtrackOptions extends RequestOptions {
    video_url: string;
    style?: string;
    mood?: string;
}
export interface TextToSpeechOptions extends RequestOptions {
    text: string;
    voice_id?: string;
    speed?: number;
    pitch?: number;
    volume?: number;
    emotion?: string;
}
export interface TextToImageOptions extends RequestOptions {
    prompt: string;
    negative_prompt?: string;
    width?: number;
    height?: number;
    style?: string;
    seed?: number;
    steps?: number;
    cfg_scale?: number;
    sampler?: string;
    batch_size?: number;
    reference_image?: string;
    control_intensity?: number;
    control_type?: string;
}
export interface ImageToImageOptions extends RequestOptions {
    prompt: string;
    width?: number;
    height?: number;
    batch_size?: number;
    control_intensity?: number;
    control_type?: string;
    init_image?: string;
    reference_image: string;
    strength?: number;
    style?: string;
}
export interface ImageRedrawingOptions extends RequestOptions {
    image_url: string;
    mask_url?: string;
    prompt: string;
    strength?: number;
}
export interface ImageRecognitionOptions extends RequestOptions {
    image_url: string;
    recognition_type?: 'object' | 'scene' | 'text' | 'all';
}
//# sourceMappingURL=index.d.ts.map