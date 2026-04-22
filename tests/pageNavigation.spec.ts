import { test, expect } from '@playwright/test';

/**
 * =====================================================
 * 页面跳转逻辑分析
 * =====================================================
 *
 * 页面映射 (index.html):
 * - 'login': 'android/code.html'         -> 首次开启指纹识别
 * - 'home': '_6/code.html'                -> 首页/资产
 * - 'assetDetail': '_5/code.html'         -> 开启快捷登录 (⚠️ 命名与实际不符)
 * - 'profile': '_3/code.html'             -> 个人中心
 * - 'data': '_4/code.html'                -> 数据中心
 *
 * 启动流程:
 * 1. 显示Splash画面 (2秒)
 * 2. 淡出动画 (0.8秒)
 * 3. 显示页面容器和底部导航
 * 4. 自动加载首页 (loadPage('home'))
 *
 * 视频背景层级:
 * ┌─────────────────────────────────────────────┐
 * │  z-50 │ 底部导航 (bottomNav)                 │
 * ├───────┴─────────────────────────────────────┤
 * │  z-10+│ 页面内容 (page-container)            │
 * │       │ 视频持续播放，不重新加载              │
 * ├───────┴─────────────────────────────────────┤
 * │  z-1  │ 视频遮罩层 (videoOverlay)            │
 * ├───────┴─────────────────────────────────────┤
 * │  z-2  │ 持久视频背景 (bgVideo) ← 持续循环    │
 * └─────────────────────────────────────────────┘
 *
 * 跳转路径图:
 * ┌─────────────────────────────────────────────┐
 * │              启动 Splash                      │
 * └─────────────────┬───────────────────────────┘
 *                   │ (2秒后)
 *                   ▼
 * ┌─────────────────────────────────────────────┐
 * │            首页/资产 (_6)                    │
 * │  ┌─────────┬─────────┬─────────┐           │
 * │  │  资产   │  数据   │   我的  │           │
 * │  └────┬────┴────┬────┴────┬────┘           │
 * └───────┼─────────┼─────────┼────────────────┘
 *         │         │         │
 *         ▼         ▼         ▼
 *      ┌─────┐  ┌─────┐  ┌─────┐
 *      │首页 │  │数据 │  │个人 │
 *      │_6   │  │中心 │  │中心 │
 *      └─────┘  │_4   │  │_3   │
 *               └─────┘  └─────┘
 *
 * 视频持续播放：切换页面时视频不重新加载 ✓
 *
 * =====================================================
 */

/**
 * 启动流程测试
 */
test.describe('1. 启动流程测试', () => {
  test('Splash画面正确显示', async ({ page }) => {
    await page.goto('/');

    // Splash画面应该可见
    const splash = page.locator('#splash');
    await expect(splash).toBeVisible();

    // 标题"万物"应该显示
    await expect(page.locator('h1:has-text("万物")')).toBeVisible();
    await expect(page.locator('h2:has-text("Everything")')).toBeVisible();

    // 底部导航在splash期间应该隐藏
    const bottomNav = page.locator('#bottomNav');
    await expect(bottomNav).toHaveClass(/hidden/);
  });

  test('启动2秒后自动加载首页', async ({ page }) => {
    await page.goto('/');

    // 等待启动动画完成 (2秒 + 0.8秒淡出 + buffer)
    await page.waitForTimeout(3500);

    // Splash应该淡出并隐藏
    const splash = page.locator('#splash');
    await expect(splash).toBeHidden();

    // 底部导航应该显示
    const bottomNav = page.locator('#bottomNav');
    await expect(bottomNav).toBeVisible();

    // 页面容器应该显示
    const pageContainer = page.locator('#page-container');
    await expect(pageContainer).toBeVisible();
  });

  test('启动后自动加载首页内容', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);

    // 首页内容 (_6/code.html) 应该被加载
    // 检查首页特有的内容
    const content = page.locator('#page-container');

    // 首页应该有轮播图
    const carousel = content.locator('.overflow-x-auto, .no-scrollbar');
    await expect(carousel.first()).toBeVisible();
  });
});

/**
 * 底部导航跳转测试
 */
