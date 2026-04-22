# 万物 App 测试用例

## 测试结果

**63 个测试全部通过** ✓

## 测试文件

| 文件 | 描述 | 测试数量 |
|------|------|----------|
| `pageNavigation.spec.ts` | SPA导航集成测试 | 14 |
| `pages.home.spec.ts` | 首页/资产页面测试 | 4 |
| `pages.login.spec.ts` | 登录页测试 | 4 |
| `pages.quickLogin.spec.ts` | 快捷登录页测试 | 4 |
| `pages.data.spec.ts` | 数据中心页测试 | 4 |
| `pages.profile.spec.ts` | 个人中心页测试 | 4 |
| `videoBackground.spec.ts` | **视频背景系统测试** | **29** |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 安装 Playwright 浏览器

```bash
npx playwright install chromium
```

### 3. 运行测试

```bash
# 运行所有测试
npm test

# 使用 UI 模式运行（推荐）
npm run test:ui

# 可见浏览器运行
npm run test:headed

# 查看测试报告
npm run test:report
```

## 测试覆盖

### 页面覆盖

| 页面 | 文件路径 | 路由键 | SPA加载方式 |
|------|----------|--------|------------|
| 首页/资产 | `_6/code.html` | `home` | `loadPage('home')` |
| 数据中心 | `_4/code.html` | `data` | `loadPage('data')` |
| 个人中心 | `_3/code.html` | `profile` | `loadPage('profile')` |
| 首次登录 | `android/code.html` | `login` | `loadPage('login')` |
| 快捷登录 | `_5/code.html` | `assetDetail` | `loadPage('assetDetail')` |

### 功能覆盖

- [x] 页面加载和内容验证
- [x] 底部导航切换
- [x] SPA 路由跳转
- [x] 激活状态同步
- [x] 错误处理

### 视频背景测试覆盖 (29个测试)

| 测试组 | 测试项 | 描述 |
|--------|--------|------|
| **1. 元素存在性** | 视频元素 | 验证video、source、遮罩层存在 |
| | 属性检查 | autoplay、loop、playsinline、muted |
| | 层级关系 | z-index正确 |
| | 容器样式 | fixed定位、object-fit: cover |
| **2. 自动播放** | autoplay | 视频自动开始播放 |
| | 循环播放 | 视频持续循环 |
| | 静音设置 | 符合autoplay政策 |
| **3. 持续播放** | 页面切换 | 切换时视频不重新加载 ✓ |
| | 时间增长 | 视频时间持续增长 |
| | 元素保持 | 多次切换后video元素仍存在 |
| **4. 层级关系** | 视频<内容 | 视频在页面内容之下 |
| | 遮罩<内容 | 遮罩层在内容之下 |
| | 导航>内容 | 底部导航在最上层 |
| **5. 登录页** | 首次登录 | 视频背景透出 |
| | 快捷登录 | 视频背景透出 |
| **6. 遮罩层** | 渐变样式 | 渐变背景确保文字可读 |
| | 定位覆盖 | fixed定位覆盖整个视口 |
| **7. 视频加载** | 可访问性 | /bg-video.mp4 返回200 |
| | MIME类型 | content-type正确 |
| | 文件大小 | 小于10MB |
| **8. Splash交互** | 启动期间 | Splash期间视频已播放 |
| | 淡出后 | Splash淡出视频持续 |
| **9. 性能** | 元素复用 | 切换时video元素不重建 |
| | 无需交互 | autoplay+muted无需用户交互 |

## 页面跳转逻辑

```
启动 → Splash(2秒) → 首页(_6)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
      资产(_6)        数据(_4)         我的(_3)
```

## 视频背景层级结构

```
z-index: 50    ┌─────────────────────────┐
               │ 底部导航 (bottomNav)      │
               ├─────────────────────────┤
z-index: 10+  │ 页面内容 (page-container) │
               │ 视频持续播放，不中断     │
               ├─────────────────────────┤
z-index: -1   │ 视频遮罩 (videoOverlay)  │
               ├─────────────────────────┤
z-index: -2   │ 持久视频 (bgVideo)        │
               │ 自动循环播放 ←─────────┘
               └─────────────────────────┘
```

## 配置说明

测试配置位于 `playwright.config.ts`：
- 基础 URL: `http://localhost:3000`
- 模拟设备: Pixel 5
- Web 服务器: 自动启动 `npm run dev`

## 注意事项

1. 运行测试前确保 3000 端口未被占用
2. 测试会自动启动开发服务器
3. 截图只在测试失败时保存
4. 视频背景测试需要视频文件 `public/bg-video.mp4` 存在
5. 子页面通过 SPA 的 `loadPage()` 加载，而非直接访问 HTML 文件
