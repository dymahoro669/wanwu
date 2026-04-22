import { test, expect } from '@playwright/test';

/**
 * 登录页面测试用例
 * 页面路径: android/code.html
 * 通过 SPA loadPage('login') 加载
 */
test.describe('登录页面 - 首次开启指纹识别', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 等待启动完成
    await page.waitForTimeout(3500);
    // 通过 SPA 加载登录页
    await page.evaluate(() => {
      (window as any).loadPage('login');
    });
    await page.waitForTimeout(1000);
  });

  test('页面内容加载成功', async ({ page }) => {
    // 检查页面容器有内容
    const container = page.locator('#page-container');
    await expect(container).not.toBeEmpty();
  });

  test('登录页包含指纹相关内容', async ({ page }) => {
    const container = page.locator('#page-container');
    // android/code.html 包含 "请验证指纹以登录" 或 "指纹"
    const hasContent = await container.evaluate(el => el.textContent?.includes('指纹') || el.textContent?.includes('Fingerprint'));
    expect(hasContent).toBeTruthy();
  });

  test('登录页包含按钮', async ({ page }) => {
    const container = page.locator('#page-container');
    const hasButton = await container.locator('button').count();
    expect(hasButton).toBeGreaterThan(0);
  });

  test('登录页包含指纹图标', async ({ page }) => {
    const container = page.locator('#page-container');
    // 查找 fingerprint 相关内容
    const hasFingerprint = await container.evaluate(el => el.textContent?.includes('fingerprint') || el.innerHTML.includes('fingerprint'));
    expect(hasFingerprint).toBeTruthy();
  });
});
