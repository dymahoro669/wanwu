# 万物 - Everything
## 产品设计文档 V8.0

> 万物皆资产 · 惠及你我他
>
> 版本：V8.0
> 更新日期：2026-04-22
> 文档类型：产品设计规范

---

## 目录

1. [设计理念](#1-设计理念)
2. [设计系统](#2-设计系统)
3. [视频背景系统](#3-视频背景系统)
4. [页面架构](#4-页面架构)
5. [页面设计](#5-页面设计)
6. [组件库](#6-组件库)
7. [交互流程](#7-交互流程)
8. [技术规范](#8-技术规范)

---

## 1. 设计理念

### 1.1 品牌定位

**万物（Everything）** — 企业内部资产交易中心，旨在盘活闲置资源，促进知识与资源共享。

### 1.2 设计原则

| 原则 | 说明 |
|------|------|
| **温暖可信** | 使用暖色调（#FF6B35）传递温度与活力 |
| **简洁高效** | 去除多余装饰，聚焦核心功能 |
| **视觉统一** | 全局视频背景，沉浸式体验 |
| **流畅动效** | 视频持续播放，页面切换无闪烁 |

### 1.3 用户群体

- 企业内部员工
- 资产管理者
- 资源共享需求者

---

## 2. 设计系统

### 2.1 色彩系统

#### 主色调

| 名称 | 色值 | 用途 |
|------|------|------|
| Primary | `#AB3500` | 标题、强调文字 |
| Primary Container | `#FF6B35` | 按钮、卡片背景 |
| On Primary | `#FFFFFF` | 按钮文字 |

#### 辅助色

| 名称 | 色值 | 用途 |
|------|------|------|
| Secondary | `#6D5B46` | 次要文字、图标 |
| Tertiary | `#00677E` | 链接、标签 |
| Error | `#BA1A1A` | 错误提示 |

#### 表面色

| 名称 | 色值 | 用途 |
|------|------|------|
| Background | `#FFF8F6` | 页面背景 |
| Surface | `#FFF8F6` | 卡片背景 |
| Surface Container | `#FFE9E3` | 容器背景 |
| Surface Container High | `#FDE3DB` | 高容器背景 |
| Surface Container Low | `#FFF1ED` | 低容器背景 |
| Surface Container Lowest | `#FFFFFF` | 最顶层背景 |

#### 文字色

| 名称 | 色值 | 用途 |
|------|------|------|
| On Background | `#261814` | 主要文字 |
| On Surface Variant | `#594139` | 次要文字 |
| Outline | `#8D7168` | 边框线 |

### 2.2 字体系统

| 类型 | 字体 | 字重 | 用途 |
|------|------|------|------|
| Display | Noto Serif SC | 700 | 大标题 |
| Headline | Noto Serif SC | 600 | 页面标题 |
| Body | Manrope | 400 | 正文内容 |
| Label | Manrope | 600 | 标签、按钮 |

### 2.3 圆角系统

| 名称 | 数值 | 用途 |
|------|------|------|
| DEFAULT | 1rem (16px) | 按钮、输入框 |
| lg | 2rem (32px) | 卡片 |
| xl | 3rem (48px) | 弹窗 |
| full | 9999px | 胶囊按钮 |

### 2.4 间距系统

| 名称 | 数值 | 用途 |
|------|------|------|
| unit | 8px | 基础间距单位 |
| gutter | 16px | 元素间距 |
| container-padding | 24px | 容器内边距 |
| section-gap | 48px | 区块间距 |

### 2.5 阴影系统

```css
/* 柔和阴影 */
box-shadow: 0 4px 20px -2px rgba(109, 91, 70, 0.08);

/* 卡片阴影 */
box-shadow: 0 8px 24px rgba(109, 91, 70, 0.06);

/* 底部导航阴影 */
box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
```

### 2.6 图标系统

使用 **Material Symbols Outlined** 图标库：

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" rel="stylesheet">
```

常用图标：

| 图标名称 | 用途 |
|----------|------|
| `token` | 资产 |
| `analytics` | 数据中心 |
| `person` | 个人中心 |
| `fingerprint` | 指纹验证 |
| `qr_code_scanner` | 扫码 |
| `notifications` | 通知 |
| `search` | 搜索 |
| `star` | 评分 |
| `arrow_forward` | 箭头 |

---

## 3. 视频背景系统

### 3.1 设计概述

V8.0 引入**持久视频背景系统**，实现页面切换时背景动画持续播放的沉浸式体验。

### 3.2 技术实现

```html
<!-- 1. 持久视频背景 - z-index: -2 -->
<video id="bgVideo" autoplay loop muted playsinline class="fixed inset-0 w-full h-full object-cover z-[-2]">
    <source src="bg-video.mp4" type="video/mp4">
</video>

<!-- 2. 视频遮罩层 - z-index: -1 -->
<div id="videoOverlay" class="fixed inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50 z-[-1]"></div>

<!-- 3. 页面容器 - z-index: 0+ -->
<div id="page-container" class="min-h-screen pb-24"></div>
```

### 3.3 层级结构

```
z-index: 50    ┌─────────────────┐
              │    底部导航      │
z-index: 10+  ├─────────────────┤
              │   页面内容      │
              │ (动态注入HTML)  │
z-index: 0    ├─────────────────┤
              │   启动画面      │
              │  (Splash 2s)   │
z-index: -1   ├─────────────────┤
              │   视频遮罩层   │
z-index: -2   ├─────────────────┤
              │   持久视频     │
              │ (持续循环播放) │
              └─────────────────┘
```

### 3.4 视频规格

| 参数 | 值 |
|------|------|
| 文件名 | `bg-video.mp4` |
| 格式 | MP4 (H.264) |
| 建议分辨率 | 1080x1920 或更高 |
| 建议时长 | 10-30秒循环 |
| 循环模式 | 无缝循环 |
| 静音 | 必须 (autoplay政策) |

### 3.5 遮罩配置

```css
/* 渐变遮罩确保文字可读性 */
background: linear-gradient(
  to bottom,
  rgba(0,0,0,0.30) 0%,   /* 顶部30%透明度 */
  rgba(0,0,0,0.20) 50%,  /* 中间20%透明度 */
  rgba(0,0,0,0.50) 100%  /* 底部50%透明度 */
);
```

### 3.6 页面背景设置

登录页和指纹识别页需要移除自带背景：

```html
<!-- 移除前 -->
<body class="bg-background">
  <img class="absolute inset-0 ..." />
  <div class="absolute inset-0 bg-gradient..." />
</body>

<!-- 移除后 -->
<body class="bg-transparent">
  <!-- 视频背景由父容器提供 -->
</body>
```

---

## 4. 页面架构

### 4.1 SPA架构

采用**单页应用（SPA）**架构，通过 JavaScript 动态加载页面内容：

```
┌─────────────────────────────────────────────────────────┐
│                      index.html                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              持久视频背景 (bgVideo)              │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              启动画面 (Splash)                   │   │
│  │              - 2秒后淡出                         │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              页面容器 (page-container)          │   │
│  │              - 动态加载HTML片段                  │   │
│  │              - _6/code.html                     │   │
│  │              - _4/code.html                     │   │
│  │              - _3/code.html                     │   │
│  │              - _5/code.html                     │   │
│  │              - android/code.html                │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │              底部导航 (bottomNav)               │   │
│  │              - 资产 | 数据 | 我的               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4.2 页面路由映射

| 路由键 | 文件路径 | 页面标题 | 描述 |
|--------|----------|----------|------|
| `home` | `_6/code.html` | Everything - Home | 首页/资产列表 |
| `data` | `_4/code.html` | 数据中心 - 万物 | 数据统计中心 |
| `profile` | `_3/code.html` | Everything - Home | 个人中心 |
| `assetDetail` | `_5/code.html` | 开启快捷登录 | 快捷登录页 |
| `login` | `android/code.html` | 首次开启指纹识别 | 首次登录验证 |

### 4.3 启动流程

```
用户打开App
    │
    ▼
显示Splash画面 (z-index: 50)
    │
    ├── 显示Logo "万物" + "Everything"
    ├── 显示Slogan "万物皆资产 · 惠及你我他"
    │
    ▼ (2秒后)
淡出动画 (0.8秒)
    │
    ▼
隐藏Splash，显示页面容器和底部导航
    │
    ▼
自动加载首页 (loadPage('home'))
    │
    ▼
视频背景持续循环播放 ▼
```

---

## 5. 页面设计

### 5.1 首页/资产页 (_6/code.html)

**文件**: `public/_6/code.html`
**路由**: `home`
**标题**: "Everything - Home"

#### 布局结构

```
┌─────────────────────────────────────────┐
│  顶部导航栏 (z-40)                       │
│  [扫码]        万物        [通知]        │
├─────────────────────────────────────────┤
│                                         │
│  搜索栏 (z-40)                          │
│  [🔍 搜索资产、创建者或标签    ][搜索]  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  分类标签横向滚动                        │
│  [全部][办公工具][专业文档][场地租借]... │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     精选推荐卡片 (全宽)          │   │
│  │     [图片]                       │   │
│  │     全套高级办公设备租赁计划      │   │
│  │     陈主管 · 5.0 · 企业服务部    │   │
│  │     ¥299/年起              [预约]│   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────┐  ┌─────────┐              │
│  │MacBook  │  │品牌设计 │              │
│  │Pro      │  │系统文档 │              │
│  │¥50/天   │  │免费     │              │
│  │[预约]   │  │[领取]   │              │
│  └─────────┘  └─────────┘              │
│                                         │
│  ┌─────────┐  ┌─────────┐              │
│  │研讨室   │  │Python   │              │
│  │¥100/时  │  │辅导     │              │
│  │[预约]   │  │[领取]   │              │
│  └─────────┘  └─────────┘              │
│                                         │
│           (更多资产卡片...)              │
│                                         │
└─────────────────────────────────────────┘
           ┌─────────────────┐
           │ 资产 │ 数据 │ 我的 │  ← 底部导航
           └─────────────────┘
```

#### 组件规格

| 组件 | 类名 | 描述 |
|------|------|------|
| 顶部栏 | `h-24 pt-8` | 距顶部24px |
| 搜索栏 | `rounded-2xl` | 圆角32px |
| 分类按钮 | `rounded-full` | 胶囊形状 |
| 精选卡片 | `rounded-[24px]` | 大圆角24px |
| 资产卡片 | `rounded-[24px]` | 大圆角24px |

### 5.2 数据中心页 (_4/code.html)

**文件**: `public/_4/code.html`
**路由**: `data`
**标题**: "数据中心 - 万物"

#### 布局结构

```
┌─────────────────────────────────────────┐
│  顶部导航栏                              │
│  [扫码]      数据中心        [通知]      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     资产活跃奖励卡片              │   │
│  │     基于上月交易量计算             │   │
│  │                                    │   │
│  │     14.2% [本月生效]              │   │
│  │     收益加成                      │   │
│  │                                    │   │
│  │     [████████████░░░░] 71%      │   │
│  │     0%           最高目标: 20%    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌───────────┐  ┌───────────┐          │
│  │ 今日成交  │  │ 今日租用  │          │
│  │ ¥128,450  │  │    342    │          │
│  └───────────┘  └───────────┘          │
│  ┌───────────┐  ┌───────────┐          │
│  │ 活跃资产  │  │ 在线用户  │          │
│  │   1,024   │  │   8,901   │          │
│  └───────────┘  └───────────┘          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     排行榜                      │   │
│  │     [周][月][年]                │   │
│  │                                    │   │
│  │  贡献榜 │ 活跃榜 │ 财富榜       │   │
│  │  ─────────────────────          │   │
│  │  1. 赵千影  9,850件              │   │
│  │  2. 李星辰  8,420件              │   │
│  │  3. 王晓悦  7,100件              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     成就大厅                      │   │
│  │     🏅 探索里程碑，解锁专属徽章    │   │
│  │     ● 最新：赵千影解锁「万物宗师」│   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     标签市场                      │   │
│  │  [视觉设计][全栈开发][商业摄影]   │   │
│  │  [法务咨询][多语翻译]  [更多>]   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### 5.3 个人中心页 (_3/code.html)

**文件**: `public/_3/code.html`
**路由**: `profile`
**标题**: "Everything - Home"

#### 布局结构

```
┌─────────────────────────────────────────┐
│  顶部导航栏                              │
│  [扫码]        万物        [通知]      │
├─────────────────────────────────────────┤
│                                         │
│  搜索栏                                  │
│  [🔍 搜索资产、创建者或标签    ][搜索]  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  分类标签横向滚动                        │
│  [全部][办公工具][专业文档][场地租借]... │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     轮播区域 (可横向滑动)        │   │
│  │                                    │   │
│  │  [全新发布] 2024 Q1 品牌设计规范   │   │
│  │                                    │   │
│  │  ───●───                          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  (资产卡片网格...)                       │
│                                         │
└─────────────────────────────────────────┘
```

### 5.4 快捷登录页 (_5/code.html)

**文件**: `public/_5/code.html`
**路由**: `assetDetail`
**标题**: "开启快捷登录 - 万物资产交易中心"

#### 布局结构

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│              ┌─────────┐               │
│              │  🔐     │               │
│              │ 指纹图标 │               │
│              └─────────┘               │
│                                         │
│           开启快捷登录                   │
│                                         │
│  启用生物识别，让每次访问万物资产         │
│  交易中心都安全又便捷。                  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         立即开启                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         稍后再说                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  (视频背景持续播放...)                   │
│                                         │
└─────────────────────────────────────────┘
```

### 5.5 首次登录验证页 (android/code.html)

**文件**: `public/android/code.html`
**路由**: `login`
**标题**: "首次开启指纹识别"

#### 布局结构

```
┌─────────────────────────────────────────┐
│                                         │
│              ┌─────────┐               │
│              │  🔐     │               │
│              │ 指纹图标 │               │
│              └─────────┘               │
│                                         │
│           开启指纹识别                   │
│                                         │
│  为了保障您的资产安全，请验证身份         │
│  以开启指纹登录                          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  👤 请输入用户名                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🔒 请输入密码           [👁]   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         去验证指纹 →             │   │
│  └─────────────────────────────────┘   │
│                                         │
│           跳过，以后再说                  │
│                                         │
│  (视频背景持续播放...)                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. 组件库

### 6.1 按钮组件

#### 主要按钮

```html
<button class="
  w-full
  py-4
  px-6
  rounded-full
  bg-primary-container
  text-on-primary
  font-label-sm
  shadow-[0_4px_14px_rgba(255,107,53,0.39)]
  hover:shadow-[0_6px_20px_rgba(255,107,53,0.23)]
  hover:bg-[#ff7b4b]
  transition-all
  duration-300
">
  按钮文字
</button>
```

#### 次要按钮

```html
<button class="
  w-full
  py-4
  px-6
  rounded-full
  bg-transparent
  text-on-surface-variant
  border border-outline-variant/30
  hover:bg-surface-variant/50
  transition-colors
">
  次要按钮
</button>
```

#### 胶囊标签

```html
<button class="
  px-5
  py-2.5
  rounded-full
  bg-surface-container
  text-on-surface-variant
  font-label-sm
  whitespace-nowrap
">
  标签文字
</button>
```

### 6.2 输入框组件

```html
<div class="relative">
  <!-- 前置图标 -->
  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <span class="material-symbols-outlined text-outline-variant">person</span>
  </div>

  <!-- 输入框 -->
  <input
    class="
      w-full
      pl-11
      pr-4
      py-4
      bg-surface
      text-on-surface
      border border-outline-variant
      rounded-full
      focus:ring-1
      focus:ring-secondary
      focus:border-secondary
      font-body-md
      placeholder-on-surface-variant/50
    "
    type="text"
    placeholder="输入提示文字"
  />

  <!-- 后置按钮 -->
  <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
    <button type="button">
      <span class="material-symbols-outlined">visibility_off</span>
    </button>
  </div>
</div>
```

### 6.3 卡片组件

#### 资产卡片

```html
<article class="
  mb-gutter
  flex flex-col
  bg-surface-container-lowest
  rounded-[24px]
  overflow-hidden
  shadow-[0_8px_24px_rgba(109,91,70,0.06)]
  group
  cursor-pointer
  hover:shadow-[0_12px_32px_rgba(109,91,70,0.12)]
  transition-shadow
  duration-300
">
  <!-- 图片区域 -->
  <div class="relative aspect-[16/9] w-full bg-surface-variant overflow-hidden">
    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
  </div>

  <!-- 内容区域 -->
  <div class="p-4 flex flex-col gap-2">
    <h3 class="font-headline-md text-[16px] leading-tight text-on-surface line-clamp-2">
      资产标题
    </h3>

    <div class="flex items-center gap-1 text-secondary font-label-sm text-[11px]">
      <span class="material-symbols-outlined text-[12px]">star</span>
      <span class="text-on-surface-variant">4.9 (12)</span>
    </div>

    <div class="flex justify-between items-center">
      <span class="font-body-lg text-[16px] font-semibold text-primary">¥50<span class="text-[12px] font-normal">/天</span></span>
      <button class="rounded-full bg-primary text-white font-label-sm px-3 py-1">预约</button>
    </div>
  </div>
</article>
```

#### 统计卡片

```html
<div class="
  bg-white
  rounded-card
  p-4
  shadow-soft
  flex flex-col
  items-start
  border border-outline-variant/30
">
  <span class="font-label-sm text-label-sm text-on-surface-variant mb-2">
    统计标签
  </span>
  <div class="font-display-lg text-[24px] font-bold text-[#FF6B35]">
    ¥128,450
  </div>
</div>
```

### 6.4 底部导航组件

```html
<nav class="
  fixed
  bottom-6
  left-1/2
  -translate-x-1/2
  w-[90%]
  max-w-md
  rounded-[32px]
  z-50
  bg-[#0A0A0A]
  shadow-[0_8px_30px_rgb(0,0,0,0.12)]
">
  <div class="flex justify-around items-center h-16 px-2">

    <!-- 默认状态 -->
    <button class="
      flex flex-col
      items-center
      justify-center
      text-stone-400
      py-2 px-6
    ">
      <span class="material-symbols-outlined">token</span>
      <span class="text-[10px] font-medium uppercase tracking-wider mt-1">资产</span>
    </button>

    <!-- 激活状态 -->
    <button class="
      flex flex-col
      items-center
      justify-center
      bg-[#FF6B35]
      text-white
      rounded-full
      py-2 px-6
    ">
      <span class="material-symbols-outlined">analytics</span>
      <span class="text-[10px] font-medium uppercase tracking-wider mt-1">数据</span>
    </button>

    <!-- 我的 -->
    <button class="
      flex flex-col
      items-center
      justify-center
      text-stone-400
      py-2 px-6
    ">
      <span class="material-symbols-outlined">person</span>
      <span class="text-[10px] font-medium uppercase tracking-wider mt-1">我的</span>
    </button>

  </div>
</nav>
```

---

## 7. 交互流程

### 7.1 用户启动流程

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│   ┌──────────────┐                                      │
│   │              │                                      │
│   │     万物      │    ← 启动Splash (2秒)              │
│   │   Everything  │                                      │
│   │              │                                      │
│   │ 万物皆资产... │                                      │
│   └──────────────┘                                      │
│                   │                                      │
│                   ▼                                      │
│   ┌──────────────────────────────────┐                  │
│   │      视频背景开始播放 (z-2)       │                  │
│   │      渐变遮罩叠加 (z-1)           │                  │
│   └──────────────────────────────────┘                  │
│                   │                                      │
│                   ▼                                      │
│   ┌──────────────────────────────────┐                  │
│   │         首页内容加载 (z10)         │                  │
│   │         底部导航显示 (z50)        │                  │
│   └──────────────────────────────────┘                  │
│                                                          │
│   ┌──────────────────────────────────┐                  │
│   │  视频持续循环播放，不中断...       │                  │
│   └──────────────────────────────────┘                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 7.2 页面切换流程

```
用户点击导航
    │
    ▼
loadPage('pageName')
    │
    ▼
fetch('/path/to/page.html')
    │
    ▼
获取HTML内容
    │
    ▼
page-container.innerHTML = newHTML
    │
    ▼
updateNav(pageName) - 更新激活状态
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  ⚠️ 视频背景保持不变，持续播放                            │
│  ✓ 不会重新加载，不会闪烁                                │
└─────────────────────────────────────────────────────────┘
```

### 7.3 登录流程

```
首次打开App
    │
    ▼
显示 android/code.html
    │
    ▼
用户输入用户名/密码
    │
    ▼
点击"去验证指纹"
    │
    ▼
跳转到 _5/code.html (快捷登录)
    │
    ▼
用户点击"立即开启"或"稍后再说"
    │
    ▼
进入首页 _6/code.html
```

---

## 8. 技术规范

### 8.1 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| Tailwind CSS | 样式系统 |
| Vanilla JavaScript | 页面路由 |
| Vite | 构建工具 |
| Capacitor | 原生包装 |

### 8.2 目录结构

```
wanwu-app/
├── public/
│   ├── _1/code.html          # 页面1
│   ├── _2/code.html          # 页面2
│   ├── _3/code.html          # 个人中心
│   ├── _4/code.html          # 数据中心
│   ├── _5/code.html          # 快捷登录
│   ├── _6/code.html          # 首页/资产
│   ├── android/code.html     # 首次登录
│   ├── splash_screen/code.html
│   └── bg-video.mp4          # 视频背景
├── index.html                 # 主入口 (SPA壳)
├── dist/                      # 构建输出
├── android/                   # Android项目
└── docs/                     # 文档
```

### 8.3 视频优化建议

1. **压缩**: 使用 HandBrake 或 FFmpeg 压缩至 <2MB
2. **分辨率**: 1080x1920 适合大多数设备
3. **时长**: 10-30秒无缝循环
4. **编码**: H.264 兼容性最好

### 8.4 浏览器兼容性

| 功能 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| Video autoplay | ✓ | ✓ | ✓ | ✓ |
| playsinline | ✓ | ✓ | ✓ | ✓ |
| CSS z-index负值 | ✓ | ✓ | ✓ | ✓ |
| backdrop-filter | ✓ | ✓ | ✓ | ✓ |

### 8.5 性能考虑

1. 视频仅加载一次，后续页面切换不重新加载
2. 使用 `playsinline` 防止iOS全屏播放
3. 视频添加 `muted` 属性以符合autoplay政策
4. 遮罩层使用CSS渐变而非额外图片

---

## 附录

### A. 快速参考

| 项目 | 值 |
|------|------|
| 主色 | #FF6B35 |
| 主文字 | #261814 |
| 次要文字 | #594139 |
| 背景色 | #FFF8F6 |
| 导航栏高度 | 64px |
| 底部导航距底 | 24px |
| 容器内边距 | 24px |
| 卡片圆角 | 24px (xl) |
| 按钮圆角 | 9999px (full) |

### B. 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| V8.0 | 2026-04-22 | 新增持久视频背景系统；优化SPA导航架构 |
| V7.0 | 2026-04-22 | 新增数据中心、个人中心页面设计 |
| V6.0 | 2026-04-21 | 完善组件库和色彩系统 |

---

*文档结束*
