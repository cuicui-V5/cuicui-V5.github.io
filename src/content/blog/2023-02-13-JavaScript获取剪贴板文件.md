---
title: "JavaScript获取剪贴板文件"
date: "2023-01-13 23:56:31"
description: ""
categories:
  - "Web前端"
tags:
  - "JavaScript"
---

```ts
const btn = document.querySelector("button");
document.addEventListener("paste", e => {
    console.log(e.clipboardData.files);
});
```
