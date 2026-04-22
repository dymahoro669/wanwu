import { test, expect } from '@playwright/test';

/**
 * 首页/资产页面测试用例
 * 页面路径: _6/code.html
 * 通过 SPA loadPage('home') 加载
 */
test.describe('首页/资产页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 等待启动完成
    await page.waitForTimeout(3500);
    // 通过 SPA 加载首页
    await page.evaluate(() => {
      (window as any).loadPage('home');
    });
    await page.waitForTimeout(1000);
  });

  test('页面内容加载成功', async ({ page }) => {
    const container = page.locator('#page-container');
    await expect(container).not.toBeEmpty();
  });

  test('页面包含资产相关内容', async ({ page }) => {
    const container = page.locator('#page-container');
    // 检查有文本内容
    const hasContent = await container.evaluate(el => el.textContent && el.textContent.length > 10);
    expect(hasContent).toBeTruthy();
  });

  test('底部导航按钮存在', async ({ page }) => {
    const nav = page.locator('#bottomNav');
    const buttons = nav.locator('button');
    await expect(await buttons.count()).toBeGreaterThanOrEqual(3);
  });

  test('资产按钮处于激活状态', async ({ page }) => {
    const homeButton = page.locator('[onclick="loadPage(\'home\')"]');
    await expect(homeButton).toHaveClass(/bg-\[\#FF6B35\]/);
  });
});
