import { test, expect } from '@playwright/test';

/**
 * 个人中心页面测试用例
 * 页面路径: _3/code.html
 * 通过 SPA loadPage('profile') 加载
 */
test.describe('个人中心页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 等待启动完成
    await page.waitForTimeout(3500);
    // 通过 SPA 加载个人中心
    await page.evaluate(() => {
      (window as any).loadPage('profile');
    });
    await page.waitForTimeout(1000);
  });

  test('页面内容加载成功', async ({ page }) => {
    const container = page.locator('#page-container');
    await expect(container).not.toBeEmpty();
  });

  test('页面包含个人中心相关内容', async ({ page }) => {
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

  test('我的按钮处于激活状态', async ({ page }) => {
    const profileButton = page.locator('[onclick="loadPage(\'profile\')"]');
    await expect(profileButton).toHaveClass(/bg-\[\#FF6B35\]/);
  });
});
