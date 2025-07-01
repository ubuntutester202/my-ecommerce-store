# 前端测试清单 - Day 7

## 📋 测试概览

本文档提供了完整的前端测试清单，确保网站在所有设备和浏览器上正常运行。

## 🌐 浏览器兼容性测试

### 桌面端浏览器

#### Chrome (推荐版本: 最新)
- [ ] 页面布局正常显示
- [ ] 所有JavaScript功能正常
- [ ] 图片懒加载工作正常
- [ ] 购物车功能完整
- [ ] 搜索功能正常
- [ ] 用户认证流程无问题

#### Firefox (推荐版本: 最新)
- [ ] CSS网格布局兼容性
- [ ] Flexbox布局正常
- [ ] 响应式图片显示正确
- [ ] 表单验证工作正常
- [ ] 动画效果流畅

#### Safari (推荐版本: 最新)
- [ ] WebKit引擎兼容性
- [ ] 图片格式支持检查
- [ ] 触摸事件处理
- [ ] 字体渲染正常

#### Edge (推荐版本: 最新)
- [ ] 基本功能测试
- [ ] CSS兼容性检查
- [ ] 性能表现评估

### 移动端浏览器

#### 移动端Chrome
- [ ] 触摸操作响应
- [ ] 虚拟键盘适配
- [ ] 网址栏隐藏适配
- [ ] 横竖屏切换适配

#### 移动端Safari
- [ ] iOS设备兼容性
- [ ] 状态栏适配
- [ ] 刘海屏适配
- [ ] 手势导航适配

#### 微信内置浏览器
- [ ] 微信环境兼容性
- [ ] 分享功能测试
- [ ] 支付接口兼容性

### 兼容性测试工具

```bash
# 使用Playwright进行跨浏览器测试
npx playwright test

# 使用BrowserStack进行真实设备测试
# 访问: https://www.browserstack.com/

# 使用Can I Use检查特性支持
# 访问: https://caniuse.com/
```

## 📱 移动端适配测试

### 设备分辨率测试

#### iPhone系列
- [ ] iPhone SE (375×667)
- [ ] iPhone 12/13/14 (390×844)
- [ ] iPhone 12/13/14 Pro Max (428×926)

#### Android系列
- [ ] Galaxy S21 (360×800)
- [ ] Pixel 5 (393×851)
- [ ] 小米/华为等国产手机

#### 平板设备
- [ ] iPad (768×1024)
- [ ] iPad Pro (1024×1366)
- [ ] Android平板

### 响应式测试清单

```javascript
// 测试不同视口大小
const viewports = [
  { width: 320, height: 568 },  // iPhone 5/SE
  { width: 375, height: 667 },  // iPhone 6/7/8
  { width: 414, height: 896 },  // iPhone XR
  { width: 768, height: 1024 }, // iPad
  { width: 1024, height: 768 }, // iPad横屏
  { width: 1440, height: 900 }, // 桌面端
];

// Chrome DevTools测试步骤
// 1. F12打开开发者工具
// 2. 点击设备模拟按钮
// 3. 选择不同设备尺寸测试
// 4. 检查布局是否正常
```

### 触摸交互测试

- [ ] 按钮点击响应
- [ ] 滑动操作正常
- [ ] 长按操作
- [ ] 双击放大
- [ ] 捏合缩放
- [ ] 下拉刷新

### 移动端性能测试

- [ ] 首屏加载时间 < 3秒
- [ ] 页面切换流畅
- [ ] 滚动性能流畅
- [ ] 图片加载优化
- [ ] 网络慢速测试

## ⚡ 性能测试 (Lighthouse)

### 运行Lighthouse测试

```bash
# 安装Lighthouse
npm install -g lighthouse

# 运行性能测试
lighthouse http://localhost:3000 --view

# 生成性能报告
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# 使用Chrome DevTools
# 1. F12打开开发者工具
# 2. 切换到Lighthouse标签
# 3. 选择测试类型(Performance, Accessibility等)
# 4. 点击Generate report
```

### 性能指标目标

#### Core Web Vitals
- [ ] **LCP (Largest Contentful Paint)** < 2.5秒
- [ ] **FID (First Input Delay)** < 100毫秒
- [ ] **CLS (Cumulative Layout Shift)** < 0.1

#### 其他重要指标
- [ ] **FCP (First Contentful Paint)** < 1.8秒
- [ ] **TTI (Time to Interactive)** < 5秒
- [ ] **Speed Index** < 3.4秒
- [ ] **Total Blocking Time** < 200毫秒

### 性能优化检查

- [ ] 图片优化 (WebP格式, 压缩, 懒加载)
- [ ] JavaScript代码分割
- [ ] CSS优化 (压缩, 内联关键CSS)
- [ ] 字体优化 (font-display: swap)
- [ ] 缓存策略配置
- [ ] CDN使用
- [ ] Gzip/Brotli压缩启用

## ♿ 可访问性测试

### 自动化可访问性测试

