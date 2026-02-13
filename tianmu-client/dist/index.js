"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TianmuClient = exports.HttpClient = void 0;
exports.createTianmuClient = createTianmuClient;
var http_client_1 = require("./client/http-client");
Object.defineProperty(exports, "HttpClient", { enumerable: true, get: function () { return http_client_1.HttpClient; } });
const tianmu_client_1 = require("./client/tianmu-client");
var tianmu_client_2 = require("./client/tianmu-client");
Object.defineProperty(exports, "TianmuClient", { enumerable: true, get: function () { return tianmu_client_2.TianmuClient; } });
// 导出所有类型
__exportStar(require("./types"), exports);
// 导出工具函数
__exportStar(require("./utils"), exports);
// 便捷的客户端创建函数
function createTianmuClient(config) {
    return new tianmu_client_1.TianmuClient(config);
}
// 默认导出客户端类
exports.default = tianmu_client_1.TianmuClient;
//# sourceMappingURL=index.js.map