# 天幕API客户端架构设计文档

## 1. 项目概述

天幕API客户端是一个完整的TypeScript项目，提供了对万兴天幕AI创作引擎的完整访问能力，包括：

- **完整的API客户端**：封装所有天幕API功能
- **MCP服务器**：符合Model Context Protocol标准的服务器实现
- **类型安全**：完整的TypeScript类型定义
- **错误处理**：健壮的错误处理和重试机制
- **测试覆盖**：全面的单元测试和集成测试

## 2. 架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    应用层 (Application Layer)                │
├─────────────────────┬───────────────────────────────────────┤
│  客户端API (Client)  │        MCP服务器 (MCP Server)         │
├─────────────────────┼───────────────────────────────────────┤
│   TianmuClient      │      TianmuMCPServer                   │
│   - 文生视频        │      - 工具定义                        │
│   - 图生视频        │      - 请求处理                        │
│   - 音频生成        │      - 响应格式化                      │
│   - 图像处理        │      - 错误处理                        │
│   - 任务管理        │                                       │
└─────────────────────┴───────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    核心层 (Core Layer)                       │
├─────────────────────┬───────────────────────────────────────┤
│   HTTP客户端         │          工具函数                       │
│   - 请求封装        │      - 认证处理                        │
│   - 响应处理        │      - 参数验证                        │
│   - 重试机制        │      - 任务轮询                        │
│   - 错误处理        │      - 文件处理                        │
└─────────────────────┴───────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    基础层 (Foundation Layer)                 │
├─────────────────────┬───────────────────────────────────────┤
│   类型定义           │          外部依赖                       │
│   - API参数类型     │      - Axios                           │
│   - 响应类型         │      - MCP SDK                        │
│   - 配置类型         │      - Node.js Crypto                  │
└─────────────────────┴───────────────────────────────────────┘
```

### 2.2 模块设计

#### 2.2.1 客户端模块 (`src/client/`)

**HttpClient**: 基础HTTP通信层
- 封装axios实例
- 统一认证处理
- 请求/响应拦截
- 错误处理和重试

**TianmuClient**: 核心API客户端
- 封装所有天幕API
- 参数验证
- 任务状态管理
- 批量处理支持

#### 2.2.2 MCP服务器模块 (`src/mcp/`)

**TianmuMCPServer**: MCP协议服务器
- 工具定义和注册
- 请求路由和处理
- 响应格式化
- 错误处理

#### 2.2.3 类型定义模块 (`src/types/`)

完整的TypeScript类型定义：
- API请求参数类型
- 响应数据类型
- 配置类型
- 通用工具类型

#### 2.2.4 工具函数模块 (`src/utils/`)

通用工具函数：
- 认证token生成
- 参数验证
- 错误处理
- 文件操作

## 3. 数据流设计

### 3.1 API调用流程

```
用户请求 → 参数验证 → HTTP请求 → 响应处理 → 返回结果
    ↓           ↓           ↓          ↓          ↓
  1. 调用    2. validate  3. axios   4. parse   5. return
  client     required     instance   response    data
             fields       
```

### 3.2 MCP服务器处理流程

```
MCP请求 → 工具识别 → 参数提取 → 客户端调用 → 结果格式化 → MCP响应
    ↓           ↓           ↓           ↓           ↓          ↓
  1. 接收   2. 解析    3. 验证    4. 调用    5. 格式化   6. 返回
  request    tool     params    client    response   response
```

### 3.3 异步任务处理流程

```
任务提交 → 获取任务ID → 轮询状态 → 处理完成 → 返回结果
    ↓           ↓           ↓          ↓          ↓
  1. submit   2. task_id  3. poll     4. check    5. return
  request               status     status     final_result
