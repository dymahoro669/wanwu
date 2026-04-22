import { test, expect } from '@playwright/test';

/**
 * 快捷登录页面测试用例
 * 页面路径: _5/code.html (实际是"首次开启指纹识别"页面)
 * 通过 SPA loadPage('assetDetail') 加载
 */
test.describe('快捷登录页面 - 首次开启指纹识别', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 等待启动完成
    await page.waitForTimeout(3500);
    // 通过 SPA 加载快捷登录页
    await page.evaluate(() => {
      (window as any).loadPage('assetDetail');
    });
    await page.waitForTimeout(1000);
  });

  test('页面内容加载成功', async ({ page }) => {
    const container = page.locator('#page-container');
    await expect(container).not.toBeEmpty();
  });

  test('页面包含指纹相关内容', async ({ page }) => {
    const container = page.locator('#page-container');
    // _5/code.html 包含 "指纹" 相关内容
    const hasContent = await container.evaluate(el => el.textContent?.includes('指纹'));
    expect(hasContent).toBeTruthy();
  });

  test('页面包含表单元素', async ({ page }) => {
    const container = page.locator('#page-container');
    const hasInput = await container.locator('input').count();
    expect(hasInput).toBeGreaterThan(0);
  });

  test('页面包含按钮', async ({ page }) => {
    const container = page.locator('#page-container');
    const hasButton = await container.locator('button').count();
    expect(hasButton).toBeGreaterThan(0);
  });
});
