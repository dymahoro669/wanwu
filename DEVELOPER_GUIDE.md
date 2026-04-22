# 万物 App (Wanwu) 产品开发手册

> 万物皆资产 · 惠及你我他
>
> 版本：1.0.0
> 更新日期：2026-04-22
> 仓库：https://github.com/dymahoro669/wanwu

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构](#2-技术架构)
3. [项目结构](#3-项目结构)
4. [快速开始](#4-快速开始)
5. [页面系统](#5-页面系统)
6. [设计规范](#6-设计规范)
7. [组件开发](#7-组件开发)
8. [构建与部署](#8-构建与部署)
9. [Android原生集成](#9-android原生集成)
10. [测试](#10-测试)
11. [常见问题](#11-常见问题)

---

## 1. 项目概述

### 1.1 项目简介

**万物 (Everything)** — 企业内部资产交易中心 App，基于 Capacitor 构建的跨平台移动应用。

### 1.2 核心功能

| 功能 | 描述 |
|------|------|
| 启动页 | 3秒品牌展示，自动过渡 |
| 视频背景 | 持久循环播放的沉浸式背景 |
| 指纹登录 | 生物识别快速认证 |
| 密码登录 | 用户名+密码传统登录 |
| 资产浏览 | Banner轮播、分类筛选、卡片展示 |
| 数据中心 | 统计看板、排行榜、成就系统 |
| 个人中心 | 用户信息、等级权益、服务入口 |

### 1.3 目标平台

- Android (主要)
- iOS (待适配)

---

## 2. 技术架构

### 2.1 技术栈

```
┌─────────────────────────────────────────────────────────┐
│                      移动设备                             │
├─────────────────────────────────────────────────────────┤
│  Capacitor Runtime (原生桥接)                           │
├─────────────────────────────────────────────────────────┤
│  Web View (渲染 HTML/CSS/JS)                             │
│  ├── Tailwind CSS (样式)                                 │
│  ├── Vanilla JS (交互逻辑)                               │
│  └── Vite (构建工具)                                     │
├─────────────────────────────────────────────────────────┤
│  Native Layer (Android/iOS 原生功能)                     │
│  ├── 指纹识别                                            │
│  ├── 通知推送                                            │
│  └── 文件系统                                            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 核心依赖

```json
{
  "dependencies": {
    "@capacitor/android": "^8.3.1",
    "@capacitor/core": "^8.3.1",
    "@capacitor/cli": "^8.3.1"
  },
  "devDependencies": {
    "vite": "^8.0.9",
    "@playwright/test": "^1.40.0"
  }
}
```

---

## 3. 项目结构

```
wanwu-app/
├── index.html              # SPA 主入口 (Shell)
├── vite.config.js          # Vite 构建配置
├── package.json            # 依赖管理
├── playwright.config.ts    # E2E 测试配置
│
├── public/                 # 静态资源 (源文件)
│   ├── _6/code.html        # 首页/资产页
│   ├── _4/code.html        # 数据中心
│   ├── _2/code.html        # 个人中心
│   ├── _1/code.html        # 页面1
│   ├── _3/code.html        # 页面3
│   ├── _5/code.html        # 快捷登录
│   ├── android/code.html   # 首次登录验证
│   ├── v4/code.html        # 资产详情页
│   ├── P1/code.html        # 密码登录页
│   ├── splash_screen/      # 启动页
│   ├── bg-video.mp4        # 视频背景
│   └── *.png               # 启动图、图标等
│
├── dist/                   # 构建输出目录
│   ├── index.html          # 入口页面
│   ├── _6/code.html        # 资产页构建产物
│   ├── android/            # Android 壳页面
│   └── ...                 # 其他页面
│
├── android/                # Capacitor Android 项目
│   └── app/src/main/       # Android 源码
│       ├── java/           # Java 代码
│       └── res/            # 资源文件
│
├── tests/                  # Playwright E2E 测试
├── docs/                   # 产品设计文档
└── playwright-report/      # 测试报告
```

---

## 4. 快速开始

### 4.1 环境要求

- Node.js >= 18
- Android Studio (Android 开发)
- JDK 17+ (Android 构建)

### 4.2 安装依赖

```bash
npm install
```

### 4.3 开发预览

```bash
npm run dev        # 启动开发服务器 (端口 3000)
```

### 4.4 构建

```bash
npm run build      # 构建生产版本到 dist/
```

### 4.5 Android 开发

```bash
# 1. 添加 Android 平台
npx cap add android

# 2. 同步 Web 资源到 Android
npx cap sync android

# 3. 打开 Android Studio
npx cap open android
```

### 4.6 安装到设备

```bash
# 在 Android 项目目录构建 APK
cd android
./gradlew assembleDebug

# 安装到已连接设备
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

---

## 5. 页面系统

### 5.1 SPA 架构

应用采用**单页应用 (SPA)** 架构，主入口 `index.html` 作为 Shell，通过 JavaScript 动态加载各页面 HTML 片段。

```
┌─────────────────────────────────────────┐
│              index.html                 │
│  ┌───────────────────────────────────┐  │
│  │         视频背景 (z-2)             │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │       启动画面 Splash (z-50)      │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │     页面容器 (动态加载 HTML)       │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │       底部导航 (z-50)             │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 5.2 页面路由映射

| 路由键 | 文件路径 | 页面标题 | 描述 |
|--------|----------|----------|------|
| `home` | `dist/_6/code.html` | Everything - Home | 首页/资产列表 |
| `data` | `dist/_4/code.html` | 数据中心 | 数据统计 |
| `profile` | `dist/_2/code.html` | 个人中心 | 用户信息 |
| `login` | `dist/android/code.html` | Fingerprint Login | 指纹登录 |
| `passwordLogin` | `dist/P1/code.html` | 登录 - 万物 | 密码登录 |
| `assetDetail` | `dist/v4/code.html` | 资产详情 | 资产详情页 |

### 5.3 页面加载机制

```javascript
// index.html 中的页面加载逻辑
const pages = {
    'login': 'android/code.html',
    'passwordLogin': 'P1/code.html',
    'home': '_6/code.html',
    'assetDetail': 'v4/code.html',
    'profile': '_2/code.html',
    'data': '_4/code.html'
};

async function loadPage(name) {
    const path = pages[name];
    if (!path) return;

    // 动态获取 HTML
    const res = await fetch(path);
    const html = await res.text();

    // 注入到页面容器
    document.getElementById('page-container').innerHTML = html;
}
```

### 5.4 启动流程

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  显示启动画面 Splash (3秒)                        │
│  ├── Logo "万物" + "Everything"                  │
│  └── Slogan "万物皆资产 · 惠及你我他"             │
│                                                 │
│  ▼                                              │
│                                                 │
│  淡出动画 (0.8秒)                                │
│                                                 │
│  ▼                                              │
│                                                 │
│  加载登录页 (login)                              │
│  └── 视频背景持续播放                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 6. 设计规范

### 6.1 色彩系统

#### 主色调

| 名称 | 色值 | 用途 |
|------|------|------|
| Primary | `#AB3500` | 标题、强调 |
| Primary Container | `#FF6B35` | 按钮、卡片背景 |
| On Primary | `#FFFFFF` | 按钮文字 |

#### 辅助色

| 名称 | 色值 | 用途 |
|------|------|------|
| Secondary | `#6D5B46` | 次要文字、图标 |
| Tertiary | `#00677E` | 链接、标签 |

#### 表面色

| 名称 | 色值 | 用途 |
|------|------|------|
| Background | `#FFF8F6` | 页面背景 |
| Surface Container | `#FFE9E3` | 容器背景 |
| Surface Container Lowest | `#FFFFFF` | 卡片背景 |

#### 文字色

| 名称 | 色值 | 用途 |
|------|------|------|
| On Surface | `#261814` | 主要文字 |
| On Surface Variant | `#594139` | 次要文字 |
| Outline | `#8D7168` | 边框线 |

### 6.2 字体系统

| 类型 | 字体 | 用途 |
|------|------|------|
| Display | Noto Serif SC 700 | 大标题 (40px) |
| Headline | Noto Serif SC 600 | 页面标题 (28px) |
| Body | Manrope 400 | 正文 (16-18px) |
| Label | Manrope 600 | 标签、按钮 (12px) |

### 6.3 圆角系统

| 名称 | 数值 | 用途 |
|------|------|------|
| DEFAULT | 1rem (16px) | 按钮、输入框 |
| lg | 2rem (32px) | - |
| xl | 3rem (48px) | - |
| full | 9999px | 胶囊按钮、导航选中 |

### 6.4 间距系统

| 名称 | 数值 | 用途 |
|------|------|------|
| unit | 8px | 基础间距 |
| gutter | 16px | 元素间距 |
| container-padding | 24px | 容器内边距 |
| section-gap | 48px | 区块间距 |

### 6.5 图标

使用 Material Symbols Outlined：

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" rel="stylesheet">
```

常用图标：

| 图标 | 用途 |
|------|------|
| `token` | 资产 |
| `analytics` | 数据中心 |
| `person` | 个人中心 |
| `fingerprint` | 指纹验证 |
| `search` | 搜索 |
| `star` | 评分 |
| `arrow_forward` | 箭头 |

---

## 7. 组件开发

### 7.1 页面模板

每个页面是独立的 HTML 文件，包含完整的 Head 和 Body：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>页面标题 - 万物</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/..." rel="stylesheet"/>
    <!-- Tailwind 配置 -->
    <script id="tailwind-config">
        tailwind.config = {
            theme: {
                extend: {
                    colors: { /* 颜色定义 */ },
                    fontFamily: { /* 字体定义 */ }
                }
            }
        }
    </script>
</head>
<body class="bg-surface text-on-surface">
    <!-- 页面内容 -->
</body>
</html>
```

### 7.2 资产卡片组件

```html
<article class="mb-8 flex flex-col bg-white rounded-[24px] overflow-hidden shadow-md">
    <!-- 图片 -->
    <div class="relative aspect-[16/9] w-full bg-surface-variant overflow-hidden">
        <img class="w-full h-full object-cover" src="..."/>
    </div>

    <!-- 内容 -->
    <div class="p-4 flex flex-col gap-2 bg-white/80">
        <h3 class="font-headline-md text-[16px]">资产标题</h3>

        <div class="flex items-center gap-1 text-secondary font-label-sm text-[11px]">
            <span class="material-symbols-outlined text-[12px]">star</span>
            <span>4.9 (12)</span>
        </div>

        <div class="flex justify-between items-center">
            <span class="text-primary font-semibold">¥50<span class="text-[12px]">/天</span></span>
            <button class="rounded-full bg-[#ab3500] text-white px-4 py-2">预约</button>
        </div>
    </div>
</article>
```

### 7.3 底部导航组件

```html
<nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[448px] rounded-[32px] z-50 bg-[#0A0A0A]">
    <div class="flex justify-around items-center h-16">
        <button onclick="loadPage('home')" class="nav-btn ...">
            <span class="material-symbols-outlined">token</span>
            <span class="text-[10px]">资产</span>
        </button>
        <!-- 其他按钮... -->
    </div>
</nav>
```

### 7.4 Banner 轮播组件

```html
<div class="relative w-full h-[55vh]" style="margin-left: calc(-1 * 24px); width: calc(100% + 48px);">
    <div class="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar" id="bannerCarousel">
        <!-- 幻灯片 1 -->
        <div class="snap-center shrink-0 w-full h-full relative">
            <img class="w-full h-full object-cover" src="..."/>
            <!-- 渐变遮罩 -->
            <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#F2EDE6]"></div>
            <!-- 内容 -->
            <div class="absolute bottom-[100px] left-6 right-6">
                <h2>标题</h2>
                <p>描述</p>
            </div>
        </div>
    </div>
</div>
```

---

## 8. 构建与部署

### 8.1 开发构建

```bash
# 开发预览
npm run dev

# 构建生产版本
npm run build
```

构建产物输出到 `dist/` 目录。

### 8.2 Android 构建

```bash
# 同步到 Android
npx cap sync android

# 构建 Debug APK
cd android
./gradlew assembleDebug

# 构建 Release APK
./gradlew assembleRelease
```

### 8.3 部署流程

```
1. 修改源代码 (public/ 目录)
       │
       ▼
2. npm run build
       │
       ▼
3. npx cap sync android
       │
       ▼
4. ./gradlew assembleDebug
       │
       ▼
5. adb install -r app-debug.apk
```

---

## 9. Android 原生集成

### 9.1 项目配置

主要配置文件位于 `android/app/src/main/`：

| 文件 | 用途 |
|------|------|
| `AndroidManifest.xml` | 应用权限、Activity 配置 |
| `MainActivity.java` | 主 Activity |
| `res/values/strings.xml` | 字符串资源 |
| `res/values/styles.xml` | 主题样式 |

### 9.2 Capacitor 配置

`capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wanwu.app',
  appName: '万物',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

### 9.3 应用图标

图标文件位于 `android/app/src/main/res/mipmap-*/` 目录。

### 9.4 启动画面

启动图位于 `android/app/src/main/res/drawable*/splash.png`。

---

## 10. 测试

### 10.1 E2E 测试

```bash
# 运行所有测试
npm test

# UI 模式运行
npm run test:ui

# 带浏览器运行
npm run test:headed

# 查看测试报告
npm run test:report
```

### 10.2 测试文件

测试位于 `tests/` 目录：

| 文件 | 测试内容 |
|------|----------|
| `pageNavigation.spec.ts` | 页面导航 |
| `pages.login.spec.ts` | 登录流程 |
| `pages.home.spec.ts` | 首页功能 |
| `videoBackground.spec.ts` | 视频背景 |

---

## 11. 常见问题

### 11.1 视频背景不显示

检查：
1. 视频文件是否在 `dist/` 目录
2. 文件名是否正确 (bg-video.mp4)
3. 视频是否静音 (autoplay 需要 muted)

### 11.2 页面切换闪烁

原因：页面内容加载时视频被重新初始化。

解决：视频和遮罩层放在主 Shell 中，不随页面切换变化。

### 11.3 图标不显示

检查 Google Fonts 链接是否正确：

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" rel="stylesheet"/>
```

### 11.4 Android 构建失败

1. 检查 JDK 版本 (需要 17+)
2. 清理构建缓存：
   ```bash
   cd android
   ./gradlew clean
   ```
3. 删除 `android/.gradle` 重新构建

### 11.5 样式不生效

检查 Tailwind CDN 链接：

```html
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
```

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.0.0 | 2026-04-22 | 初始版本：登录、首页、数据中心、个人中心 |

---

*手册结束*
