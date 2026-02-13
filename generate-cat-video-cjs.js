// CommonJS版本的文生视频脚本

const { TianmuClient } = require('./tianmu-client/dist/client/tianmu-client.js');

// 创建客户端
const client = new TianmuClient({
  app_key: '93dc75fe9be26c8a0530dad18b498087',
  app_secret: '545377213f382142231a74fc108c0495'
});

// 文生视频测试
async function generateVideo() {
  try {
    console.log('🎬 开始天幕文生视频创作...');
    console.log('📝 提示词: "一只可爱的小猫在花园里玩耍"');
    console.log('⏱️ 时长: 5秒');
    console.log('📺 分辨率: 720p');
    console.log('📐 宽高比: 16:9');
    console.log('🎥 运镜: 静态镜头');
    
    const result = await client.textToVideo({
      prompt: '一只可爱的小猫在花园里玩耍，阳光明媚，花朵盛开，动态效果自然，毛发蓬松，表情可爱，尾巴轻轻摇摆',
      duration: 5,
      resolution: '720p',
      aspect_ratio: '16:9',
      camera_move_index: 9 // 静态镜头
    });

    console.log('✅ 文生视频任务创建成功!');
    console.log('📋 任务ID:', result.task_id);
    
    // 保存任务ID到文件
    const fs = require('fs');
    fs.writeFileSync('./video-task-id.txt', result.task_id);
    console.log('💾 任务ID已保存到 video-task-id.txt');
    
    // 等待任务完成
    console.log('⏳ 等待视频生成完成...');
    console.log('⏱️ 这可能需要几分钟时间，请耐心等待...');
    
    const finalResult = await client.waitForTaskCompletion(result.task_id, 60, 10000); // 最多60次，间隔10秒
    
    if (finalResult) {
      console.log('🎉 视频生成完成!');
      console.log('📊 最终结果:', JSON.stringify(finalResult, null, 2));
      
      // 保存完整结果
      fs.writeFileSync('./video-generation-result.json', JSON.stringify(finalResult, null, 2));
      console.log('💾 完整结果已保存到 video-generation-result.json');
      
      // 检查结果中是否包含视频URL
      if (finalResult.result && finalResult.result.video_url) {
        console.log('🎬 视频URL:', finalResult.result.video_url);
        console.log('📹 可以通过以下方式下载视频:');
        console.log('   1. 使用浏览器访问上面的URL');
        console.log('   2. 使用下载工具如 wget 或 curl');
        console.log('   3. 在代码中使用 HTTP 请求下载');
      }
      
      return finalResult;
    } else {
      console.log('⚠️ 任务已完成，但没有找到视频URL');
      console.log('📊 可能需要进一步处理或检查结果结构');
      console.log('📊 实际结果结构:', Object.keys(finalResult));
      return finalResult;
    }

  } catch (error) {
    console.error('❌ 文生视频失败:', error.message);
    if (error.response) {
      console.error('🔍 错误详情:', error.response.data);
    }
    return null;
  }
}

// 执行文生视频
generateVideo();