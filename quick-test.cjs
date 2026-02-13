
/**
 * 简化的天幕API测试
 */

const { TianmuClient } = require('./tianmu-client/dist/client/tianmu-client.cjs');

async function runQuickTest() {
  console.log('🚀 开始天幕API快速测试...');
  
  const client = new TianmuClient({
    app_key: '93dc75fe9be26c8a0530dad18b498087',
    app_secret: '545377213f382142231a74fc108c0495',
    baseURL: 'https://open-api.wondershare.cc'
  });
  
  try {
    console.log('📹 测试文生视频...');
    const videoResult = await client.textToVideo({
      prompt: '一只可爱的小猫在花园里玩耍',
      duration: 5,
      resolution: '720p'
    });
    
    if (videoResult.task_id) {
      console.log('✅ 文生视频成功! 任务ID:', videoResult.task_id);
      
      console.log('🔍 测试任务状态查询...');
      const status = await client.getTaskStatus(videoResult.task_id);
      console.log('📊 任务状态:', status);
      
      return { success: true, videoResult, status };
    } else {
      console.log('❌ 文生视频失败:', videoResult);
      return { success: false, error: videoResult };
    }
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    return { success: false, error };
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runQuickTest().then(result => {
    if (result.success) {
      console.log('\n🎉 天幕API测试完全成功！');
      console.log('📋 可以开始使用所有功能');
    } else {
      console.log('\n❌ 测试失败，需要进一步调试');
      console.log('错误:', result.error);
    }
  });
}

module.exports = { runQuickTest };
  