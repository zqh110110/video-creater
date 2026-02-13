import { createTianmuClient } from '../src/index';

// 示例配置 - 请替换为你的真实凭证
const config = {
  app_key: process.env.TIANMU_APP_KEY || 'your_app_key',
  app_secret: process.env.TIANMU_APP_SECRET || 'your_app_secret',
};

async function basicVideoExample() {
  console.log('🎥 文生视频示例');
  
  const client = createTianmuClient(config);
  
  try {
    // 创建文生视频任务
    const task = await client.textToVideo({
      prompt: '一只橘黄色的小猫在向日葵花园中欢快奔跑，阳光明媚，电影级调色',
      resolution: '720p',
      aspect_ratio: '16:9',
      camera_move_index: 9, // 静态镜头
    });
    
    console.log('✅ 任务已创建:', task.task_id);
    
    // 轮询任务状态
    console.log('⏳ 等待任务完成...');
    const result = await client.waitForTaskCompletion(task.task_id);
    
    console.log('🎉 视频生成完成!');
    console.log('结果:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ 生成失败:', error);
  }
}

async function imageToVideoExample() {
  console.log('🖼️ 图生视频示例');
  
  const client = createTianmuClient(config);
  
  try {
    const task = await client.imageToVideo({
      image_url: 'https://example.com/image.jpg', // 替换为实际图片URL
      prompt: '让图片中的花朵慢慢绽放',
      resolution: '720p',
      aspect_ratio: '1:1',
      camera_move_index: 7, // 推近镜头
    });
    
    console.log('✅ 图生视频任务已创建:', task.task_id);
    
    const result = await client.waitForTaskCompletion(task.task_id);
    console.log('🎉 图生视频完成:', result);
    
  } catch (error) {
    console.error('❌ 生成失败:', error);
  }
}

async function audioExample() {
  console.log('🎵 音频生成示例');
  
  const client = createTianmuClient(config);
  
  try {
    // 文生音乐
    const musicTask = await client.textToMusic({
      prompt: '轻快愉悦的钢琴曲，适合早晨聆听',
      duration: 15,
      style: 'classical',
      mood: 'happy',
    });
    
    console.log('🎼 音乐任务已创建:', musicTask.task_id);
    
    // 文字转语音
    const speechTask = await client.textToSpeech({
      text: '你好，欢迎使用天幕创作引擎！',
      voice_id: 'female_01',
      speed: 1.0,
      pitch: 1.0,
    });
    
    console.log('🗣️ 语音任务已创建:', speechTask.task_id);
    
    // 等待任务完成
    const [musicResult, speechResult] = await Promise.all([
      client.waitForTaskCompletion(musicTask.task_id),
      client.waitForTaskCompletion(speechTask.task_id),
    ]);
    
    console.log('🎉 音频生成完成!');
    console.log('音乐:', musicResult);
    console.log('语音:', speechResult);
    
  } catch (error) {
    console.error('❌ 音频生成失败:', error);
  }
}

async function imageProcessingExample() {
  console.log('🎨 图像处理示例');
  
  const client = createTianmuClient(config);
  
  try {
    // 文生图
    const textToImageTask = await client.textToImage({
      prompt: '一只可爱的小猫在花园里玩耍，阳光明媚，写实风格，高清细节',
      negative_prompt: '模糊，低质量，变形，丑陋',
      width: 1024,
      height: 1024,
      style: 'realistic',
      steps: 25,
      cfg_scale: 8.0,
      sampler: 'euler',
    });
    
    console.log('🎨 文生图任务已创建:', textToImageTask.task_id);
    
    // 参考生图
    const image2imageTask = await client.imageToImage({
      reference_image_url: 'https://example.com/reference.jpg',
      prompt: '将这张照片转换为梵高风格的油画',
      strength: 0.8,
      style: 'van_gogh',
    });
    
    console.log('🖼️ 参考生图任务已创建:', image2imageTask.task_id);
    
    // 图像识别
    const recognitionTask = await client.recognizeImage({
      image_url: 'https://example.com/image.jpg',
      recognition_type: 'all',
    });
    
    console.log('🔍 图像识别任务已创建:', recognitionTask.task_id);
    
    // 等待完成
    const [textToImageResult, imageResult, recognitionResult] = await Promise.all([
      client.waitForTaskCompletion(textToImageTask.task_id),
      client.waitForTaskCompletion(image2imageTask.task_id),
      client.waitForTaskCompletion(recognitionTask.task_id),
    ]);
    
    console.log('🎉 图像处理完成!');
    console.log('文生图结果:', textToImageResult);
    console.log('参考生图结果:', imageResult);
    console.log('识别结果:', recognitionResult);
    
  } catch (error) {
    console.error('❌ 图像处理失败:', error);
  }
}

