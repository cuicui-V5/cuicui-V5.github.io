---
title: "TypeScript下给定时器标注类型"
date: "2022-07-20 16:01:41"
description: ""
categories:
  - "Web前端"
tags:
  - "TypeScript"
  - "test"
---

```ts
let timer: NodeJS.Timeout = setInterval(() => {});
clearTimeout(timer);
```
