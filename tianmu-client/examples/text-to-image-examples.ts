import { createTianmuClient } from '../src/index';

// 示例配置 - 请替换为你的真实凭证
const config = {
  app_key: process.env.TIANMU_APP_KEY || 'your_app_key',
  app_secret: process.env.TIANMU_APP_SECRET || 'your_app_secret',
};

async function basicTextToImageExample() {
  console.log('🎨 基础文生图示例');
  
  const client = createTianmuClient(config);
  
  try {
    // 简单的文生图
    const task = await client.textToImage({
      prompt: '一只可爱的小猫在花园里玩耍，阳光明媚',
    });
    
    console.log('✅ 任务已创建:', task.task_id);
    
    // 等待任务完成
    console.log('⏳ 等待图片生成...');
    const result = await client.waitForTaskCompletion(task.task_id);
    
    console.log('🎉 图片生成完成!');
    console.log('结果:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ 生成失败:', error);
  }
}

async function advancedTextToImageExample() {
  console.log('🎨 高级文生图示例');
  
  const client = createTianmuClient(config);
  
  try {
    const task = await client.textToImage({
      prompt: '一只橘黄色的小猫在向日葵花园中欢快奔跑，阳光照射在它蓬松的毛发上，脖子上系着红色波点领巾，电影级调色，高清细节，专业摄影',
      negative_prompt: '模糊，低质量，变形，丑陋，水印，文字',
      width: 1024,
      height: 1024,
      style: 'realistic',
      seed: 12345,
      steps: 30,
      cfg_scale: 8.5,
      sampler: 'euler_a',
      batch_size: 1,
    });
    
    console.log('✅ 高级文生图任务已创建:', task.task_id);
    
    const result = await client.waitForTaskCompletion(task.task_id);
    console.log('🎉 高级文生图完成:', result);
    
  } catch (error) {
    console.error('❌ 高级文生图失败:', error);
  }
}

async function batchTextToImageExample() {
  console.log('🎨 批量文生图示例');
  
  const client = createTianmuClient(config);
  
  try {
    const prompts = [
      {
        prompt: '夕阳下的海滩，海浪轻柔拍打沙滩，椰子树摇曳',
        style: 'photorealistic',
      },
      {
        prompt: '繁华的城市夜景，霓虹灯光，车流穿梭',
        style: 'cyberpunk',
      },
      {
        prompt: '宁静的森林小径，秋叶飘落，阳光透过树叶洒下',
        style: 'impressionist',
      },
      {
        prompt: '雪山日出，金光照耀山峰，云海翻腾',
        style: 'landscape',
      }
    ];

    // 创建多个文生图任务
    const tasks = prompts.map((promptData, index) => 
      () => client.textToImage({
        prompt: promptData.prompt,
        style: promptData.style,
        width: 1024,
        height: 1024,
        seed: 1000 + index, // 使用不同的种子确保多样性
        steps: 25,
        cfg_scale: 8.0,
      })
    );
    
    console.log('🔄 开始批量文生图...');
    
    const results = await client.batchProcess(tasks, {
      concurrent: 2,
      pollInterval: 3000,
      onProgress: (completed, total) => {
        console.log(`进度: ${completed}/${total} (${Math.round(completed/total*100)}%)`);
      },
    });
    
    console.log('🎉 批量文生图完成!');
    
    // 统计结果
    const successful = results.filter(r => !r.error).length;
    const failed = results.filter(r => r.error).length;
    
    console.log(`✅ 成功: ${successful}, ❌ 失败: ${failed}`);
    
    results.forEach((result, index) => {
      if (result.error) {
        console.log(`图片 ${index + 1} 失败: ${result.error}`);
      } else {
        console.log(`图片 ${index + 1} 成功: ${result.task_id}`);
      }
    });
    
  } catch (error) {
    console.error('❌ 批量文生图失败:', error);
  }
}

