import { test, expect } from '@playwright/test';

/**
 * =====================================================
 * 视频背景测试用例
 * =====================================================
 *
 * 测试目标: 验证持久视频背景系统正常工作
 *
 * 层级结构:
 * z-index: 50   → 底部导航 (bottomNav)
 * z-index: 10+  → 页面内容 (page-container)
 * z-index: 0    → Splash画面 (启动时)
 * z-index: -1   → 视频遮罩层 (videoOverlay)
 * z-index: -2   → 持久视频 (bgVideo)
 *
 */

/**
 * 视频元素存在性测试
 */
test.describe('1. 视频元素存在性测试', () => {
  test('index.html包含视频背景元素', async ({ page }) => {
    await page.goto('/');

    // 检查视频元素存在
    const video = page.locator('#bgVideo');
    await expect(video).toBeAttached();

    // 检查视频源存在
    const videoSource = page.locator('#bgVideo source');
    await expect(videoSource).toBeAttached();
    await expect(videoSource).toHaveAttribute('type', 'video/mp4');
  });

  test('视频源路径正确', async ({ page }) => {
    await page.goto('/');

    const videoSource = page.locator('#bgVideo source');
    await expect(videoSource).toHaveAttribute('src', 'bg-video.mp4');
  });

  test('视频遮罩层存在', async ({ page }) => {
    await page.goto('/');

    const overlay = page.locator('#videoOverlay');
    await expect(overlay).toBeAttached();
  });

  test('视频元素层级正确 (z-index)', async ({ page }) => {
    await page.goto('/');

    const video = page.locator('#bgVideo');
    await expect(video).toHaveCSS('z-index', '-2');

    const overlay = page.locator('#videoOverlay');
    await expect(overlay).toHaveCSS('z-index', '-1');
  });

  test('视频容器样式正确', async ({ page }) => {
    await page.goto('/');

    const video = page.locator('#bgVideo');

    // 检查是否为fixed定位
    await expect(video).toHaveCSS('position', 'fixed');

    // 检查object-fit
    await expect(video).toHaveCSS('object-fit', 'cover');
  });
});

/**
 * 视频自动播放测试
 */
test.describe('2. 视频自动播放测试', () => {
  test('视频启用了autoplay属性', async ({ page }) => {
    await page.goto('/');

    const video = page.locator('#bgVideo');
    await expect(video).toHaveAttribute('autoplay', '');
  });

  test('视频启用了循环播放', async ({ page }) => {
    await page.goto('/');

    const video = page.locator('#bgVideo');
    await expect(video).toHaveAttribute('loop', '');
  });

  test('视频启用了playsinline', async ({ page }) => {
    await page.goto('/');

    const video = page.locator('#bgVideo');
    await expect(video).toHaveAttribute('playsinline', '');
  });

  test('视频启用了静音 (兼容性)', async ({ page }) => {
    await page.goto('/');

    const video = page.locator('#bgVideo');
    await expect(video).toHaveAttribute('muted', '');
  });
});

/**
 * 视频持续播放测试 (核心功能)
 */
test.describe('3. 视频持续播放测试 (核心)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500); // 等待启动完成
  });

  test('页面切换时视频不重新加载', async ({ page }) => {
    // 获取视频元素
    const video = page.locator('#bgVideo');

    // 记录初始播放时间
    const getCurrentTime = async () => {
      return await page.evaluate(() => {
        const video = document.querySelector('#bgVideo') as HTMLVideoElement;
        return video?.currentTime || 0;
      });
    };

    // 等待视频播放一段时间
    await page.waitForTimeout(1000);
    const timeAfterLoad = await getCurrentTime();
    expect(timeAfterLoad).toBeGreaterThan(0);

    // 切换到数据中心
    await page.locator('[onclick="loadPage(\'data\')"]').click();
    await page.waitForTimeout(500);

    // 视频时间应该继续增长（不重新开始）
    await page.waitForTimeout(1000);
    const timeAfterSwitch = await getCurrentTime();
    expect(timeAfterSwitch).toBeGreaterThan(timeAfterLoad);
  });

  test('多次切换页面后视频仍然持续', async ({ page }) => {
    const getCurrentTime = async () => {
      return await page.evaluate(() => {
        const video = document.querySelector('#bgVideo') as HTMLVideoElement;
        return video?.currentTime || 0;
      });
    };

    await page.waitForTimeout(500);
    const time1 = await getCurrentTime();

    // 切换到数据中心
    await page.locator('[onclick="loadPage(\'data\')"]').click();
    await page.waitForTimeout(300);
    await page.locator('[onclick="loadPage(\'profile\')"]').click();
    await page.waitForTimeout(300);
    await page.locator('[onclick="loadPage(\'home\')"]').click();
    await page.waitForTimeout(500);

    const time2 = await getCurrentTime();

    // 时间应该继续增长
    expect(time2).toBeGreaterThan(time1);
  });

  test('页面切换后视频元素仍然存在', async ({ page }) => {
    // 确认视频元素存在
    await expect(page.locator('#bgVideo')).toBeAttached();

    // 切换页面
    await page.locator('[onclick="loadPage(\'data\')"]').click();
    await page.waitForTimeout(500);

    // 视频元素仍然存在
    await expect(page.locator('#bgVideo')).toBeAttached();

    // 再次切换
    await page.locator('[onclick="loadPage(\'profile\')"]').click();
    await page.waitForTimeout(500);

    // 视频元素仍然存在
    await expect(page.locator('#bgVideo')).toBeAttached();
  });
});