```

## 4. 错误处理策略

### 4.1 错误分类

1. **参数错误**: 缺少必需参数、参数类型错误
2. **网络错误**: 连接超时、网络中断
3. **API错误**: API返回错误码
4. **系统错误**: 内部处理异常

### 4.2 错误处理机制

```typescript
try {
  // API调用
  const result = await client.textToVideo(options);
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    // 参数验证错误
    throw new UserFriendlyError('参数不正确: ' + error.message);
  } else if (error instanceof ApiError) {
    // API调用错误
    throw new UserFriendlyError('API调用失败: ' + error.message);
  } else {
    // 未知错误
    throw new UserFriendlyError('未知错误: ' + error.message);
  }
}
```

### 4.3 重试机制

- **指数退避**: 重试间隔逐渐增加
- **最大重试次数**: 防止无限重试
- **特定错误重试**: 只对网络错误和临时API错误重试

## 5. 性能优化

### 5.1 并发控制

- **批量处理**: 支持多任务并发执行
- **并发限制**: 防止过多并发导致API限流
- **队列管理**: 任务队列和优先级控制

### 5.2 缓存策略

- **响应缓存**: 缓存相同参数的API响应
- **状态缓存**: 缓存任务状态减少重复查询
- **配置缓存**: 缓存客户端配置

### 5.3 资源管理

- **连接池**: 复用HTTP连接
- **内存管理**: 及时释放大文件
- **超时控制**: 防止长时间等待

## 6. 安全设计

### 6.1 认证安全

- **凭证加密**: Base64编码认证信息
- **环境变量**: 敏感信息通过环境变量传递
- **访问控制**: 限制API访问权限

### 6.2 数据安全

- **参数验证**: 严格验证输入参数
- **输出过滤**: 过滤敏感信息
- **错误信息**: 不暴露内部错误详情

### 6.3 传输安全

- **HTTPS**: 强制使用HTTPS传输
- **证书验证**: 验证服务器证书
- **请求签名**: 可选的请求签名机制

## 7. 可扩展性设计

### 7.1 插件架构

```typescript
interface Plugin {
  name: string;
  install(client: TianmuClient): void;
  uninstall(client: TianmuClient): void;
}

class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  
  install(plugin: Plugin): void { /* 实现 */ }
  uninstall(pluginName: string): void { /* 实现 */ }
}
```

### 7.2 中间件支持

```typescript
interface Middleware {
  (request: Request, next: () => Promise<Response>): Promise<Response>;
}

class TianmuClient {
  private middlewares: Middleware[] = [];
  
  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }
}
```

### 7.3 自定义端点

```typescript
class CustomEndpoint extends BaseEndpoint {
  async customMethod(params: CustomParams): Promise<CustomResult> {
    // 自定义实现
  }
}
```

## 8. 测试策略

### 8.1 单元测试

- **函数级测试**: 测试每个函数的正确性
- **类级测试**: 测试类的完整功能
- **模块级测试**: 测试模块间的交互

### 8.2 集成测试

- **API集成测试**: 测试与真实API的交互
- **MCP集成测试**: 测试MCP协议的完整流程
- **端到端测试**: 测试完整的使用场景

### 8.3 测试工具

- **Jest**: 单元测试框架
- **Mock**: 模拟外部依赖
- **测试环境**: 独立的测试环境配置

## 9. 部署架构

### 9.1 客户端部署

```bash
# NPM包发布
npm publish

# 用户安装使用
npm install tianmu-client
```

### 9.2 MCP服务器部署

```bash
# 构建项目
npm run build

# 启动MCP服务器
node dist/server.js
```

### 9.3 Docker部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/server.js"]
```

## 10. 监控和日志

### 10.1 日志记录

- **请求日志**: 记录所有API请求
- **错误日志**: 记录所有错误信息
- **性能日志**: 记录响应时间和资源使用

### 10.2 监控指标

- **API调用次数**: 统计API使用情况
- **错误率**: 监控错误发生率
- **响应时间**: 监控API性能

### 10.3 告警机制

- **错误告警**: 错误率超过阈值时告警
- **性能告警**: 响应时间过长时告警
- **资源告警**: 资源使用率过高时告警

## 11. 文档规范

### 11.1 代码文档

- **JSDoc**: 完整的函数和类注释
- **类型注释**: TypeScript类型的详细说明
- **示例代码**: 每个功能的使用示例

### 11.2 API文档

- **接口说明**: 每个API的详细说明
- **参数说明**: 参数类型和含义
- **响应说明**: 响应格式和含义

### 11.3 使用文档

- **快速开始**: 新用户入门指南
- **最佳实践**: 推荐的使用方式
- **故障排除**: 常见问题解决方案

这个架构设计确保了项目的可维护性、可扩展性和高性能，为用户提供了完整的天幕API访问能力。