"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TianmuClient = void 0;
const http_client_1 = require("./http-client");
const utils_1 = require("../utils");
/**
 * 天幕API客户端
 */
class TianmuClient {
    constructor(config) {
        this.http = new http_client_1.HttpClient(config);
    }
    // ==================== 视频大模型 ====================
    /**
     * 文生视频
     */
    async textToVideo(options) {
        (0, utils_1.validateRequiredFields)(options, ['prompt']);
        const payload = {
            prompt: options.prompt,
            duration: options.duration || 5,
            resolution: options.resolution || '720p',
            aspect_ratio: options.aspect_ratio || '16:9',
            camera_move_index: options.camera_move_index,
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_text2video', payload);
    }
    /**
     * 图生视频
     */
    async imageToVideo(options) {
        (0, utils_1.validateRequiredFields)(options, ['image_url']);
        const payload = {
            image_url: options.image_url,
            prompt: options.prompt,
            duration: options.duration || 5,
            resolution: options.resolution || '720p',
            aspect_ratio: options.aspect_ratio || '16:9',
            camera_move_index: options.camera_move_index,
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_image2video', payload);
    }
    /**
     * 视频续写
     */
    async continueVideo(options) {
        (0, utils_1.validateRequiredFields)(options, ['video_url']);
        const payload = {
            video_url: options.video_url,
            prompt: options.prompt,
            duration: options.duration || 5,
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_video_continue', payload);
    }
    /**
     * 首尾帧生视频
     */
    async framesToVideo(options) {
        (0, utils_1.validateRequiredFields)(options, ['start_frame_url']);
        const payload = {
            start_frame_url: options.start_frame_url,
            end_frame_url: options.end_frame_url,
            prompt: options.prompt,
            duration: options.duration || 5,
            resolution: options.resolution || '720p',
            aspect_ratio: options.aspect_ratio || '16:9',
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_img2video', payload);
    }
    // ==================== 音频大模型 ====================
    /**
     * 文生音乐
     */
    async textToMusic(options) {
        (0, utils_1.validateRequiredFields)(options, ['prompt']);
        const payload = {
            prompt: options.prompt,
            duration: options.duration || 10,
            style: options.style,
            mood: options.mood,
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_text2music', payload);
    }
    /**
     * 文生音效
     */
    async textToSoundEffect(options) {
        (0, utils_1.validateRequiredFields)(options, ['prompt']);
        const payload = {
            prompt: options.prompt,
            duration: options.duration || 3,
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_text2sound_effect', payload);
    }
    /**
     * 视频配乐
     */
    async generateVideoSoundtrack(options) {
        (0, utils_1.validateRequiredFields)(options, ['video_url']);
        const payload = {
            video_url: options.video_url,
            style: options.style,
            mood: options.mood,
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_video_soundtrack', payload);
    }
    /**
     * 文字转语音
     */
    async textToSpeech(options) {
        (0, utils_1.validateRequiredFields)(options, ['text']);
        const payload = {
            text: options.text,
            voice_id: options.voice_id,
            speed: options.speed || 1.0,
            pitch: options.pitch || 1.0,
            volume: options.volume || 1.0,
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_text2speech', payload);
    }
    // ==================== 图像大模型 ====================
    /**
     * 文生图
     */
    async textToImage(options) {
        (0, utils_1.validateRequiredFields)(options, ['prompt']);
        const payload = {
            prompt: options.prompt,
            negative_prompt: options.negative_prompt,
            width: options.width || 1024,
            height: options.height || 1024,
            style: options.style,
            seed: options.seed,
            steps: options.steps || 25,
            cfg_scale: options.cfg_scale || 8.0,
            sampler: options.sampler || 'euler',
            batch_size: options.batch_size || 1,
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_text2image', payload);
    }
    /**
     * 参考生图
     */
    async imageToImage(options) {
        (0, utils_1.validateRequiredFields)(options, ['reference_image', 'prompt']);
        const payload = {
            prompt: options.prompt,
            width: options.width || 1024,
            height: options.height || 1024,
            batch_size: options.batch_size || 1,
            control_intensity: options.control_intensity || 0.8,
            control_type: options.control_type || '0', // 0-轮廓控制 1-姿态控制 2-角色控制 3-景深控制
            init_image: options.init_image,
            reference_image: options.reference_image,
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_reference_img2img', payload);
    }
    /**
     * 图片重绘
     */
    async redrawingImage(options) {
        (0, utils_1.validateRequiredFields)(options, ['image_url', 'prompt']);
        const payload = {
            image_url: options.image_url,
            mask_url: options.mask_url,
            prompt: options.prompt,
            strength: options.strength || 0.8,
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_image_redrawing', payload);
    }
    /**
     * 图像识别
     */
    async recognizeImage(options) {
        (0, utils_1.validateRequiredFields)(options, ['image_url']);
        const payload = {
            image_url: options.image_url,
            recognition_type: options.recognition_type || 'all',
            callback: options.callback,
            params: options.params
        };
        return this.http.post('/v1/ai/capacity/application/tm_image_recognition', payload);
    }
    // ==================== 通用方法 ====================
    /**
     * 获取任务状态
     */
    async getTaskStatus(task_id) {
        // 使用文档中的正确端点格式
        return this.http.get(`/v1/open/video/taf/result/${task_id}`);
    }
    /**
     * 轮询任务直到完成
     */
    async waitForTaskCompletion(task_id, maxAttempts = 60, intervalMs = 5000) {
        return this.http.pollTaskStatus(task_id, maxAttempts, intervalMs);
    }
    /**
     * 上传文件
     */
    async uploadFile(file, fileName) {
        return this.http.uploadFile(file, fileName);
    }
    /**
     * 批量处理任务
     */
    async batchProcess(tasks, options = {}) {
        const { concurrent = 3, pollInterval = 2000, onProgress } = options;
        const results = [];
        // 分批处理任务
        for (let i = 0; i < tasks.length; i += concurrent) {
            const batch = tasks.slice(i, i + concurrent);
            // 并发执行当前批次
            const batchPromises = batch.map(async (task, index) => {
                try {
                    const { task_id } = await task();
                    // 等待任务完成
                    const result = await this.waitForTaskCompletion(task_id, undefined, pollInterval);
                    results[i + index] = { task_id, result };
                }
                catch (error) {
                    results[i + index] = {
                        task_id: '',
                        error: error instanceof Error ? error.message : String(error)
                    };
                }
            });
            await Promise.all(batchPromises);
            // 报告进度
            if (onProgress) {
                onProgress(Math.min(i + concurrent, tasks.length), tasks.length);
            }
        }
        return results;
    }
}
exports.TianmuClient = TianmuClient;
//# sourceMappingURL=tianmu-client.js.map