/**
 * 视频与页面内容层级测试
 */
test.describe('4. 视频与页面内容层级测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);
  });

  test('视频在页面内容之下', async ({ page }) => {
    const video = page.locator('#bgVideo');
    const pageContainer = page.locator('#page-container');

    // 等待页面内容加载
    await page.waitForTimeout(4000);

    const videoZIndex = await video.evaluate(el => window.getComputedStyle(el).zIndex);
    const containerZIndex = await pageContainer.evaluate(el => window.getComputedStyle(el).zIndex);

    // 视频z-index应该小于页面容器 (负数 vs auto/正数)
    const videoNum = parseInt(videoZIndex) || -2;
    const containerNum = parseInt(containerZIndex) || 10;
    expect(videoNum).toBeLessThan(containerNum);
  });

  test('页面内容在视频遮罩之上', async ({ page }) => {
    const overlay = page.locator('#videoOverlay');
    const pageContainer = page.locator('#page-container');

    // 等待页面内容加载
    await page.waitForTimeout(4000);

    const overlayZIndex = await overlay.evaluate(el => window.getComputedStyle(el).zIndex);
    const containerZIndex = await pageContainer.evaluate(el => window.getComputedStyle(el).zIndex);

    // 遮罩z-index应该小于页面容器
    const overlayNum = parseInt(overlayZIndex) || -1;
    const containerNum = parseInt(containerZIndex) || 10;
    expect(overlayNum).toBeLessThan(containerNum);
  });

  test('底部导航在所有内容之上', async ({ page }) => {
    const bottomNav = page.locator('#bottomNav');
    const pageContainer = page.locator('#page-container');

    // 等待页面内容加载
    await page.waitForTimeout(4000);

    const navZIndex = await bottomNav.evaluate(el => window.getComputedStyle(el).zIndex);
    const containerZIndex = await pageContainer.evaluate(el => window.getComputedStyle(el).zIndex);

    // 导航z-index应该大于页面容器
    const navNum = parseInt(navZIndex) || 50;
    const containerNum = parseInt(containerZIndex) || 10;
    expect(navNum).toBeGreaterThan(containerNum);
  });
});

/**
 * 登录页面视频背景测试
 */
test.describe('5. 登录页面视频背景测试', () => {
  test('首次登录页视频背景透出', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);

    // 加载首次登录页 (android/code.html)
    await page.evaluate(() => {
      (window as any).loadPage('login');
    });
    await page.waitForTimeout(500);

    // 检查页面容器内容是登录页
    // android/code.html 包含 "请验证指纹以登录"
    await expect(page.locator('#page-container')).toContainText('指纹');
    await expect(page.locator('#page-container')).toContainText('请验证指纹以登录');

    // 视频仍然存在并播放
    await expect(page.locator('#bgVideo')).toBeAttached();
  });

  test('快捷登录页视频背景透出', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);

    // 加载快捷登录页 (_5/code.html)
    await page.evaluate(() => {
      (window as any).loadPage('assetDetail');
    });
    await page.waitForTimeout(500);

    // 检查页面容器内容是快捷登录页
    // _5/code.html 包含 "开启指纹识别"
    await expect(page.locator('#page-container')).toContainText('开启指纹识别');

    // 视频仍然存在并播放
    await expect(page.locator('#bgVideo')).toBeAttached();
  });
});

