import { VideoGenerationOptions, TaskResponse, ClientConfig } from '../types';
export declare class TestTianmuClient {
    private http;
    private tokenManager;
    constructor(config: ClientConfig);
    /**
     * 手动设置Token用于测试
     */
    setAuthToken(token: string): void;
    /**
     * 测试文生视频
     */
    testTextToVideo(options: VideoGenerationOptions): Promise<TaskResponse>;
}
//# sourceMappingURL=test-tianmu-client.d.ts.map