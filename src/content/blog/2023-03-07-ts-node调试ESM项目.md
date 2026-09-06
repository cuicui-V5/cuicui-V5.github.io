---
title: "ts-node调试ESM项目提示[ERR_UNKNOWN_FILE_EXTENSION]"
date: "2023-03-07 20:47:28"
description: "如果直接使用 tsnode 运行开启了 ESM 的项目, 会提示未知扩展名"
categories:
  - "Web前端"
tags:
  - "typeScript"
---

如果直接使用 ts-node 运行开启了 ESM 的项目, 会提示未知扩展名

```ts
PS C:\学习\前端\VoiceGPT\voiceGPT-backend> ts-node .\src\index.ts
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for C:\学习\前端\VoiceGPT\voiceGPT-backend\src\index.ts
    at new NodeError (node:internal/errors:399:5)
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:79:11)
    at defaultGetFormat (node:internal/modules/esm/get_format:121:38)
    at defaultLoad (node:internal/modules/esm/load:81:20)
    at nextLoad (node:internal/modules/esm/loader:163:28)
    at ESMLoader.load (node:internal/modules/esm/loader:605:26)
    at ESMLoader.moduleProvider (node:internal/modules/esm/loader:457:22)
    at new ModuleJob (node:internal/modules/esm/module_job:64:26)
    at ESMLoader.#createModuleJob (node:internal/modules/esm/loader:480:17)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:434:34) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
```

解决方法: 将运行命令改为

```ts
ts-node --esm .\src\index.ts
```
