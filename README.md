# cuicui'Blog (Astro 5.x)

> “弱小和无知从不是生存的障碍，傲慢才是。”

这是一个基于 **Astro 5.x + Tailwind CSS + TypeScript** 构建的现代化、极简设计感个人博客与数字花园。

本文档专为**人类博主**及**后续接手的 AI 助手**编写，详细说明本站的技术架构、内容创作规范、设计系统、部署流以及二次开发准则。

---

## 目录

- [一、技术架构与特性](#一技术架构与特性)
- [二、项目目录结构导航](#二项目目录结构导航)
- [三、本地开发与构建命令](#三本地开发与构建命令)
- [四、日常写作规范与发布流](#四日常写作规范与发布流)
  - [1. 新建文章步骤](#1-新建文章步骤)
  - [2. Frontmatter 元数据完整规范](#2-frontmatter-元数据完整规范)
  - [3. 文章图片与静态资源存放规范](#3-文章图片与静态资源存放规范)
  - [4. 代码块高亮与排版细节](#4-代码块高亮与排版细节)
- [五、线上部署指南](#五线上部署指南)
  - [方案 A：GitHub Pages + GitHub Actions（已内置开箱即用）](#方案-agithub-pages--github-actions已内置开箱即用)
  - [方案 B：Cloudflare Pages / Vercel（极致 CDN 推荐）](#方案-bcloudflare-pages--vercel极致-cdn-推荐)
  - [自定义域名说明](#自定义域名说明)
- [六、设计系统与色彩体系说明（供后续维护/AI参考）](#六设计系统与色彩体系说明供后续维护ai参考)
- [七、AI 助手维护开发守则](#七ai-助手维护开发守则)

---

## 一、技术架构与特性

- ⚡ **极致静态性能**：纯静态输出（SSG），页面默认 **0 JavaScript 运行时**，Lighthouse 性能测试 100/100；
- 🖥️ **开阔大视口排版**：采用 `max-w-6xl xl:max-w-7xl`（最大 1280px）宽屏视口，12 列响应式栅格，彻底消除两侧过宽留白；
- 🎨 **轻柔马卡龙/莫兰迪色彩体系**：在克制的设计基础上融入柔和的轻色调标签、氛围渐变光晕与卡片微质感，避免单调黑白冷感；
- 🔍 **秒级全站检索**：内置 Fuse.js，支持随时通过 `Ctrl + K` / `Cmd + K` 唤起全站模糊搜索弹窗；
- 📖 **舒适沉浸阅读**：顶部渐变阅读进度条、右侧粘性联动目录（TOC）、代码块一键复制反馈；
- 🏷️ **多维分类索引**：年份归档时间轴（`/archive`）、分类筛选（`/posts`）、多彩标签墙（`/tags`）；
- 📡 **标准全站订阅**：自动生成标准 RSS 2.0 订阅源（`/rss.xml`）。

---

## 二、项目目录结构导航

```text
D:\myProject\blog\
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions 自动化构建与部署流水线
├── public/                      # 纯静态资源目录（打包后原样复制到根目录）
│   ├── images/
│   │   └── posts/               # 文章配套图片库（按文章 slug 分子文件夹）
│   ├── avatar.jpg               # 博主头像（正方形/微圆角）
│   ├── favicon.ico              # 网站图标
│   └── CNAME                    # 绑定的自定义域名（如 cuijunyu.win）
├── src/
│   ├── components/              # 页面功能组件
│   │   ├── Header.astro         # 顶部导航栏（品牌、菜单、全站搜索、暗黑切换）
│   │   ├── Footer.astro         # 页脚（版权、座右铭、RSS链接、回顶端）
│   │   ├── PostCard.astro       # 文章卡片（带彩色分类徽标、阅读时长、标签）
│   │   ├── SearchModal.astro    # Ctrl+K 搜索弹窗组件 (基于 Fuse.js)
│   │   ├── TableOfContents.astro# 文章详情页右侧滚动高亮目录
│   │   └── ThemeToggle.astro    # 深浅色主题切换开关
│   ├── content/                 # 内容集合管理
│   │   ├── config.ts            # Zod 定义的严格博文 Schema 校验
│   │   └── blog/                # 存放全部 Markdown 文章文件 (*.md)
│   ├── layouts/                 # 页面布局模板
│   │   ├── BaseLayout.astro     # 全站通用基础布局（SEO、防闪烁脚本、主容器）
│   │   └── PostLayout.astro     # 文章详情页布局（正文+右侧TOC双栏栅格）
│   ├── pages/                   # 路由页面（文件即路由）
│   │   ├── index.astro          # 博客首页（Hero氛围卡片 + 桌面端双栏）
│   │   ├── posts/
│   │   │   ├── index.astro      # 全部文章聚合页（分类筛选）
│   │   │   └── [...slug].astro  # 动态文章详情页
│   │   ├── archive.astro        # 年份时间线归档页
│   │   ├── tags/
│   │   │   ├── index.astro      # 标签云集合页
│   │   │   └── [tag].astro      # 单个标签聚合页
│   │   ├── about.astro          # 关于我 / 数字花园理念页
│   │   ├── search.json.ts       # 编译期生成的全站搜索数据索引接口
│   │   └── rss.xml.ts           # 编译期生成的标准 RSS 2.0 订阅源
│   ├── styles/
│   │   └── global.css           # 全局样式（环境光晕底色、滚动条、代码复制按钮）
│   └── utils/
│       └── posts.ts             # 日期格式化、字数时长估算、马卡龙颜色映射工具
├── astro.config.mjs             # Astro 核心配置（域名、Tailwind、MDX、Shiki）
├── tailwind.config.mjs          # Tailwind CSS 配置与 Typography 排版定制
├── tsconfig.json                # TypeScript 路径映射与配置
└── package.json                 # 项目依赖与启动脚本
```

---

## 三、本地开发与管理工作台 (Admin Studio)

在项目根目录下打开终端：

```bash
# 🖥️ 推荐：一键启动可视化文章管理后台 (Admin Studio)
# 浏览器自动打开 http://localhost:3456
# 支持可视化编辑、标签分类管理、截图 Ctrl+V 直接粘贴自动转存、一键构建推送
npm run admin

# 🌐 启动 Astro 博客前台热重载开发服务器（默认地址: http://localhost:4321）
npm run dev

# 🔍 执行静态类型与内容集合语法校验
npm run check

# 📦 生产环境完整静态构建（输出产物到 dist/ 目录）
npm run build

# 👁️ 本地启动服务预览生产环境 dist 产物
npm run preview
```

> **💡 Admin Studio 功能亮点**：
> - **双栏实时编辑**：左边写 Markdown，右边实时预览渲染；
> - **截图一键粘贴**：按 `Ctrl + V` 直接把剪贴板图片贴进编辑器，后台自动在 `public/images/posts/<slug>/` 保存文件并生成 Markdown 语法；
> - **元数据可视化**：时间选择器、分类下拉框、多标签管理、草稿开关；
> - **一键部署上线**：界面右上角/左下角点击「一键编译推送到 GitHub」，全自动运行打包并 `git push` 到远程。


---

## 四、日常写作规范与发布流

### 1. 新建文章步骤

1. 在 `src/content/blog/` 目录下新建一个 `.md` 文件；
2. **文件名推荐命名规范**：`YYYY-MM-DD-文章标题或关键词.md`（例如 `2026-09-07-如何构建自己的个人工具箱.md`）；
3. 在文件头部添加合规的 **Frontmatter** 信息；
4. 编写 Markdown 正文并保存，本地运行 `npm run dev` 即可实时热更新预览。

### 2. Frontmatter 元数据完整规范

```markdown
---
title: "文章的完整标题"
date: "2026-09-07 14:30:00"
description: "文章的简短介绍（1-2句话），若不填则会自动提取正文前段文字"
categories:
  - "技术分享"          # 主分类，支持预设色系：Web前端、软件技巧、技术分享、思考随笔等
tags:
  - "工具"              # 标签列表，支持多个标签，会自动染上马卡龙色标
  - "折腾"
  - "CLI"
draft: false            # 是否为草稿。若设置为 true，构建时将自动隐藏，不公开展示
---

这里开始写正文内容...
```

### 3. 文章图片与静态资源存放规范

为了防止因相对路径或非 ASCII（中文）路径导致的构建打包问题，本项目采用标准的**集中静态静态路由规范**：

1. **存放路径**：
   在 `public/images/posts/` 下新建与你的文章同名（或 slug）的子文件夹，把图片放入其中。
   > 例如：`public/images/posts/2026-09-07-我的新工具/demo.png`
2. **在 Markdown 中引用**：
   统一以 `/images/posts/...` 绝对路径方式引用：
   ```markdown
   ![演示效果](/images/posts/2026-09-07-我的新工具/demo.png)
   ```
   *注意：路径开头的 `/` 代表 `public` 根目录。这种方式稳定可靠，在本地与线上均不会出现裂图。*

### 4. 代码块高亮与排版细节

- **代码块语言标识（务必小写）**：
  本项目使用 Shiki 语法高亮引擎。标记代码块时，请确保语言标识符为**全小写**，例如：
  - ```` ```javascript ````（而非 ```` ```JavaScript ````）
  - ```` ```typescript ````（而非 ```` ```TypeScript ````）
  - ```` ```python ````、```` ```bash ````、```` ```json ````、```` ```html ````、```` ```css ````
- **复制按钮**：系统已自动为所有代码块挂载右上角「一键复制」按钮，鼠标悬停时自动淡入，复制后有动画反馈。

---

## 五、线上部署指南

### 方案 A：GitHub Pages + GitHub Actions（已内置开箱即用）

本项目已在 `.github/workflows/deploy.yml` 内置了完整的 GitHub Actions 工作流。

1. **初始化并推送到你的 GitHub 仓库**：
   ```bash
   cd D:\myProject\blog
   git remote add origin https://github.com/你的GitHub用户名/你的仓库名.git
   git branch -M main
   git push -u origin main
   ```
2. **在 GitHub 开启自动构建权限**：
   - 打开你的 GitHub 仓库主页；
   - 点击 **Settings** -> **Pages**；
   - 在 **Build and deployment** 下方的 **Source** 下拉框中，选择 **GitHub Actions**；
3. **完成**：
   此后只要本地向 `main` 分支执行 `git push`，GitHub 就会自动执行依赖安装、静态打包并将产物部署到 GitHub Pages。

### 方案 B：Cloudflare Pages / Vercel（极致 CDN 推荐）

如果你希望拥有更快、无任何网络波动的全球访问体验：
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages** -> **Create application** -> **Pages**；
2. 关联你的 GitHub 博客仓库；
3. 配置构建参数：
   - **Framework preset**：`Astro`
   - **Build command**：`npm run build`
   - **Build output directory**：`dist`
4. 点击 Deploy 即可。Cloudflare 全球 Anycast CDN 节点会自动缓存，秒开体验极佳。

### 自定义域名说明
- 项目的 `public/CNAME` 文件已预置域名 `cuijunyu.win`；
- 打包时会自动放入 `dist/CNAME`；
- 如果你使用的是 Cloudflare Pages 或 Vercel，可以在控制台的 **Custom Domains** 面板一键绑定你的域名并自动签发免费 SSL 证书。

---

## 六、设计系统与色彩体系说明（供后续维护/AI参考）

为了保持博客的高级感与设计统一性，后续修改样式时请遵循以下规范：

1. **主视口宽度规则**：
   - 保持采用 `max-w-6xl xl:max-w-7xl`（1152px ~ 1280px）。
   - **切勿改回 `max-w-4xl`（896px）**，避免宽屏两侧产生巨大空洞。
2. **色彩体系（`src/utils/posts.ts`）**：
   - **分类色标**：
     - `Web前端/技术` -> `Sky`（淡青天蓝：`bg-sky-50 text-sky-700`）
     - `软件技巧/工具` -> `Emerald`（浅薄荷绿：`bg-emerald-50 text-emerald-700`）
     - `技术分享/折腾` -> `Indigo`（鸢尾靛蓝：`bg-indigo-50 text-indigo-700`）
     - `随笔/思考` -> `Amber`（暖调淡杏：`bg-amber-50 text-amber-700`）
   - **标签色标**：由 `getTagBadgeStyle()` 根据标签字符哈希自动分配 6 种低饱和度马卡龙配色（Indigo、Teal、Sky、Amber、Purple、Rose）。
3. **明暗双模式机制**：
   - `src/layouts/BaseLayout.astro` 头部内联了防白屏闪烁脚本（自动读取 `localStorage.getItem('theme')` 或匹配系统媒体查询）；
   - 在任何自定义组件中，使用 Tailwind 的 `dark:` 前缀即可实现完美的暗黑模式适配。

---

## 七、AI 助手维护开发守则

如果您是正在阅读此项目的 AI 辅助编程代理，请严格遵守以下协作准则：

1. **绝对隔离原仓库**：
   - 绝不能修改 `d:\文件存档\03_学习提升_Study\前端\blog\`（原旧仓库保留作为历史只读归档）；
   - 所有变更必须仅在当前项目 `D:\myProject\blog\` 中进行。
2. **内容类型安全**：
   - 编写或调整文章时，务必保持 Frontmatter 符合 `src/content/config.ts` 中的 Zod 约束；
   - 任何改动后，在提交前建议通过终端执行 `npx astro check` 确保 0 错误。
3. **保持无前端专研标签的个人定位**：
   - 避免在关于页、首页 Hero 等区域添加“专研 Vue/前端专家”等狭窄标签；
   - 保持博主“探寻技术、工具与个人秩序平衡点”的探索者与思考者定位。
4. **图片与媒体路径**：
   - 严禁在 Markdown 中使用无法被 Vite 静态解析的私有相对路径；
   - 统一遵循 `/images/posts/<post-slug>/<filename>` 静态路由规则。

---

*祝阅读与记录愉快！在喧嚣中保留一块思考的净土。*
