---
title: "利用pandoc合并markdown及转换为docx"
date: "2023-01-20 00:35:43"
description: "最近有需求把 markdown 文档合并起来然后转换为 word 文档以供打印的需求, 所以了解到了 pandoc 这一款命令行文本处理神器"
categories:
  - "软件技巧"
tags:
  - "小工具"
  - "pandoc"
---

最近有需求把 markdown 文档合并起来然后转换为 word 文档以供打印的需求, 所以了解到了 pandoc 这一款命令行文本处理神器

<!-- more -->

-   批量合并 markdown
    小 tips: 如果需要大批量文件, 可以在资源管理器中全选, 然后拖到终端窗口中, 自动填充路径及文件名

```
pandoc -s file1.md file2.md -o AllJavaScript.md
```

-   markdown 转 doc

```
pandoc -o output.docx -f markdown -t docx .\AllInOne.md
```
