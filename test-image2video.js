import { TianmuClient } from './tianmu-client/dist/client/tianmu-client.js';

// 创建客户端
const client = new TianmuClient({
  app_key: '93dc75fe9be26c8a0530dad18b498087',
  app_secret: '545377213f382142231a74fc108c0495'
});

// 图生视频测试
async function testImageToVideo() {
  try {
    console.log('🎬 开始测试天幕图生视频功能...');
    
    // 需要一个参考图片URL，这里使用一个示例URL
    // 在实际使用中，这应该是一个可访问的图片URL
    const imageUrl = 'https://picsum.photos/512/512?random=1'; // 示例图片URL
    
    console.log('📸 使用参考图片:', imageUrl);
    
    const result = await client.imageToVideo({
      image_url: imageUrl,
      prompt: '将图片转换为动态视频，添加微风效果，树叶轻轻摇曳',
      resolution: '720p',
      aspect_ratio: '16:9',
      camera_move_index: 9 // 静态镜头
    });

    console.log('✅ 图生视频任务创建成功!');
    console.log('📋 任务ID:', result.task_id);

    // 等待任务完成
    console.log('⏳ 等待视频生成完成...');
    const finalResult = await client.waitForTaskCompletion(result.task_id, 30, 10000); // 最多30次，间隔10秒
    
    if (finalResult) {
      console.log('🎉 视频生成完成!');
      console.log('📊 最终结果:', JSON.stringify(finalResult, null, 2));
      
      // 保存结果到文件
      const fs = require('fs');
      fs.writeFileSync('./image2video-result.json', JSON.stringify(finalResult, null, 2));
      console.log('💾 结果已保存到 image2video-result.json');
      
      return finalResult;
    } else {
      console.log('❌ 任务超时或失败');
      return null;
    }

  } catch (error) {
    console.error('❌ 图生视频测试失败:', error.message);
    if (error.response) {
      console.error('🔍 错误详情:', error.response.data);
    }
    return null;
  }
}

// 带本地图片的图生视频测试
async function testImageToVideoWithLocalImage() {
  try {
    console.log('🖼️ 开始测试本地图片转视频功能...');
    
    // 假设我们有一个本地图片已经上传到云存储
    // 这里需要提供一个实际可访问的图片URL
    const localImageUrl = 'https://example.com/local-image.jpg'; // 需要替换为实际的上传图片URL
    
    console.log('📸 使用本地图片:', localImageUrl);
    
    const result = await client.imageToVideo({
      image_url: localImageUrl,
      prompt: '基于静态图片生成5秒动画，保持主体不变，添加自然动态效果',
      resolution: '1080p',
      aspect_ratio: '16:9',
      camera_move_index: 7 // 推近镜头
    });

    console.log('✅ 本地图片转视频任务创建成功!');
    console.log('📋 任务ID:', result.task_id);

    return result.task_id;

  } catch (error) {
    console.error('❌ 本地图片转视频测试失败:', error.message);
    if (error.response) {
      console.error('🔍 错误详情:', error.response.data);
    }
    return null;
  }
}

// 批量图生视频测试
async function testBatchImageToVideo() {
  try {
    console.log('🎬🎬 开始测试批量图生视频功能...');
    
    const imageUrl = 'https://picsum.photos/512/512?random=2'; // 另一个示例图片
    
    const result = await client.imageToVideo({
      image_url: imageUrl,
      prompt: '生成循环动画视频，图片元素重复出现，适合社交媒体',
      resolution: '720p',
      aspect_ratio: '9:16', // 竖屏格式，适合短视频
      camera_move_index: 1 // 环绕运镜
    });

    console.log('✅ 批量图生视频任务创建成功!');
    console.log('📋 任务ID:', result.task_id);

    return result.task_id;

  } catch (error) {
    console.error('❌ 批量图生视频测试失败:', error.message);
    if (error.response) {
      console.error('🔍 错误详情:', error.response.data);
    }
    return null;
  }
}

// 主测试函数
async function runImageToVideoTests() {
  console.log('🚀 开始天幕图生视频功能完整测试');
  console.log('=' .repeat(60));
  
  // 测试1: 基础图生视频
  console.log('\n📋 测试1: 基础图生视频');
  await testImageToVideo();
  
  console.log('\n' + '='.repeat(60));
  
  // 测试2: 不同分辨率和宽高比
  console.log('\n📋 测试2: 不同分辨率和宽高比');
  await testImageToVideoWithLocalImage();
  
  console.log('\n' + '='.repeat(60));
  
  // 测试3: 不同运镜效果
  console.log('\n📋 测试3: 不同运镜效果');
  await testBatchImageToVideo();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 图生视频测试完成!');
  
  console.log('\n📝 使用说明:');
  console.log('1. 需要提供可访问的图片URL');
  console.log('2. 支持多种分辨率: 720p, 1080p');
  console.log('3. 支持多种宽高比: 16:9, 9:16, 4:3, 3:4, 1:1');
  console.log('4. 支持46种运镜效果 (camera_move_index 1-46)');
  console.log('5. 生成视频长度固定为5秒');
}

// 执行测试
runImageToVideoTests();