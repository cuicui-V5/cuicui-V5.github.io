# cuicui'Blog (Astro 5.x)

> “弱小和无知从不是生存的障碍，傲慢才是。”

基于 **Astro 5.x + Tailwind CSS + TypeScript** 构建的现代化极简设计感个人博客与数字花园。

## ✨ 特性

- ⚡ **极致性能**：纯静态输出，页面默认 0 JavaScript 运行时，Lighthouse 满分体验。
- 🎨 **极简设计质感**：克制高级的黑白灰排版、自适应深浅色模式（支持自动记忆与系统同步）。
- 📝 **35 篇历史博文无损迁移**：适配 Astro Content Collections 规范，自动清洗图片引用与元数据。
- 🔍 **秒级本地搜索**：基于 Fuse.js 的搜索弹窗，支持 `Ctrl + K` 快捷键全站模糊检索。
- 📖 **舒适阅读体验**：顶部平滑阅读进度指示、右侧滚动联动目录（TOC）、代码块一键复制反馈。
- 🏷️ **多维分类与标签**：完整的标签墙、年份时间线归档、单篇上下翻页导航。
- 📡 **标准订阅**：支持自动生成标准 RSS 2.0 订阅源 (`/rss.xml`)。
- 🚀 **现代 CI/CD 自动化**：内置 GitHub Actions 工作流，代码推送即可自动部署发布。

---

## 🛠️ 本地开发

进入项目根目录：

```bash
cd D:\myProject\blog
```

### 1. 启动本地开发服务

```bash
npm run dev
```

启动后在浏览器访问 `http://localhost:4321` 即可预览博客。

### 2. 静态检查与完整编译

```bash
# 静态类型与元数据检查
npm run check

# 生产环境完整打包构建
npm run build

# 本地预览打包产物
npm run preview
```

---

## ✍️ 撰写新文章

在 `src/content/blog/` 目录下新建 `.md` 文件，头部遵循以下 Frontmatter 规范：

```markdown
---
title: "文章标题"
date: "2026-09-06 20:00:00"
description: "文章简短介绍（可选，未填写时自动提取首段）"
categories:
  - "思考随笔"
tags:
  - "技术"
  - "折腾"
draft: false
---

正文内容...
```

### 图片插入说明
- 可将文章配图放置在 `public/images/posts/文章目录名/` 目录下；
- 在 Markdown 中使用标准语法引用：`![图片描述](/images/posts/文章目录名/图片文件名.png)`。

---

## 🚀 部署到 GitHub Pages

1. 在 GitHub 上新建一个仓库（例如 `cuicui-blog` 作为源码仓库，或者直接作为 `cuicui-V5.github.io` 的源码仓库）；
2. 关联并推送到远程仓库：
   ```bash
   git add .
   git commit -m "feat: migrate blog to modern Astro"
   git remote add origin https://github.com/cuicui-V5/<your-repo>.git
   git push -u origin main
   ```
3. 在 GitHub 仓库设置中（Settings -> Pages -> Build and deployment -> Source）选择 **GitHub Actions** 即可，每次 push 自动触发打包上线。
