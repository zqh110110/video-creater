# 天幕创作引擎 API 文档

## 1. 文档简介

本文档详细介绍了天幕创作引擎的 API 接口，包括视频生成、音频处理和图像编辑等功能。通过这些 API，开发者可以在自己的应用中集成 AI 创作能力，实现各种创意内容的生成和处理。

## 2. 快速开始

### 2.1 认证方式

所有 API 请求都需要在请求头中包含认证信息，使用 Basic 认证方式：

```
Authorization: Basic {access_token}
```

其中 `access_token` 是通过统一生成鉴权 token 接口获取的令牌。

### 2.2 API 请求流程

1. 获取认证 token
2. 调用相应的 API 端点创建任务
3. 通过统一获取结果接口查询任务状态和结果

### 2.3 统一获取结果接口

```
GET https://open-api.wondershare.cc/v1/open/video/taf/result/{task_id}
```

## 3. 视频相关 API

### 3.1 文生视频

**接口 URL**:
```
POST https://ai-api-eus.300624.com/v1/ai/capacity/application/tm_text2video
```

**请求参数**:
| 参数名 | 类型 | 描述 |
|-------|------|------|
| prompt | string | 视频描述文本 |
| duration | integer | 视频时长（秒） |
| resolution | string | 视频分辨率，如 "1080p" |

**请求示例**:
```bash
curl --location 'https://ai-api-eus.300624.com/v1/ai/capacity/application/tm_text2video' \
--header 'Authorization: Basic {token}' \
--data '{"prompt":"生成看书视频","duration":5,"resolution":"1080p"}'
```

### 3.2 首帧生视频

**接口 URL**:
```
POST https://open-api.wondershare.cc/v1/ai/capacity/application/tm_img2video
```

**请求参数**:
| 参数名 | 类型 | 描述 |
|-------|------|------|
| prompt | string | 视频描述文本 |
| image_info | object | 首帧图像信息 |
| image_info.image | string | 首帧图像 URL |
| image_info.size | integer | 图像大小 |
| camera_move_index | integer | 相机移动类型 |

### 3.3 视频续写

**接口 URL**:
```
POST https://open-api.wondershare.cc/v1/ai/capacity/application/tm_video_continue
```

### 3.4 首尾帧生视频

**接口 URL**:
```
POST https://open-api.wondershare.cc/v1/ai/capacity/application/tm_img2video
```

**请求参数**:
| 参数名 | 类型 | 描述 |
|-------|------|------|
| prompt | string | 视频描述文本 |
| image_info | object | 首帧图像信息 |
| image_info.image | string | 首帧图像 URL |
| image_info.size | integer | 图像大小 |
| image_tail_info | object | 尾帧图像信息 |
| image_tail_info.image_tail | string | 尾帧图像 URL |
| image_tail_info.size | integer | 图像大小 |

## 4. 音频相关 API

### 4.1 文生语音

**接口 URL**:
```
POST https://open-api.wondershare.cc/v1/open/capacity/application/tm_tts
```

**请求参数**:
| 参数名 | 类型 | 描述 |
|-------|------|------|
| text | string | 待转换的文本，限制 < 1024 tokens |
| voice_type | string | 语音类型 |
| speed | float | 语速 |
| pitch | float | 音调 |

### 4.2 文生音乐

**接口 URL**:
```
POST https://open-api.wondershare.cc/v1/open/capacity/application/tm_music_gen
```

### 4.3 文生音效

**接口 URL**:
```
POST https://open-api.wondershare.cc/v1/open/capacity/application/tm_sound_effect
```

### 4.4 视频配乐

**接口 URL**:
```
POST https://open-api.wondershare.cc/v1/open/capacity/application/tm_video_score
```

**请求参数**:
| 参数名 | 类型 | 描述 |
|-------|------|------|
| video_url | string | 视频 URL |
| prompt | string | 音乐描述文本，限制 < 77 tokens |
| duration | integer | 音乐时长（秒） |

## 5. 图像相关 API

### 5.1 参考生图

**接口 URL**:
```
POST https://open-api.wondershare.cc/v1/open/capacity/application/tm_image_gen
```

### 5.2 图片重绘

**接口 URL**:
```
POST https://open-api.wondershare.cc/v1/open/capacity/application/tm_redraw
```

**请求参数**:
| 参数名 | 类型 | 描述 |
|-------|------|------|
| image_url | string | 原始图像 URL |
| mask_url | string | 蒙版图像 URL |
| prompt | string | 重绘描述文本 |
| strength | float | 重绘强度 |

**请求示例**:
```bash
curl --location --request POST 'https://open-api.wondershare.cc/v1/open/capacity/application/tm_redraw' \
--header 'Authorization: Basic {access_token}' \
--data '{"image_url":"url","mask_url":"url","prompt":"重绘描述","strength":0.8}'
```

### 5.3 图像识别

**接口 URL**:
```
POST https://open-api.wondershare.cc/v1/open/capacity/application/tm_image_recognition
```

## 6. 统一生成鉴权 Token 接口

**接口 URL**:
```
POST https://open-api.wondershare.cc/v1/open/capacity/application/tob_text2video_b
```

**请求头**:
| 头字段 | 描述 |
|-------|------|
| X-App-Key | 应用密钥 |
| Authorization | Basic 认证，格式为 Basic {access_token} |

**请求示例**:
```bash
curl -X POST 'https://open-api.wondershare.cc/v1/open/capacity/application/tob_text2video_b' \
--header 'X-App-Key: {app-key}' \
--header 'Authorization: Basic {access_token}'
```

## 7. 响应格式

所有 API 接口的响应格式统一为：

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "task_id": "task_123456",
    "status": "pending",
    "result": null
  }
}
```

**响应字段说明**:
| 字段名 | 类型 | 描述 |
|-------|------|------|
| code | integer | 响应码，0 表示成功，非 0 表示失败 |
| msg | string | 响应消息 |
| data | object | 响应数据 |
| data.task_id | string | 任务 ID，用于查询任务状态和结果 |
| data.status | string | 任务状态，如 pending、running、completed、failed |
| data.result | object | 任务结果，任务完成后返回 |

## 8. 错误处理

### 8.1 常见错误码

| 错误码 | 描述 | 解决方案 |
|-------|------|----------|
| 400 | 请求参数错误 | 检查请求参数是否正确 |
| 401 | 认证失败 | 检查认证 token 是否有效 |
| 403 | 权限不足 | 确认应用是否有相应功能的权限 |
| 404 | 资源不存在 | 检查请求的 URL 是否正确 |
| 500 | 服务器内部错误 | 稍后重试或联系技术支持 |

### 8.2 错误响应示例

```json
{
  "code": 401,
  "msg": "Unauthorized",
  "data": null
}
```

## 9. 最佳实践

1. **认证管理**：妥善保存认证 token，避免在客户端代码中硬编码
2. **任务管理**：对于长时间运行的任务，使用轮询方式查询任务状态
3. **错误处理**：合理处理 API 返回的错误码，提供友好的用户提示
4. **参数验证**：在调用 API 前验证参数有效性，减少错误请求
5. **资源管理**：及时清理不需要的任务和资源，避免占用系统资源

## 10. 联系我们

如有任何问题或建议，请联系技术支持：

- 邮箱：support@wondershare.com
- 官网：https://www.wondershare.com

---

**文档版本**：v1.0
**更新时间**：2024-07-26
