---
title: "通过Acme.sh + CloudFlare Dns认证申请泛域名证书"
date: "2023-01-20 01:24:52"
description: "使用 acme.sh 这个神器, 可以快速的申请泛域名证书, 省去繁琐的手动申请的步骤"
categories:
  - "技术分享"
tags:
  - "CloudFlare"
---

使用 acme.sh 这个神器, 可以快速的申请泛域名证书, 省去繁琐的手动申请的步骤

由于我的域名使用了 CloudFlare Dns , 所以我用了 CloudFlare 的 api 认证方式

## 使用步骤

-   首先在 CloudFlare 控制面板中获取 api key ,此处不多赘述
-   设置环境变量

```
export CF_Key="cloudflare申请的apikey"
export CF_Email="你的邮箱"
```

-   使用 acme.sh 注册 acme 账号

```
acme.sh --register-account -m 你的邮箱
```

-   使用 acme.sh 快速申请泛域名证书, 并安装到 nginx 路径

```
acme.sh --issue -d "cuijunyu.win" -d "*.cuijunyu.win" --dns dns_cf \
--key-file       /etc/nginx/ssl/cuijunyu.key  \
--fullchain-file /etc/nginx/ssl/cuijunyu.pem \
--reloadcmd "nginx -s reload"
```

-   删除已安装的证书

```
acme.sh --remove -d cuijunyu.win -d "*.cuijunyu.win"
```

-   更新已存在的证书

```
acme.sh --renew -d cuijunyu.win --force
```
