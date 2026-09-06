---
title: "Snipaste OCR篇3, 使用百度api实现准确度更好的ocr"
date: "2023-04-21 21:31:30"
description: "20230526 更新:\n 更新了脚本, 更好的处理了换行符问题\n 如果段落以断句符结尾, 那么保留换行; 如果不以断句符结尾, 那么去掉换行"
categories:
  - "软件技巧"
tags:
  - "ocr"
  - "snipaste"
---

> 20230526 更新:
> 更新了脚本, 更好的处理了换行符问题
> 如果段落以断句符结尾, 那么保留换行; 如果不以断句符结尾, 那么去掉换行

之前的两篇文章介绍了使用 tesseract-ocr 与 win10 的自带 api 实现的 ocr 方法, 这两种方法的优点是本地识别, 速度较快, 但是准确度差强人意, 这里给出第三种方案--使用百度 api 在线识别, 这种方法同样基于高级版的自定义命令功能

| 方案                                                                                        | OCR 工具              | 优点                   | 缺点                                            |
| ------------------------------------------------------------------------------------------- | --------------------- | ---------------------- | ----------------------------------------------- |
| [方案 1](https://cuijunyu.win/20230310/搭配tesseract-ocr在Snipaste中支持ocr-需高级版/)      | Tesseract-ocr         | 离线操作，支持各种系统 | 速度稍慢，准确度一般                            |
| [方案 2](https://cuijunyu.win/20230421/使用win10自带本地ocr-api让Snipaste支持ocr-需高级版/) | Windows.Media.Ocr.Cli | 离线使用，速度极快     | 只支持 Win10 以上系统，准确度逊于 Tesseract-ocr |
| [方案 3](https://cuijunyu.win/20230421/Snipaste-OCR篇3-使用百度api实现准确度更好的ocr/)     | 百度 OCR 在线识别     | 准确度较高             | 需要网络，速度较慢                              |

## 使用方法

1. 安装 python 运行环境
2. 申请百度 ocr api key. https://ai.baidu.com/tech/ocr
3. 将下列代码保存为 `ocr.pyw`, 后缀名为 `pyw` 可以实现后台运行, 不出现命令行窗口,
   顺便说一句这个代码完全是 gpt 生成的, 我除了修改了一下 key 以外啥都没改

```python
import requests
import base64
import json
import sys
import re

# 设置API key和Secret Key
API_KEY = 'your_api_key'
SECRET_KEY = 'your_secret_key'

# 设置请求URL和Content-type
ocr_url = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic"
headers = {'Content-Type': 'application/x-www-form-urlencoded'}

# 读取图片文件并将其转换为base64编码


def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        return base64.b64encode(fp.read())

# 发起API请求，获取识别结果


def ocr_image(image_path):
    try:
        # 访问百度OCR API获取识别结果
        response = requests.post(
            ocr_url,
            headers=headers,
            params={'access_token': access_token},
            data={'image': get_file_content(image_path)}
        )
        if response.status_code == 200:
            # 解析JSON格式返回值
            result = json.loads(response.content)
            if 'words_result' in result:
                return "\n".join([item['words'] for item in result['words_result']])
            else:
                return None
        else:
            return None
    except Exception as e:
        print(e)
        return None

# 将识别结果写入输出文件


def write_output(output_path, text):
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
    except Exception as e:
        print(e)



def remove_extra_newlines(text):
    p = r'([。.？?！!;；:：])\n+'
    text = re.sub(p, r'\1\n', text)
    p = r'([^。.？?！!;；:：])\n+'
    text = re.sub(p, r'\1', text)
    return text.strip()


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('Usage: python ocr.py [image_path] [output_path]')
    else:
        # 通过API key和Secret Key获取访问令牌
        token_url = 'https://aip.baidubce.com/oauth/2.0/token'
        response = requests.post(token_url, params={
            'grant_type': 'client_credentials',
            'client_id': API_KEY,
            'client_secret': SECRET_KEY
        })
        access_token = json.loads(response.text)['access_token']

        # 进行文字识别并输出结果到指定文件
        image_path = sys.argv[1]
        output_path = sys.argv[2]
        text = ocr_image(image_path)
        text = remove_extra_newlines(text)
        write_output(output_path, text)

```

4. 将 `orc.pyw` 放置于你能找到的路径, 如 `D:\temp\`
5. 打开 Snipaste 的首选项-控制, 点击添加新命令

    1. ![配置1](/images/posts/2023-04-21-Snipaste-OCR篇3-使用百度api实现准确度更好的ocr/配置1.png)
    2. ![配置2](/images/posts/2023-04-21-Snipaste-OCR篇3-使用百度api实现准确度更好的ocr/配置2.png)

6. 名称随意填写, 命令填写如下

    ```
    snip -o "D:\Temp\source.png";exec(cmd /c "D:\Temp\ocr.pyw" "D:\Temp\source.png" "D:\Temp\ocrRes.txt"  &&  notepad "D:\Temp\ocrRes.txt");
    ```

    这段命令的含义是首先调用 Snipaste 截图并存放于`D:\Temp\source.png`, 然后执行 cmd 命令, 调用`ocr.pyw`进行 ocr 识别, 并将识别结果用记事本打开, 文件名和路径请根据自己需要修改

7. 随后指定一个快捷键即可体验到速度没那么快但是准确度很高的 OCR 啦 !! 🤔🤔🤔🤔🤔🤔🤔🤔
