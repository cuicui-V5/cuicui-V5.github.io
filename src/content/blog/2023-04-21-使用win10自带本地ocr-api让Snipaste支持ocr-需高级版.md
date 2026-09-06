---
title: "使用win10自带本地ocr让Snipaste实现快速识别文字 [需高级版]"
date: "2023-04-21 17:02:55"
description: "这是上篇文章[搭配 tesseractocr 在 Snipaste 中支持 ocr[需高级版]](https://cuijunyu.win/20230310/%E6%90%AD%E9%85%8Dtesseractocr%E5%9C%A8Snipaste%E4%B8%AD%E6%94%AF%E6%8C"
categories:
  - "软件技巧"
tags:
  - "ocr"
  - "snipaste"
---

这是上篇文章[搭配 tesseract-ocr 在 Snipaste 中支持 ocr[需高级版]](https://cuijunyu.win/20230310/%E6%90%AD%E9%85%8Dtesseract-ocr%E5%9C%A8Snipaste%E4%B8%AD%E6%94%AF%E6%8C%81ocr-%E9%9C%80%E9%AB%98%E7%BA%A7%E7%89%88/)的第二种解决方案

上一篇文章介绍了使用 tesseract-ocr 实现的方法, 他的识别速度略慢, 而且需要安装第三方软件, 这里介绍一种使用 windows 自带的 ocr 实现的方法, 而且速度 非! 常! 快!

> windows.media.ocr 是 Windows 10 操作系统提供的 OCR（光学字符识别）引擎。它使用图像处理算法来识别文本和数字，可用于将印刷或手写文本转换为可编辑的电子文件。该 API 支持多种语言和字体类型，并能够在不同分辨率的图像上工作。在开发应用程序时，开发人员可使用 windows.media.ocr 实现自动识别文本信息的功能。

| 方案                                                                                        | OCR 工具              | 优点                   | 缺点                                            |
| ------------------------------------------------------------------------------------------- | --------------------- | ---------------------- | ----------------------------------------------- |
| [方案 1](https://cuijunyu.win/20230310/搭配tesseract-ocr在Snipaste中支持ocr-需高级版/)      | Tesseract-ocr         | 离线操作，支持各种系统 | 速度稍慢，准确度一般                            |
| [方案 2](https://cuijunyu.win/20230421/使用win10自带本地ocr-api让Snipaste支持ocr-需高级版/) | Windows.Media.Ocr.Cli | 离线使用，速度极快     | 只支持 Win10 以上系统，准确度逊于 Tesseract-ocr |
| [方案 3](https://cuijunyu.win/20230421/Snipaste-OCR篇3-使用百度api实现准确度更好的ocr/)     | 百度 OCR 在线识别     | 准确度较高             | 需要网络，速度较慢                              |

由于使用到了自定义命令, 因此同样需要高级版

这种方法只支持 win10 以上系统, 速度飞快. 俺基于[Windows.Media.Ocr.Cli](https://github.com/zh-h/Windows.Media.Ocr.Cli)二次开发了一个命令行 ocr 程序, [直接下载](/download/Windows.Media.Ocr.Cli.exe) github 地址: [link](https://github.com/cuicui-V5/Windows.Media.Ocr.Cli)

## 食用方法

1. 将 `Windows.Media.Ocr.Cli.exe` 放置到一个你认为能找到的目录, 例如`D\temp\`,
2. 打开 Snipaste 的首选项-控制, 点击添加新命令

    1. ![配置1](/images/posts/2023-04-21-使用win10自带本地ocr-api让Snipaste支持ocr-需高级版/配置1.png)
    2. ![配置2](/images/posts/2023-04-21-使用win10自带本地ocr-api让Snipaste支持ocr-需高级版/配置2.png)

3. 名称随意填写, 命令填写如下

    ```
     snip -o "D:\Temp\source.png";exec(cmd /c "D:\Temp\Windows.Media.Ocr.Cli.exe" -o  "D:\Temp\ocrRes.txt" "D:\Temp\source.png" &&  notepad "D:\Temp\ocrRes.txt");
    ```

    这段命令的含义是首先调用 Snipaste 截图并存放于`D:\Temp\source.png`, 然后执行 cmd 命令, 调用`Windows.Media.Ocr.Cli.exe`进行 ocr 识别, 并将识别结果用记事本打开, 文件名和路径请根据自己需要修改

4. 随后指定一个快捷键即可体验飞快的 OCR 啦 !! 🤔🤔🤔🤔🤔🤔🤔🤔
