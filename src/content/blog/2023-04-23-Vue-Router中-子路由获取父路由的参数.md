---
title: "Vue Router中 子路由获取父路由的参数"
date: "2023-04-23 10:19:29"
description: "一句话总结 可以给routerview 组件绑定 props, 这样内部的路由组件就会获取到参数了"
categories:
  - "Web前端"
tags:
  - "vue"
  - "vue-router"
---

一句话总结 可以给`router-view` 组件绑定 props, 这样内部的路由组件就会获取到参数了

如果一个子路由需要获取其上一级的路由参数，你可以在定义该子路由时使用 `props` 属性将父路由参数传递给子路由组件。然后，再在子路由组件中使用 `this.$route.params` 来获取父路由参数。

例如，假设有这样的路由结构：

```
{
  path: '/user/:userId',
  component: UserComponent,
  children: [
    {
      path: 'profile',
      component: ProfileComponent
    }
  ]
}
```

假设我们想让 `ProfileComponent` 组件能够获取到它的上一级 (`UserComponent`) 的路由参数（即 `userId`），则需要在 `UserComponent` 内部定义 `ProfileComponent` 子路由，并将父路由参数作为 `props` 传递给子组件。

具体代码如下：

```
// UserComponent.vue
<template>
  <div>
    <h1>User Profile</h1>
    <router-view :user-id="$route.params.userId"></router-view>
  </div>
</template>

<script>
export default {
  //...
}
</script>
```

```
// ProfileComponent.vue
<template>
  <div>
    <h2>Profile Component</h2>
    <p>User ID: {{ userId }}</p>
  </div>
</template>

<script>
export default {
  props: ['userId'], // 将父组件传递过来的 userId 强制绑定为 props
  mounted() {
    console.log('User ID:', this.userId); // 获取父组件路由参数
  }
}
</script>
```

在上述代码中，我们将 `$route.params.userId` 通过属性绑定传递给子组件，然后在 `ProfileComponent` 的 `mounted` 钩子函数中就可以通过 `this.userId` 获取到它的上一级路由参数了。
