"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTianmuClient = void 0;
/**
 * 测试用的TianmuClient
 */
const fixed_http_client_1 = require("../client/fixed-http-client");
const fixed_token_manager_1 = require("../auth/fixed-token-manager");
const utils_1 = require("../utils");
class TestTianmuClient {
    constructor(config) {
        this.tokenManager = new fixed_token_manager_1.FixedTokenManager(config.app_key, config.app_secret);
        this.http = new fixed_http_client_1.FixedHttpClient(config);
    }
    /**
     * 手动设置Token用于测试
     */
    setAuthToken(token) {
        this.tokenManager.setTokenManually(token);
    }
    /**
     * 测试文生视频
     */
    async testTextToVideo(options) {
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
}
exports.TestTianmuClient = TestTianmuClient;
//# sourceMappingURL=test-tianmu-client.js.map