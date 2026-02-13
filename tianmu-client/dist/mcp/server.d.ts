import { ClientConfig } from '../types';
/**
 * 天幕MCP服务器
 */
export declare class TianmuMCPServer {
    private server;
    private client;
    constructor(config: ClientConfig);
    private setupToolHandlers;
    private getToolDefinitions;
    private handleTextToVideo;
    private handleImageToVideo;
    private handleContinueVideo;
    private handleFramesToVideo;
    private handleTextToMusic;
    private handleTextToSoundEffect;
    private handleGenerateVideoSoundtrack;
    private handleTextToSpeech;
    private handleTextToImage;
    private handleImageToImage;
    private handleRedrawingImage;
    private handleRecognizeImage;
    private handleGetTaskStatus;
    private handleWaitForTask;
    /**
     * 启动MCP服务器
     */
    start(): Promise<void>;
    /**
     * 停止MCP服务器
     */
    stop(): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map