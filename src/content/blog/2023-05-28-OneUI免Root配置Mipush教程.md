---
title: "OneUI免Root配置Mipush教程"
date: "2023-05-28 22:28:50"
description: "众所周知, 三星的推送只是用来推送广告的(逃"
categories:
  - "软件技巧"
tags:
  - "Mipush"
---

众所周知, 三星的推送只是用来推送广告的(逃

所以通过配置 Mipush 就可以带来体验不错的正常通知体验, 而且不需要 Root, 缺点就是升级应用需要重新打补丁

此方法不仅限于 OneUI, 其他系统也通用

相关链接:

1. [https://bzmshang.top/MiPush-Framework_User-Guide](https://bzmshang.top/MiPush-Framework_User-Guide)
2. [https://github.com/NihilityT/MiPushConfigurations/tree/main](https://github.com/NihilityT/MiPushConfigurations/tree/main)
3. [https://github.com/NihilityT/MiPushFramework](https://github.com/NihilityT/MiPushFramework)
4. [https://github.com/LSPosed/LSPatch](https://github.com/LSPosed/LSPatch)
5. [https://github.com/NihilityT/MiPush](https://github.com/NihilityT/MiPush)

## 安装步骤:

1. 安装`LSPatch` (`链接4`
2. 安装`推送服务`App (`链接3`
3. 安装 push 模块(各个模块对应用的支持情况都不同, 支持情况见下表, 这里推荐 Mipush 模块, 官方实现 (链接 5

    1. | MiPush         | MiPush<br />Faker  | MiPush<br />DeviceFake |
       | -------------- | ------------------ | ---------------------- |
       | QQ             | QQ                 | B 站                   |
       | QQ<br />邮箱   | QQ<br />邮箱       | 酷安                   |
       | 淘宝           | 淘宝               | 百度                   |
       | 闲鱼           | 闲鱼               | 微博                   |
       | 抖音           | 菜鸟               | 支付宝                 |
       | 京东           | 米游社             | 拼多多                 |
       | 今日<br />头条 | APP<br />分享      | 高德<br />地图         |
       | 哈啰           | 哔哩哔哩<br />漫画 |                        |
       | 小红书         | 小宇宙             |                        |
       | Boss<br />直聘 | 支付宝             |                        |
       |                | 浙政钉             |                        |
       |                | 饿了么             |                        |
       |                | 美团               |                        |

4. 安装`Shizuku`, 给`LSPatch`授权
5. 使用`LSPatch`给需要通知的应用打补丁, 模式选择`Intergrated`, 然后点击嵌入模块, 选择第三步安装的某个 push 模块, 打完补丁后安装即可
6. 打开软件, 正常登录即可
7. 在`推送服务`App 中检查应用状态, 如果还是未注册, 那么强制停止应用后重试
8. 在`推送服务`App 中设置通知配置文件: 为了支持某些高级功能, 比如支持 qq 显示多条消息, 需要设置配置文件

    1. 在`推送服务`App 中点击设置, 然后将`设置配置目录`设置为某个目录, 然后将需要设置的配置文件放置其中, 作者提供的配置文件见`链接2`
    2. 比如 qq 的配置文件, 需要放置以下三个文件 `0_基础配置（必需品）`+`com.tencent.mobileqq_QQ`＋`com.tencent.mobileqq_QQ_MessagingStyle`

## 应用后续升级方法

1. 获取应用 apk
2. 使用 LSPatch 打补丁
3. 覆盖安装即可, 应用数据不会丢失
