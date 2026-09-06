---
title: "通过nginx反代openai api"
date: "2023-03-06 20:45:45"
description: "最近 openai 发布了 chatGPT 同款的 GPT3.5 trubo API, 并且价格十分低廉, 正当大家跃跃欲试的时候却发现 GFW 却已经先我们一步了..."
categories:
  - "技术分享"
tags:
  - "nginx"
  - "openai"
---

最近 openai 发布了 chatGPT 同款的 GPT-3.5 trubo API, 并且价格十分低廉, 正当大家跃跃欲试的时候却发现 GFW 却已经先我们一步了...

<!-- more -->

那么解决方案也很简单, 首先你需要一台安装了 nginx 境外服务器, 然后配置如下即可使用

```

server {
	listen 8443 ssl;
	server_name openai.example.com;
	ssl_certificate /etc/nginx/ssl/cuijunyu.pem;
	ssl_certificate_key /etc/nginx/ssl/cuijunyu.key;
        ssl_protocols TLSv1.2 TLSv1.3;
	location / {
		proxy_pass https://api.openai.com/;
		proxy_set_header Host api.openai.com;
		proxy_set_header X-Real-IP $remote_addr;
	}
}

```

请求 api 的时候, 你只需要把 URL 换成 openai.example.com 就可以了