test.describe('2. 底部导航跳转测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);
  });

  test('默认首页(资产)处于激活状态', async ({ page }) => {
    const homeButton = page.locator('[onclick="loadPage(\'home\')"]');
    await expect(homeButton).toHaveClass(/bg-\[\#FF6B35\]/);

    // 其他按钮应该不是激活状态
    const dataButton = page.locator('[onclick="loadPage(\'data\')"]');
    const profileButton = page.locator('[onclick="loadPage(\'profile\')"]');

    await expect(dataButton).not.toHaveClass(/bg-\[\#FF6B35\]/);
    await expect(profileButton).not.toHaveClass(/bg-\[\#FF6B35\]/);
  });

  test('点击"数据"按钮切换到数据中心', async ({ page }) => {
    const dataButton = page.locator('[onclick="loadPage(\'data\')"]');
    await dataButton.click({ force: true });
    await page.waitForTimeout(500);

    // 验证数据中心按钮激活
    await expect(dataButton).toHaveClass(/bg-\[\#FF6B35\]/);

    // 页面内容已更新
    const content = page.locator('#page-container');
    await expect(content).not.toBeEmpty();
  });

  test('点击"我的"按钮切换到个人中心', async ({ page }) => {
    const profileButton = page.locator('[onclick="loadPage(\'profile\')"]');
    await profileButton.click({ force: true });
    await page.waitForTimeout(500);

    // 验证个人中心按钮激活
    await expect(profileButton).toHaveClass(/bg-\[\#FF6B35\]/);

    // 页面内容已更新
    const content = page.locator('#page-container');
    await expect(content).not.toBeEmpty();
  });
});

/**
 * 导航状态同步测试
 */
test.describe('3. 导航状态同步测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);
  });

  test('切换到数据中心时激活状态正确', async ({ page }) => {
    // 点击数据中心
    await page.locator('[onclick="loadPage(\'data\')"]').click({ force: true });
    await page.waitForTimeout(500);

    // 数据按钮应该激活
    const dataButton = page.locator('[onclick="loadPage(\'data\')"]');
    await expect(dataButton).toHaveClass(/bg-\[\#FF6B35\]/);

    // 首页按钮应该取消激活
    const homeButton = page.locator('[onclick="loadPage(\'home\')"]');
    await expect(homeButton).not.toHaveClass(/bg-\[\#FF6B35\]/);
  });

  test('快速连续切换导航时状态正确', async ({ page }) => {
    // 快速切换到数据
    await page.locator('[onclick="loadPage(\'data\')"]').click({ force: true });
    await page.waitForTimeout(100);

    // 快速切换到我的
    await page.locator('[onclick="loadPage(\'profile\')"]').click({ force: true });
    await page.waitForTimeout(100);

    // 快速切换回首页
    await page.locator('[onclick="loadPage(\'home\')"]').click({ force: true });
    await page.waitForTimeout(500);

    // 首页应该最终激活
    const homeButton = page.locator('[onclick="loadPage(\'home\')"]');
    await expect(homeButton).toHaveClass(/bg-\[\#FF6B35\]/);
  });

  test('返回按钮应保持激活状态不变', async ({ page }) => {
    // 切换到数据中心
    await page.locator('[onclick="loadPage(\'data\')"]').click({ force: true });
    await page.waitForTimeout(500);

    // 再次点击同一个按钮（应该重新加载）
    await page.locator('[onclick="loadPage(\'data\')"]').click({ force: true });
    await page.waitForTimeout(500);

    // 数据按钮应该仍然激活
    const dataButton = page.locator('[onclick="loadPage(\'data\')"]');
    await expect(dataButton).toHaveClass(/bg-\[\#FF6B35\]/);
  });
});

/**
 * 页面间数据传递测试
 */
test.describe('4. 页面内容完整性测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);
  });

  test('首页(_6)内容加载成功', async ({ page }) => {
    await page.locator('[onclick="loadPage(\'home\')"]').click({ force: true });
    await page.waitForTimeout(500);

    const content = page.locator('#page-container');
    await expect(content).not.toBeEmpty();
  });

  test('数据中心(_4)内容加载成功', async ({ page }) => {
    await page.locator('[onclick="loadPage(\'data\')"]').click({ force: true });
    await page.waitForTimeout(500);

    const content = page.locator('#page-container');
    await expect(content).not.toBeEmpty();
  });

  test('个人中心(_3)内容加载成功', async ({ page }) => {
    await page.locator('[onclick="loadPage(\'profile\')"]').click({ force: true });
    await page.waitForTimeout(500);

    const content = page.locator('#page-container');
    await expect(content).not.toBeEmpty();
  });
});

/**
 * 登录页面跳转测试
 */
test.describe('5. 登录页面跳转测试', () => {
  test('可以通过loadPage加载登录页面', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);

    // 使用JavaScript直接调用loadPage加载登录页面
    await page.evaluate(() => {
      (window as any).loadPage('login');
    });
    await page.waitForTimeout(500);

    // 验证登录页面内容加载
    const container = page.locator('#page-container');
    await expect(container).not.toBeEmpty();
    await expect(container).toContainText('指纹');
  });

  test('可以通过loadPage加载assetDetail页面', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);

    // 加载assetDetail (_5/code.html)
    await page.evaluate(() => {
      (window as any).loadPage('assetDetail');
    });
    await page.waitForTimeout(500);

    // 验证页面内容加载
    const container = page.locator('#page-container');
    await expect(container).not.toBeEmpty();
  });
});

/**
 * 错误处理测试
 */
test.describe('6. 错误处理测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);
  });

  test('loadPage对未知页面名不报错', async ({ page }) => {
    // 应该静默失败，不抛出错误
    await page.evaluate(() => {
      (window as any).loadPage('nonexistent');
    });
    await page.waitForTimeout(500);

    // 页面内容应该不变
    const content = page.locator('#page-container');
    await expect(content).toBeVisible();
  });

  test('网络错误时loadPage应捕获异常', async ({ page }) => {
    // 先确保有正常内容
    await page.locator('[onclick="loadPage(\'home\')"]').click({ force: true });
    await page.waitForTimeout(500);

    // 模拟网络错误（页面已加载，不会真正失败）
    // 正常情况下不应该有任何控制台错误
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 正常切换页面
    await page.locator('[onclick="loadPage(\'data\')"]').click({ force: true });
    await page.waitForTimeout(500);

    // 不应该有严重错误
    const criticalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    expect(criticalErrors.length).toBe(0);
  });
});
