#!/usr/bin/env node

/**
 * 项目验证脚本
 * 验证项目的完整性和基本功能
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 天幕API客户端项目验证');
console.log('========================\n');

interface ValidationResult {
  passed: boolean;
  message: string;
}

class ProjectValidator {
  private projectRoot: string;
  private results: ValidationResult[] = [];

  constructor(projectRoot: string = '.') {
    this.projectRoot = projectRoot;
  }

  private addResult(result: ValidationResult): void {
    this.results.push(result);
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.message}`);
  }

  private fileExists(path: string): boolean {
    return existsSync(join(this.projectRoot, path));
  }

  private hasValidPackageJson(): boolean {
    try {
      const packageJson = JSON.parse(
        readFileSync(join(this.projectRoot, 'package.json'), 'utf8')
      );
      
      return (
        packageJson.name === 'tianmu-client' &&
        packageJson.version &&
        packageJson.dependencies &&
        packageJson.devDependencies
      );
    } catch {
      return false;
    }
  }

  private hasValidTypeScript(): boolean {
    return (
      this.fileExists('tsconfig.json') &&
      this.fileExists('src/index.ts')
    );
  }

  private hasValidTests(): boolean {
    return (
      this.fileExists('jest.config.js') &&
      this.fileExists('tests/setup.ts') &&
      this.fileExists('tests/client.test.ts') &&
      this.fileExists('tests/mcp-server.test.ts')
    );
  }

  private hasCompleteSource(): boolean {
    const sourceFiles = [
      'src/index.ts',
      'src/client/http-client.ts',
      'src/client/tianmu-client.ts',
      'src/mcp/server.ts',
      'src/types/index.ts',
      'src/utils/index.ts',
      'src/server.ts'
    ];

    return sourceFiles.every(file => this.fileExists(file));
  }

  private hasCompleteDocumentation(): boolean {
    const docFiles = [
      'README.md',
      'PROJECT_SUMMARY.md',
      'docs/architecture.md',
      'docs/api-reference.md'
    ];

    return docFiles.every(file => this.fileExists(file));
  }

  private hasExamples(): boolean {
    return (
      this.fileExists('examples/client-examples.ts') &&
      this.fileExists('examples/mcp-examples.ts')
    );
  }

  private hasValidDependencies(): boolean {
    try {
      const packageJson = JSON.parse(
        readFileSync(join(this.projectRoot, 'package.json'), 'utf8')
      );

      const requiredDeps = [
        '@modelcontextprotocol/sdk',
        'axios'
      ];

      const requiredDevDeps = [
        '@types/node',
        'typescript',
        'jest',
        'ts-jest'
      ];

      return (
        requiredDeps.every(dep => packageJson.dependencies[dep]) &&
        requiredDevDeps.every(dep => packageJson.devDependencies[dep])
      );
    } catch {
      return false;
    }
  }

  validate(): void {
    console.log('📦 项目配置验证');
    this.addResult({
      passed: this.hasValidPackageJson(),
      message: 'package.json 配置正确'
    });

    this.addResult({
      passed: this.hasValidTypeScript(),
      message: 'TypeScript 配置正确'
    });

    this.addResult({
      passed: this.hasValidDependencies(),
      message: '依赖包配置正确'
    });

    console.log('\n📚 源代码验证');
    this.addResult({
      passed: this.hasCompleteSource(),
      message: '所有源文件完整'
    });

    this.addResult({
      passed: this.hasValidTests(),
      message: '测试文件完整'
    });

    console.log('\n📖 文档验证');
    this.addResult({
      passed: this.hasCompleteDocumentation(),
      message: '文档完整'
    });

    this.addResult({
      passed: this.hasExamples(),
      message: '示例代码完整'
    });

    console.log('\n📊 验证结果统计');

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const failed = total - passed;

    console.log(`✅ 通过: ${passed}/${total}`);
    console.log(`❌ 失败: ${failed}/${total}`);

    if (failed === 0) {
      console.log('\n🎉 项目验证全部通过！');
      console.log('\n📋 下一步操作:');
      console.log('1. 运行 npm install 安装依赖');
      console.log('2. 配置 .env 文件设置API凭证');
      console.log('3. 运行 npm test 执行测试');
      console.log('4. 运行 npm run build 构建项目');
      console.log('5. 运行 npm run dev 体验示例');
      console.log('6. 运行 npm run mcp 启动MCP服务器');
    } else {
      console.log('\n⚠️  项目验证存在问题，请检查上述失败项');
    }
  }
}

// 运行验证
const validator = new ProjectValidator();
validator.validate();