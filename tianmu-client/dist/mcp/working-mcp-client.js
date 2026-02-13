"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkingMCPClient = void 0;
/**
 * 使用基础认证的可工作MCP客户端
 */
const tianmu_client_js_1 = require("../client/tianmu-client.js");
class WorkingMCPClient {
    constructor() {
        // 使用已知有效的基础认证配置
        this.client = new tianmu_client_js_1.TianmuClient({
            app_key: process.env.TIANMU_APP_KEY || '93dc75fe9be26c8a0530dad18b498087',
            app_secret: process.env.TIANMU_APP_SECRET || '545377213f382142231a74fc108c0495',
            baseURL: 'https://open-api.wondershare.cc' // 使用工作的原始URL
        });
    }
    // 测试视频生成
    async testTextToVideo(prompt = '测试视频生成') {
        try {
            const result = await this.client.textToVideo({
                prompt,
                duration: 5,
                resolution: '720p'
            });
            return {
                success: !!result.task_id,
                task_id: result.task_id,
                data: result
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }
    // 测试图像生成
    async testTextToImage(prompt = '测试图像生成') {
        try {
            const result = await this.client.textToImage({
                prompt,
                width: 512,
                height: 512
            });
            return {
                success: !!result.task_id,
                task_id: result.task_id,
                data: result
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }
}
exports.WorkingMCPClient = WorkingMCPClient;
//# sourceMappingURL=working-mcp-client.js.map