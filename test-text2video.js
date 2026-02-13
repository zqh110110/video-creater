import { TianmuClient } from './tianmu-client/dist/client/tianmu-client.js';

// 创建客户端
const client = new TianmuClient({
  app_key: '93dc75fe9be26c8a0530dad18b498087',
  app_secret: '545377213f382142231a74fc108c0495'
});

// 测试文生视频功能
async function testTextToVideo() {
  try {
    console.log('测试文生视频功能...');
    
    const result = await client.textToVideo({
      prompt: '一只小猫在花园里玩耍',
      resolution: '720p',
      aspect_ratio: '16:9',
      camera_move_index: 9 // 静态镜头
    });

    console.log('✅ 文生视频任务创建成功:', result.task_id);

    // 等待任务完成
    console.log('等待任务完成...');
    const finalResult = await client.waitForTaskCompletion(result.task_id, 10, 10000); // 最多10次，间隔10秒
    console.log('视频生成完成:', finalResult);

    return finalResult;

  } catch (error) {
    console.error('❌ 文生视频测试失败:', error.response?.data || error.message);
    return null;
  }
}

// 执行测试
testTextToVideo();