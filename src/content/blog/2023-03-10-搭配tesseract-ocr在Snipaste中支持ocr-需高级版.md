---
title: "搭配tesseract-ocr在Snipaste中支持ocr[需高级版]"
date: "2023-03-10 15:59:08"
description: "Snipaste 是一款非常好用的截图软件, 但是却缺少了一个非常重要的功能ocr"
categories:
  - "软件技巧"
tags:
  - "ocr"
  - "snipaste"
---

Snipaste 是一款非常好用的截图软件, 但是却缺少了一个非常重要的功能--ocr

在作者帮助下, 我成功的让 Snipaste 支持了 ocr 功能, 此功能需要高级版的 [自定义命令] 功能搭配 `tesseract-ocr` 实现 ocr 功能, 而且体验很好

![演示ocr效果](/images/posts/2023-03-10-搭配tesseract-ocr在Snipaste中支持ocr-需高级版/演示ocr效果.gif)

### 此方案速度略慢而且需要安装第三方软件, 如不想安装请参考下列其余方案

| 方案                                                                                        | OCR 工具              | 优点                   | 缺点                                            |
| ------------------------------------------------------------------------------------------- | --------------------- | ---------------------- | ----------------------------------------------- |
| [方案 1](https://cuijunyu.win/20230310/搭配tesseract-ocr在Snipaste中支持ocr-需高级版/)      | Tesseract-ocr         | 离线操作，支持各种系统 | 速度稍慢，准确度一般                            |
| [方案 2](https://cuijunyu.win/20230421/使用win10自带本地ocr-api让Snipaste支持ocr-需高级版/) | Windows.Media.Ocr.Cli | 离线使用，速度极快     | 只支持 Win10 以上系统，准确度逊于 Tesseract-ocr |
| [方案 3](https://cuijunyu.win/20230421/Snipaste-OCR篇3-使用百度api实现准确度更好的ocr/)     | 百度 OCR 在线识别     | 准确度较高             | 需要网络，速度较慢                              |

# 配置过程

1.  前往 [https://digi.bib.uni-mannheim.de/tesseract/](https://digi.bib.uni-mannheim.de/tesseract/) 下载安装最新版`​ tesseract-ocr`,

    1. 安装过程中, 选择中文识别包 ![安装](/images/posts/2023-03-10-搭配tesseract-ocr在Snipaste中支持ocr-需高级版/安装.png)

2.  安装完成之后, 可以使用如下命令进行本地 ocr:

    1.` tesseract <需 ocr 的图像> <输出文件位置, 注意不需要写扩展名> -c preserve_interword_spaces=1 --oem 1 --psm 1 -l eng+chi_sim`

    其中`-c preserve_interword_spaces=1 --oem 1 --psm 1 -l eng+chi_sim` 为识别参数, `preserve_interword_spaces=1`可以去掉多余的空格, `-l eng+chi_sim` 是指定识别语言

3.  打开 Snipaste 的首选项-控制, 点击添加新命令

    1. ![配置1](/images/posts/2023-03-10-搭配tesseract-ocr在Snipaste中支持ocr-需高级版/配置1.png)
    2. ![配置2](/images/posts/2023-03-10-搭配tesseract-ocr在Snipaste中支持ocr-需高级版/配置2.png)

4.  名称随意填写, 命令填写如下

    ```
      snip -o "D:\Temp\source.png";exec(cmd /c "C:\Program Files\Tesseract-OCR\tesseract.exe"  "D:\Temp\source.png" "D:\Temp\ocrRes" -c preserve_interword_spaces=1 --oem 1 --psm 1 -l eng+chi_sim &&  notepad "D:\Temp\ocrRes.txt");
    ```

    这段命令的含义是首先调用 Snipaste 截图并存放于`D:\Temp\source.png`, 然后执行 cmd 命令, 调用`tesseract`进行 ocr 识别, 并将识别结果用记事本打开 其中, **`C:\Program Files\Tesseract-OCR\tesseract.exe`**为你的`tesseract`安装路径, `D:\Temp\ocrRes`为 ocr 结果的文件路径, 注意只需要写文件名, 不需要拓展名, 文件名和路径请根据自己需要修改

5.  随后指定一个快捷键即可愉快的 OCR 啦 !! 😋😋😋😋😋