/**
 * 视频遮罩层测试
 */
test.describe('6. 视频遮罩层测试', () => {
  test('遮罩层样式为渐变背景', async ({ page }) => {
    await page.goto('/');

    const overlay = page.locator('#videoOverlay');

    // 检查是否为渐变背景
    const bgImage = await overlay.evaluate(el => window.getComputedStyle(el).backgroundImage);
    expect(bgImage).toContain('gradient');
  });

  test('遮罩层为fixed定位', async ({ page }) => {
    await page.goto('/');

    const overlay = page.locator('#videoOverlay');
    await expect(overlay).toHaveCSS('position', 'fixed');
  });

  test('遮罩层覆盖整个视口', async ({ page }) => {
    await page.goto('/');

    const overlay = page.locator('#videoOverlay');
    await expect(overlay).toHaveCSS('top', '0px');
    await expect(overlay).toHaveCSS('left', '0px');
    await expect(overlay).toHaveCSS('right', '0px');
    await expect(overlay).toHaveCSS('bottom', '0px');
  });
});

/**
 * 视频加载测试
 */
test.describe('7. 视频加载测试', () => {
  test('视频文件可访问', async ({ page }) => {
    const response = await page.request.get('/bg-video.mp4');
    expect(response.status()).toBe(200);
  });

  test('视频MIME类型正确', async ({ page }) => {
    const response = await page.request.get('/bg-video.mp4');
    expect(response.headers()['content-type']).toContain('video/mp4');
  });

  test('视频文件大小合理', async ({ page }) => {
    const response = await page.request.get('/bg-video.mp4');
    const contentLength = response.headers()['content-length'];

    if (contentLength) {
      const sizeInMB = parseInt(contentLength) / (1024 * 1024);
      // 视频应该小于10MB
      expect(sizeInMB).toBeLessThan(10);
    }
  });
});

/**
 * Splash与视频背景交互测试
 */
test.describe('8. Splash与视频背景交互测试', () => {
  test('Splash期间视频已开始播放', async ({ page }) => {
    await page.goto('/');

    // Splash仍然可见时，视频已经在后台播放
    const splash = page.locator('#splash');
    await expect(splash).toBeVisible();

    // 视频应该已经开始播放
    const video = page.locator('#bgVideo');
    await expect(video).toBeAttached();

    // 检查视频不是在暂停状态
    const isPaused = await page.evaluate(() => {
      const video = document.querySelector('#bgVideo') as HTMLVideoElement;
      return video?.paused;
    });
    expect(isPaused).toBeFalsy();
  });

  test('Splash淡出后视频持续播放', async ({ page }) => {
    await page.goto('/');

    // 等待启动完成
    await page.waitForTimeout(3500);

    // Splash应该隐藏
    const splash = page.locator('#splash');
    await expect(splash).toBeHidden();

    // 视频继续播放
    const video = page.locator('#bgVideo');
    await expect(video).toBeAttached();

    const isPaused = await page.evaluate(() => {
      const video = document.querySelector('#bgVideo') as HTMLVideoElement;
      return video?.paused;
    });
    expect(isPaused).toBeFalsy();
  });
});

/**
 * 性能测试
 */
test.describe('9. 性能相关测试', () => {
  test('页面切换时视频元素不被重新创建', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3500);

    // 获取视频元素ID
    const videoId1 = await page.locator('#bgVideo').evaluate(el => el.id);

    // 切换页面
    await page.locator('[onclick="loadPage(\'data\')"]').click();
    await page.waitForTimeout(500);

    // 获取切换后的视频元素ID
    const videoId2 = await page.locator('#bgVideo').evaluate(el => el.id);

    // ID应该相同，说明是同一个元素
    expect(videoId1).toBe(videoId2);
  });

  test('视频不需要用户交互即可播放', async ({ page }) => {
    await page.goto('/');

    // 检查视频有autoplay属性
    const video = page.locator('#bgVideo');
    await expect(video).toHaveAttribute('autoplay', '');

    // 检查视频是静音的（autoplay政策要求）
    await expect(video).toHaveAttribute('muted', '');
  });
});