async function batchProcessingExample() {
  console.log('📦 批量处理示例');
  
  const client = createTianmuClient(config);
  
  try {
    // 创建多个视频生成任务
    const tasks = [
      () => client.textToVideo({ prompt: '夕阳下的海滩，海浪轻柔' }),
      () => client.textToVideo({ prompt: '城市夜景，车流穿梭' }),
      () => client.textToVideo({ prompt: '森林小径，秋叶飘落' }),
      () => client.textToVideo({ prompt: '雪山日出，金光万丈' }),
    ];
    
    console.log('🔄 开始批量处理...');
    
    const results = await client.batchProcess(tasks, {
      concurrent: 2,
      pollInterval: 3000,
      onProgress: (completed, total) => {
        console.log(`进度: ${completed}/${total} (${Math.round(completed/total*100)}%)`);
      },
    });
    
    console.log('🎉 批量处理完成!');
    
    // 统计结果
    const successful = results.filter(r => !r.error).length;
    const failed = results.filter(r => r.error).length;
    
    console.log(`✅ 成功: ${successful}, ❌ 失败: ${failed}`);
    
    results.forEach((result, index) => {
      if (result.error) {
        console.log(`任务 ${index + 1} 失败: ${result.error}`);
      } else {
        console.log(`任务 ${index + 1} 成功: ${result.task_id}`);
      }
    });
    
  } catch (error) {
    console.error('❌ 批量处理失败:', error);
  }
}

async function taskManagementExample() {
  console.log('📋 任务管理示例');
  
  const client = createTianmuClient(config);
  
  try {
    // 创建任务
    const task = await client.textToVideo({
      prompt: '测试任务管理功能的视频',
    });
    
    const taskId = task.task_id;
    console.log('任务已创建:', taskId);
    
    // 定期检查任务状态
    let status;
    for (let i = 0; i < 10; i++) {
      status = await client.getTaskStatus(taskId);
      console.log(`检查 ${i + 1}: 状态=${status.status}, 进度=${status.progress || 'N/A'}`);
      
      if (status.status === 'completed' || status.status === 'failed') {
        break;
      }
      
      // 等待3秒后再次检查
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    if (status?.status === 'completed') {
      console.log('✅ 任务完成:', status.result);
    } else if (status?.status === 'failed') {
      console.log('❌ 任务失败:', status.error);
    } else {
      console.log('⏰ 任务超时');
    }
    
  } catch (error) {
    console.error('❌ 任务管理失败:', error);
  }
}

// 运行所有示例
async function runAllExamples() {
  console.log('🚀 开始运行天幕API示例\n');
  
  // 检查配置
  if (!config.app_key || config.app_key === 'your_app_key') {
    console.error('❌ 请在环境变量中设置真实的 TIANMU_APP_KEY 和 TIANMU_APP_SECRET');
    console.log('💡 参考 .env.example 文件配置环境变量');
    return;
  }
  
  try {
    await basicVideoExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await audioExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await imageProcessingExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await taskManagementExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await batchProcessingExample();
    
  } catch (error) {
    console.error('❌ 示例运行失败:', error);
  }
  
  console.log('\n🎊 所有示例运行完成!');
}

// 如果直接运行此文件
if (require.main === module) {
  runAllExamples();
}

export {
  basicVideoExample,
  imageToVideoExample,
  audioExample,
  imageProcessingExample,
  batchProcessingExample,
  taskManagementExample,
};