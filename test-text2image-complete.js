import { TianmuClient } from './tianmu-client/dist/client/tianmu-client.js';

// 创建客户端
const client = new TianmuClient({
  app_key: '93dc75fe9be26c8a0530dad18b498087',
  app_secret: '545377213f382142231a74fc108c0495'
});

// 完善的文生图测试
async function testTextToImage() {
  try {
    console.log('🎨 开始测试天幕文生图功能...');
    
    const result = await client.textToImage({
      prompt: '一只可爱的小猫咪坐在阳光明媚的窗台上，背景是美丽的花园景色，写实风格，高清细节，毛发清晰，光影自然',
      negative_prompt: '模糊，低质量，变形，丑陋，多脚，多尾巴，肢体不协调',
      width: 1024,
      height: 1024,
      style: 'realistic',
      steps: 25,
      cfg_scale: 8.0,
      sampler: 'euler',
      batch_size: 1
    });

    console.log('✅ 文生图任务创建成功!');
    console.log('📋 任务ID:', result.task_id);

    // 等待任务完成
    console.log('⏳ 等待图片生成完成...');
    const finalResult = await client.waitForTaskCompletion(result.task_id, 20, 10000); // 最多20次，间隔10秒
    
    if (finalResult) {
      console.log('🎉 图片生成完成!');
      console.log('📊 最终结果:', JSON.stringify(finalResult, null, 2));
      
      // 保存结果到文件
      const fs = require('fs');
      fs.writeFileSync('./text2image-result.json', JSON.stringify(finalResult, null, 2));
      console.log('💾 结果已保存到 text2image-result.json');
      
      return finalResult;
    } else {
      console.log('❌ 任务超时或失败');
      return null;
    }

  } catch (error) {
    console.error('❌ 文生图测试失败:', error.message);
    if (error.response) {
      console.error('🔍 错误详情:', error.response.data);
    }
    return null;
  }
}

// 参考生图测试
async function testImageToImage() {
  try {
    console.log('🖼️ 开始测试天幕参考生图功能...');
    
    // 这里需要一个参考图片URL，暂时使用一个示例URL
    const referenceImageUrl = 'https://example.com/reference-image.jpg'; // 需要替换为实际图片URL
    
    const result = await client.imageToImage({
      prompt: '将图片转换为日式动漫风格，保持原有构图和主体，增加梦幻色彩效果',
      reference_image: referenceImageUrl,
      width: 1024,
      height: 1024,
      batch_size: 1,
      control_intensity: 0.8,
      control_type: '0' // 0-轮廓控制
    });

    console.log('✅ 参考生图任务创建成功!');
    console.log('📋 任务ID:', result.task_id);

    return result.task_id;

  } catch (error) {
    console.error('❌ 参考生图测试失败:', error.message);
    if (error.response) {
      console.error('🔍 错误详情:', error.response.data);
    }
    return null;
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始天幕文生图功能完整测试');
  console.log('=' .repeat(50));
  
  // 测试文生图
  await testTextToImage();
  
  console.log('=' .repeat(50));
  
  // 测试参考生图（需要实际图片URL）
  console.log('⚠️  参考生图测试需要实际的参考图片URL');
  console.log('⚠️  请将 referenceImageUrl 替换为实际可访问的图片URL');
  // await testImageToImage();
  
  console.log('=' .repeat(50));
  console.log('🎯 测试完成！');
}

// 执行测试
runTests();