```bash
# 使用axe-core进行测试
npm install --save-dev @axe-core/cli

# 运行可访问性测试
npx axe http://localhost:3000

# 使用Lighthouse可访问性测试
lighthouse http://localhost:3000 --only-categories=accessibility --view
```

### 可访问性检查清单

#### 键盘导航
- [ ] Tab键可以遍历所有交互元素
- [ ] 焦点指示器清晰可见
- [ ] 跳过链接(Skip Links)实现
- [ ] 模态框焦点管理
- [ ] 下拉菜单键盘操作

#### 屏幕阅读器支持
- [ ] 所有图片有alt属性
- [ ] 表单标签正确关联
- [ ] 标题层级结构合理(h1-h6)
- [ ] 语义化HTML使用
- [ ] ARIA属性正确使用

#### 色彩对比度
- [ ] 文字与背景对比度 ≥ 4.5:1
- [ ] 大文字对比度 ≥ 3:1
- [ ] 非文字元素对比度 ≥ 3:1
- [ ] 链接颜色区分度

#### 其他可访问性要求
- [ ] 页面语言属性设置
- [ ] 错误信息清晰传达
- [ ] 表单验证可访问
- [ ] 媒体内容有替代文本

### 可访问性测试工具

1. **WAVE** (Web Accessibility Evaluation Tool)
   - 浏览器扩展: Chrome/Firefox WAVE插件
   - 在线工具: https://wave.webaim.org/

2. **axe DevTools**
   - 浏览器扩展: axe DevTools
   - 自动化测试: @axe-core/cli

3. **Colour Contrast Analyser**
   - 下载: https://www.tpgi.com/color-contrast-checker/

## 🔧 自动化测试脚本

### 创建测试脚本

```javascript
// tests/performance.test.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouseTest() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'html', port: chrome.port};
  const runnerResult = await lighthouse('http://localhost:3000', options);

  // 检查性能分数
  const performanceScore = runnerResult.lhr.categories.performance.score * 100;
  console.log(`Performance Score: ${performanceScore}`);
  
  if (performanceScore < 90) {
    console.warn('Performance score is below 90!');
  }

  await chrome.kill();
}

runLighthouseTest();
```

### 端到端测试

```javascript
// tests/e2e.test.js
const { test, expect } = require('@playwright/test');

test('购物流程完整测试', async ({ page }) => {
  // 访问首页
  await page.goto('http://localhost:3000');
  
  // 搜索商品
  await page.fill('[placeholder="搜索商品..."]', '手表');
  await page.press('[placeholder="搜索商品..."]', 'Enter');
  
  // 选择商品
  await page.click('.product-card:first-child');
  
  // 添加到购物车
  await page.click('button:has-text("添加到购物车")');
  
  // 检查购物车
  await expect(page.locator('.cart-count')).toHaveText('1');
  
  // 进入结账流程
  await page.click('button:has-text("去结账")');
  
  // 验证结账页面
  await expect(page).toHaveURL(/.*checkout.*/);
});
```

## 📊 测试报告模板

### 测试执行记录

| 测试项目 | 测试结果 | 问题描述 | 修复状态 |
|---------|---------|---------|---------|
| Chrome兼容性 | ✅ 通过 | - | - |
| Firefox兼容性 | ❌ 失败 | CSS Grid布局问题 | 🔧 已修复 |
| 移动端适配 | ✅ 通过 | - | - |
| 性能测试 | ⚠️ 警告 | LCP超过3秒 | 🚧 处理中 |
| 可访问性测试 | ✅ 通过 | - | - |

### 测试环境信息

- **测试日期**: 2024-01-XX
- **测试环境**: 
  - Node.js版本: v18.x.x
  - Next.js版本: 15.3.4
  - 浏览器版本: Chrome 120.x.x
- **测试工具**: 
  - Lighthouse 11.x.x
  - Playwright 1.x.x
  - axe-core 4.x.x

## 🚀 部署前最终检查

### 功能完整性检查
- [ ] 用户注册/登录功能
- [ ] 商品浏览和搜索
- [ ] 购物车操作
- [ ] 结账流程
- [ ] 订单管理
- [ ] 个人信息管理

### 安全性检查
- [ ] HTTPS配置
- [ ] 安全头设置
- [ ] XSS防护
- [ ] CSRF防护
- [ ] 输入验证

### SEO检查
- [ ] 页面标题和描述
- [ ] 结构化数据
- [ ] 网站地图
- [ ] robots.txt
- [ ] 页面加载速度

## 🛠 问题修复指南

### 常见问题及解决方案

1. **图片加载慢**
   - 启用WebP格式
   - 实现懒加载
   - 优化图片尺寸
   - 使用CDN

2. **JavaScript执行阻塞**
   - 代码分割
   - 延迟加载非关键代码
   - 使用Web Workers

3. **CSS阻塞渲染**
   - 内联关键CSS
   - 延迟加载非关键CSS
   - 移除未使用的CSS

4. **可访问性问题**
   - 添加ARIA标签
   - 改善键盘导航
   - 提高色彩对比度

---

**测试完成后，请确保所有关键功能都正常工作，性能指标达到目标，并且网站在各种设备和浏览器上都能正常访问。** 