import { TianmuClient } from './tianmu-client/dist/client/tianmu-client.js';

// 创建客户端
const client = new TianmuClient({
  app_key: '93dc75fe9be26c8a0530dad18b498087',
  app_secret: '545377213f382142231a74fc108c0495'
});

// 文生图测试
async function testTextToImage() {
  try {
    console.log('开始文生图测试...');
    
    const result = await client.textToImage({
      prompt: '一只可爱的小猫咪坐在阳光明媚的窗台上，背景是美丽的花园景色，写实风格，高清细节',
      negative_prompt: '模糊，低质量，变形，丑陋，多脚，多尾巴',
      width: 1024,
      height: 1024,
      style: 'realistic',
      steps: 25,
      cfg_scale: 8.0,
      sampler: 'euler'
    });

    console.log('文生图任务已创建，任务ID:', result.task_id);

    // 等待任务完成
    const finalResult = await client.waitForTaskCompletion(result.task_id);
    console.log('图片生成完成:', finalResult);

    // 保存结果到文件
    const fs = require('fs');
    fs.writeFileSync('./image-generation-result.json', JSON.stringify(finalResult, null, 2));
    console.log('结果已保存到 image-generation-result.json');

  } catch (error) {
    console.error('文生图测试失败:', error);
  }
}

// 执行测试
testTextToImage();