async function styleVariationExample() {
  console.log('🎨 风格变化示例');
  
  const client = createTianmuClient(config);
  
  try {
    const basePrompt = '一只小猫坐在窗台上看着窗外';
    const styles = [
      { name: '写实风格', style: 'realistic' },
      { name: '动漫风格', style: 'anime' },
      { name: '水彩画风格', style: 'watercolor' },
      { name: '油画风格', style: 'oil_painting' },
      { name: '像素艺术风格', style: 'pixel_art' }
    ];

    const tasks = styles.map(styleData =>
      () => client.textToImage({
        prompt: basePrompt,
        style: styleData.style,
        width: 1024,
        height: 1024,
        steps: 20,
        cfg_scale: 7.5,
      })
    );

    console.log('🎨 生成不同风格的图片...');
    
    const results = await client.batchProcess(tasks, {
      concurrent: 2,
      onProgress: (completed, total) => {
        console.log(`风格生成进度: ${completed}/${total}`);
      },
    });

    console.log('🎉 风格变化完成!');
    
    styles.forEach((styleData, index) => {
      const result = results[index];
      if (result.error) {
        console.log(`${styleData.name} 失败: ${result.error}`);
      } else {
        console.log(`${styleData.name} 成功: ${result.task_id}`);
      }
    });
    
  } catch (error) {
    console.error('❌ 风格变化失败:', error);
  }
}

async function parameterExplorationExample() {
  console.log('🎨 参数探索示例');
  
  const client = createTianmuClient(config);
  
  try {
    const basePrompt = '一朵美丽的玫瑰花';
    
    // 测试不同的步数
    console.log('📊 测试不同步数...');
    const stepsTests = [10, 20, 30, 40].map(steps =>
      () => client.textToImage({
        prompt: basePrompt,
        steps: steps,
        width: 512,
        height: 512,
        seed: 12345, // 使用相同种子确保可比性
      })
    );

    const stepsResults = await client.batchProcess(stepsTests, { concurrent: 2 });
    
    // 测试不同的CFG Scale
    console.log('📊 测试不同CFG Scale...');
    const cfgTests = [5.0, 7.0, 9.0, 12.0].map(cfg_scale =>
      () => client.textToImage({
        prompt: basePrompt,
        cfg_scale: cfg_scale,
        width: 512,
        height: 512,
        seed: 67890, // 使用不同种子
      })
    );

    const cfgResults = await client.batchProcess(cfgTests, { concurrent: 2 });
    
    // 测试不同的采样器
    console.log('📊 测试不同采样器...');
    const samplers = ['euler', 'euler_a', 'ddim', 'dpm2'];
    const samplerTests = samplers.map(sampler =>
      () => client.textToImage({
        prompt: basePrompt,
        sampler: sampler,
        width: 512,
        height: 512,
        seed: 11111,
      })
    );

    const samplerResults = await client.batchProcess(samplerTests, { concurrent: 2 });
    
    console.log('🎉 参数探索完成!');
    console.log('步数测试结果:', stepsResults.map(r => r.error || r.task_id));
    console.log('CFG Scale测试结果:', cfgResults.map(r => r.error || r.task_id));
    console.log('采样器测试结果:', samplerResults.map(r => r.error || r.task_id));
    
  } catch (error) {
    console.error('❌ 参数探索失败:', error);
  }
}

// 运行所有示例
async function runAllTextToImageExamples() {
  console.log('🚀 开始运行文生图示例\n');
  
  // 检查配置
  if (!config.app_key || config.app_key === 'your_app_key') {
    console.error('❌ 请在环境变量中设置真实的 TIANMU_APP_KEY 和 TIANMU_APP_SECRET');
    console.log('💡 参考 .env.example 文件配置环境变量');
    return;
  }
  
  try {
    await basicTextToImageExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await advancedTextToImageExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await batchTextToImageExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await styleVariationExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await parameterExplorationExample();
    
  } catch (error) {
    console.error('❌ 示例运行失败:', error);
  }
  
  console.log('\n🎊 所有文生图示例运行完成!');
}

// 如果直接运行此文件
if (require.main === module) {
  runAllTextToImageExamples();
}

export {
  basicTextToImageExample,
  advancedTextToImageExample,
  batchTextToImageExample,
  styleVariationExample,
  parameterExplorationExample,
};