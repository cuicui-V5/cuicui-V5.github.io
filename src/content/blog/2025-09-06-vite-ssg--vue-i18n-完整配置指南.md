---
title: "Vite-SSG + Vue I18n 完整配置指南"
date: "2025-09-06T08:20:43.067Z"
description: "hi, 好久不见，我的博客终于又开始更新啦！"
categories:
  - "Web前端"
tags:
  - "vue"
---

### hi, 好久不见，我的博客终于又开始更新啦！

想知道我这段时间干啥去了， 等着我下一篇日志吧！（不知何时）

本文档基于实际项目经验，详细介绍了如何在 Vue 3 项目中正确配置和使用 Vite-SSG 与 Vue I18n 的集成方案。

## 项目概述

这是一个基于 Vue 3 的多语言静态站点项目，使用 Vite-SSG 进行静态站点生成，集成了 Vue I18n 进行国际化支持。

## 核心依赖版本

### 推荐的依赖版本组合

```json
{
    "dependencies": {
        "@intlify/unplugin-vue-i18n": "^4.0.0",
        "vue": "^3.5.18",
        "vue-i18n": "^9.14.5",
        "vue-router": "^4.5.1"
    },
    "devDependencies": {
        "vite": "^7.1.2",
        "vite-ssg": "^28.1.0",
        "@vitejs/plugin-vue": "^6.0.1"
    }
}
```

**重要说明**:

-   **@intlify/unplugin-vue-i18n 版本必须使用 v4.0.0**，v11.0.0 版本存在兼容性问题
-   vite-ssg 和 vue-i18n 的版本组合需要严格匹配

## 1. 项目结构

```
src/
├── components/          # 组件
├── composables/        # 组合式函数
├── i18n/              # i18n 配置
│   └── config.ts      # 语言配置
├── locales/           # 语言文件
│   ├── zh.json        # 中文
│   ├── en-US.json     # 英文
│   ├── ja-JP.json     # 日文
│   └── ko-KR.json     # 韩文
├── router/            # 路由配置
│   └── index.ts
├── views/             # 页面组件
├── App.vue
└── main.ts            # 主入口文件
```

## 2. Vite 配置 (vite.config.ts)

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18n from "@intlify/unplugin-vue-i18n/vite";
import path from "path";

export default defineConfig({
    plugins: [
        vue(),
        VueI18n({
            include: path.resolve(__dirname, "./src/locales/**"),
            strictMessage: false, // 允许缺失的翻译键
        }),
    ],
    ssr: {
        // SSG Vue-i18n 关键配置
        noExternal: [/vue-i18n/],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
```

### 关键配置说明

1. **VueI18n 插件**: 自动处理语言文件的导入和编译
2. **strictMessage: false**: 允许缺失的翻译键，避免构建失败
3. **ssr.noExternal**: SSG 环境下的重要配置，解决 vue-i18n 在 SSR 中的问题

## 3. i18n 配置

### 语言配置文件 (src/i18n/config.ts)

```typescript
export type Locale = "zh" | "en-US" | "ja-JP" | "ko-KR";

export const availableLocales: Locale[] = ["zh", "en-US", "ja-JP", "ko-KR"];
export const defaultLocale: Locale = "zh";

export const localeNames: Record<Locale, string> = {
    zh: "简体中文",
    "en-US": "English",
    "ja-JP": "日本語",
    "ko-KR": "한국어",
};
```

### 主入口文件 (src/main.ts) - SSG 兼容方案

**方案一：虚拟模块导入（推荐用于开发环境）**

```typescript
import { ViteSSG } from "vite-ssg";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import { routes } from "./router";
import messages from "@intlify/unplugin-vue-i18n/messages";
import { defaultLocale } from "./i18n/config";

export const createApp = ViteSSG(
    App,
    { routes, base: import.meta.env.BASE_URL },
    ({ app, router, initialState, isClient }) => {
        const i18n = createI18n({
            legacy: false,
            globalInjection: true,
            locale: defaultLocale,
            fallbackLocale: defaultLocale,
            messages,
        });

        app.use(i18n);

        // 客户端状态恢复
        if (isClient) {
            if (initialState.i18n) {
                const { locale, messages: restoredMessages } =
                    initialState.i18n;
                Object.keys(restoredMessages).forEach(lang => {
                    i18n.global.setLocaleMessage(lang, restoredMessages[lang]);
                });
                i18n.global.locale.value = locale;
            }
        }

        // 路由守卫中处理语言切换
        router.beforeEach((to, _from, next) => {
            const locale = to.meta.locale || defaultLocale;
            i18n.global.locale.value = locale as any;

            if (import.meta.env.SSR) {
                initialState.i18n = {
                    locale,
                    messages: i18n.global.messages.value,
                };
            }

            next();
        });
    },
);
```

**方案二：直接 JSON 导入（SSG 生产环境推荐）**

```typescript
import { ViteSSG } from "vite-ssg";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import { routes } from "./router";
import VueKonva from "vue-konva";
import { isAuthenticated } from "./utils/auth";
import "./assets/main.css";

// Import i18n config
import { defaultLocale } from "./i18n/config";

// Import locale messages directly for SSG compatibility
import zhMessages from "./locales/zh.json";
import enUSMessages from "./locales/en-US.json";
import jaJPMessages from "./locales/ja-JP.json";
import koKRMessages from "./locales/ko-KR.json";

// Manually create messages object for SSG
const messages = {
    zh: zhMessages,
    "en-US": enUSMessages,
    "ja-JP": jaJPMessages,
    "ko-KR": koKRMessages,
};

export const createApp = ViteSSG(
    App,
    { routes, base: import.meta.env.BASE_URL },
    ({ app, router, initialState, isClient }) => {
        // Create i18n instance with proper SSG support
        const i18n = createI18n({
            legacy: false,
            globalInjection: true,
            locale: defaultLocale,
            fallbackLocale: defaultLocale,
            messages,
            useScope: "global",
        });

        app.use(i18n);
        app.use(VueKonva);

        // Handle client-side locale restoration and persistence
        if (isClient) {
            // Try to restore locale from localStorage first
            const savedLocale = localStorage.getItem(
                "dreava-locale",
            ) as keyof typeof messages;
            if (savedLocale && messages[savedLocale]) {
                i18n.global.locale.value = savedLocale;
            }

            // Then restore from initialState if available
            if (initialState.i18n) {
                const { locale: initialStateLocale } = initialState.i18n;
                if (
                    initialStateLocale &&
                    messages[initialStateLocale as keyof typeof messages]
                ) {
                    i18n.global.locale.value = initialStateLocale;
                }
            }
        }

        router.beforeEach((to, _from, next) => {
            const routeLocale = to.meta.locale || defaultLocale;

            // Set locale for this route
            i18n.global.locale.value = routeLocale as any;

            // Save locale to localStorage on client side
            if (isClient) {
                localStorage.setItem("dreava-locale", routeLocale as string);
            }

            // Save to initialState for SSR
            if (import.meta.env.SSR) {
                initialState.i18n = {
                    locale: routeLocale,
                    messages: i18n.global.messages.value,
                };
            }

            const authenticated = isAuthenticated();
            const requiresAuth = to.matched.some(
                record => record.meta.requiresAuth,
            );
            const requiresGuest = to.matched.some(
                record => record.meta.requiresGuest,
            );

            if (requiresAuth && !authenticated) {
                return next({
                    name: `${routeLocale}-Login`,
                    query: { redirect: to.fullPath },
                });
            } else if (requiresGuest && authenticated) {
                return next(`/${routeLocale}/feature/beautify`);
            } else {
                next();
            }
        });
    },
);
```

## 4. 多语言路由配置

### 路由文件 (src/router/index.ts)

```typescript
import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { availableLocales, defaultLocale } from "../i18n/config";

// 基础路由配置
const baseRoutes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/Landing.vue"),
        meta: {
            title: "首页",
        },
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/Login.vue"),
        meta: {
            title: "登录",
        },
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/Register.vue"),
        meta: {
            title: "注册",
        },
    },
    {
        path: "/feature",
        name: "feature",
        component: () => import("../views/FeatureLayout.vue"),
        children: [
            // 子路由配置
        ],
    },
];

// 多语言路由包装器
function createLocalizedRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
    const localizedRoutes: RouteRecordRaw[] = [];

    availableLocales.forEach(locale => {
        // 默认语言重定向
        if (locale === defaultLocale) {
            localizedRoutes.push({
                path: "/",
                redirect: `/${defaultLocale}`,
            });
        }

        // 为每个语言创建路由
        routes.forEach(route => {
            const localizedRoute = { ...route };
            localizedRoute.path = `/${locale}${route.path}`;
            localizedRoute.name = `${locale}-${String(route.name)}`;
            localizedRoute.meta = {
                ...route.meta,
                locale,
            };

            // 处理子路由名称
            if (localizedRoute.children) {
                localizedRoute.children = localizedRoute.children.map(
                    child => ({
                        ...child,
                        name: child.name
                            ? `${locale}-${String(child.name)}`
                            : undefined,
                    }),
                );
            }

            localizedRoutes.push(localizedRoute);
        });
    });

    return localizedRoutes;
}

// 创建路由
const router = createRouter({
    history: createWebHistory(),
    routes: createLocalizedRoutes(baseRoutes),
});

export { routes };
export default router;
```

### 路由命名规则

-   基础路由名称: `home`, `Login`, `Register`
-   多语言路由名称: `zh-home`, `en-US-Login`, `ja-JP-Register`
-   子路由名称: `zh-feature-beautify`, `en-US-feature-enhance`

## 5. 语言文件结构

### 语言文件示例 (src/locales/zh.json)

```json
{
    "app": {
        "name": "DreavaAI",
        "title": "AI图片生成与修图平台"
    },
    "nav": {
        "home": "首页",
        "login": "登录",
        "register": "注册",
        "profile": "个人中心"
    },
    "home": {
        "hero": {
            "title": "AI驱动的创意图像处理",
            "subtitle": "让AI为您的图片注入创意与活力",
            "description": "立即加入我们庞大的创作者社区，释放你的无限潜能",
            "cta": "免费注册，即刻体验",
            "features": "查看功能"
        },
        "features": {
            "title": "强大功能",
            "subtitle": "为创作者打造的AI工具集"
        },
        "landing": {
            "feature1": "文字生图",
            "feature2": "图片修图",
            "feature3": "风格迁移"
        }
    },
    "features": {
        "items": {
            "text-to-image": {
                "name": "文字生图",
                "description": "根据文字描述，智能生成高质量图片"
            },
            "image-enhance": {
                "name": "图片增强",
                "description": "提升图片质量，增强细节和色彩"
            }
        }
    }
}
```

## 6. 组件中使用 i18n

### 基础使用方式

```vue
<template>
    <div>
        <h1>{{ t("home.hero.title") }}</h1>
        <p>{{ t("home.hero.description") }}</p>
        <button>{{ t("home.hero.cta") }}</button>
    </div>
</template>

<script setup lang="ts">
    import { useI18n } from "vue-i18n";

    const { t } = useI18n();
</script>
```

### 动态路由跳转

```vue
<template>
    <router-link :to="getLocalizedPath('/profile')">
        {{ t("nav.profile") }}
    </router-link>
</template>

<script setup lang="ts">
    import { useI18n } from "vue-i18n";

    const { locale } = useI18n();

    // 获取本地化路径
    const getLocalizedPath = (path: string) => {
        const cleanPath = path.replace(/^\//, "");
        return `/${locale.value}/${cleanPath}`;
    };
</script>
```

### 语言切换组件 - 增强版（支持 localStorage 持久化）

```vue
<template>
    <div class="language-switcher">
        <div class="relative">
            <button
                @click="toggleDropdown"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200"
                :class="{ 'bg-white/20': isOpen }"
            >
                <span class="text-sm font-medium">{{ currentFlag }}</span>
                <span class="text-sm">{{ currentLanguageName }}</span>
                <svg
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isOpen }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            <div
                v-if="isOpen"
                class="absolute right-0 mt-2 w-48 rounded-lg bg-white/95 backdrop-blur-md border border-white/20 shadow-lg overflow-hidden z-50"
            >
                <div
                    v-for="locale in availableLocales"
                    :key="locale"
                    @click="changeLanguage(locale)"
                    class="flex items-center space-x-3 px-4 py-3 hover:bg-white/20 cursor-pointer transition-colors duration-150"
                    :class="{ 'bg-white/10': locale === currentLocale }"
                >
                    <span class="text-lg">{{ getFlag(locale) }}</span>
                    <div class="flex-1">
                        <div class="text-sm font-medium text-gray-900">
                            {{ getLanguageName(locale) }}
                        </div>
                        <div class="text-xs text-gray-600">
                            {{ locale }}
                        </div>
                    </div>
                    <svg
                        v-if="locale === currentLocale"
                        class="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from "vue";
    import { useI18n } from "vue-i18n";
    import { useRouter, useRoute } from "vue-router";
    import { availableLocales, localeNames, type Locale } from "../i18n/config";

    const { locale } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const isOpen = ref(false);

    const currentLocale = computed(() => locale.value as Locale);
    const currentLanguageName = computed(
        () => localeNames[currentLocale.value],
    );
    const currentFlag = computed(() => getFlag(currentLocale.value));

    const toggleDropdown = () => {
        isOpen.value = !isOpen.value;
    };

    const changeLanguage = (newLocale: Locale) => {
        if (newLocale === currentLocale.value) {
            isOpen.value = false;
            return;
        }

        // Save to localStorage for persistence
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("dreava-locale", newLocale);
        }

        const newPath = route.path.replace(
            `/${currentLocale.value}`,
            `/${newLocale}`,
        );
        router.push(newPath);

        isOpen.value = false;
    };

    const getFlag = (locale: Locale): string => {
        const flags: Record<Locale, string> = {
            zh: "🇨🇳",
            "en-US": "🇺🇸",
            "ja-JP": "🇯🇵",
            "ko-KR": "🇰🇷",
        };
        return flags[locale] || "🌐";
    };

    const getLanguageName = (locale: Locale): string => {
        return localeNames[locale];
    };

    // 点击外部关闭下拉菜单
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest(".language-switcher")) {
            isOpen.value = false;
        }
    };

    if (typeof document !== "undefined") {
        document.addEventListener("click", handleClickOutside);
    }
</script>

<style scoped>
    .language-switcher {
        @apply relative;
    }

    /* 确保下拉菜单在其他元素上方 */
    .z-50 {
        z-index: 50;
    }
</style>
```

## 7. 功能国际化 Composable

```typescript
// src/composables/useFeatureI18n.ts
import { useI18n } from "vue-i18n";

export function useFeatureI18n() {
    const { t } = useI18n();

    function getFeatureName(feature: any) {
        if (feature.i18nKey) {
            const translatedName = t(`features.items.${feature.i18nKey}.name`);
            return translatedName !== `features.items.${feature.i18nKey}.name`
                ? translatedName
                : feature.name;
        }
        return feature.name;
    }

    function getFeatureDescription(feature: any) {
        if (feature.i18nKey) {
            const translatedDesc = t(
                `features.items.${feature.i18nKey}.description`,
            );
            return translatedDesc !==
                `features.items.${feature.i18nKey}.description`
                ? translatedDesc
                : feature.description;
        }
        return feature.description;
    }

    function getCategoryName(categoryName: string) {
        const translatedName = t(`features.categories.${categoryName}`);
        return translatedName !== `features.categories.${categoryName}`
            ? translatedName
            : categoryName;
    }

    return {
        getFeatureName,
        getFeatureDescription,
        getCategoryName,
    };
}
```

## 8. 构建脚本

### package.json

```json
{
    "scripts": {
        "dev": "vite",
        "build": "vue-tsc -b && vite-ssg build",
        "preview": "vite preview",
        "type-check": "vue-tsc --noEmit"
    }
}
```

## 9. 常见问题和解决方案

### 1. SSG 水合问题 - 显示占位符文本

**问题**: 静态生成后的网页显示 `home.hero.title` 等占位符文字，而不是实际翻译内容

**根本原因**: 虚拟模块导入在 SSG 环境下无法正确处理，导致水合时消息对象为空

**解决方案**:

```typescript
// 替换虚拟模块导入为直接 JSON 导入
// 错误的方式:
import messages from "@intlify/unplugin-vue-i18n/messages";

// 正确的方式 (SSG 兼容):
import zhMessages from "./locales/zh.json";
import enUSMessages from "./locales/en-US.json";
import jaJPMessages from "./locales/ja-JP.json";
import koKRMessages from "./locales/ko-KR.json";

const messages = {
    zh: zhMessages,
    "en-US": enUSMessages,
    "ja-JP": jaJPMessages,
    "ko-KR": koKRMessages,
};
```

### 2. 语言切换在静态构建中失效

**问题**: 开发环境语言切换正常，但静态构建后语言切换无效

**解决方案**:

1. **添加 localStorage 持久化**:

```typescript
// 在 main.ts 中添加
if (isClient) {
    const savedLocale = localStorage.getItem(
        "dreava-locale",
    ) as keyof typeof messages;
    if (savedLocale && messages[savedLocale]) {
        i18n.global.locale.value = savedLocale;
    }
}
```

2. **更新语言切换组件**:

```typescript
const changeLanguage = (newLocale: Locale) => {
    // 保存到 localStorage
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("dreava-locale", newLocale);
    }

    const newPath = route.path.replace(
        `/${currentLocale.value}`,
        `/${newLocale}`,
    );
    router.push(newPath);
};
```

### 3. SSG 构建失败

**问题**: `The requested module '@intlify/shared' does not provide an export named 'incrementer'`

**解决方案**:

```json
// 将 @intlify/unplugin-vue-i18n 版本降级到 4.0.0
"@intlify/unplugin-vue-i18n": "^4.0.0"
```

### 4. 路由匹配警告

**问题**: `No match found for location with path /zh/feature/beautify`

**解决方案**:

-   检查路由配置中的 `requiresAuth` 是否阻止了 SSG 渲染
-   确保子路由名称正确生成
-   移除 SSG 不支持的路由守卫

### 5. 翻译键缺失

**问题**: 构建时因缺失翻译键而失败

**解决方案**:

```typescript
// vite.config.ts
VueI18n({
    include: path.resolve(__dirname, "./src/locales/**"),
    strictMessage: false, // 允许缺失的翻译键
});
```

### 6. 开发环境路由警告

**问题**: 开发时出现路由匹配警告

**解决方案**:

-   使用 `getLocalizedPath` 函数生成正确的路由路径
-   确保所有硬编码的路由路径都替换为本地化路径

## 10. SSG 兼容性最佳实践

### 1. 导入策略

**开发环境**: 使用虚拟模块导入（热重载友好）

```typescript
import messages from "@intlify/unplugin-vue-i18n/messages";
```

**生产环境**: 使用直接 JSON 导入（SSG 兼容）

```typescript
import zhMessages from "./locales/zh.json";
import enUSMessages from "./locales/en-US.json";
// ... 其他语言文件
```

### 2. 状态管理

**SSR 状态同步**:

```typescript
if (import.meta.env.SSR) {
    initialState.i18n = {
        locale: routeLocale,
        messages: i18n.global.messages.value,
    };
}
```

**客户端状态恢复**:

```typescript
if (isClient) {
    // 优先从 localStorage 恢复
    const savedLocale = localStorage.getItem("dreava-locale");
    if (savedLocale && messages[savedLocale]) {
        i18n.global.locale.value = savedLocale;
    }

    // 然后从 initialState 恢复
    if (initialState.i18n) {
        const { locale: initialStateLocale } = initialState.i18n;
        if (initialStateLocale && messages[initialStateLocale]) {
            i18n.global.locale.value = initialStateLocale;
        }
    }
}
```

### 3. 构建优化

**预构建验证**:

```bash
# 开发构建
npm run dev

# 类型检查
npm run type-check

# 生产构建
npm run build
```

**静态文件检查**:

-   检查 `dist/` 目录下的 HTML 文件是否包含正确的翻译内容
-   验证多语言路由是否正确生成
-   确认语言切换功能在静态环境中正常工作

## 11. 最佳实践

### 1. 版本管理

-   严格遵循推荐的依赖版本组合
-   定期更新依赖，但要注意兼容性

### 2. 路由设计

-   使用 URL 路径作为语言标识
-   为每个语言版本生成独立的路由
-   确保路由名称的唯一性

### 3. 性能优化

-   使用虚拟模块导入语言文件
-   按需加载语言资源
-   合理使用 SSR 状态同步

### 4. 开发体验

-   提供 TypeScript 类型支持
-   使用 composables 封装常用功能
-   保持代码结构清晰

## 12. 部署注意事项

### 1. 静态资源

-   确保所有静态资源路径正确
-   配置正确的 base URL

### 2. 路由配置

-   配置服务器的 URL 重写规则
-   确保多语言路由正常工作

### 3. 缓存策略

-   为不同语言版本设置适当的缓存
-   考虑语言切换时的缓存更新

## 总结

本配置指南提供了一个完整的 Vite-SSG + Vue I18n 集成方案，包括：

1. **正确的依赖版本组合**
2. **完整的配置文件示例**
3. **多语言路由实现**
4. **组件中使用 i18n 的最佳实践**
5. **常见问题的解决方案**
6. **SSG 兼容性最佳实践**
7. **性能优化建议**

按照此指南配置，可以构建一个功能完善、性能优良的多语言静态站点。

### 重要更新说明

**2025 年更新**: 基于实际项目经验，文档新增了以下关键内容：

-   **SSG 水合问题解决方案**: 详细解决了静态构建显示占位符文本的问题
-   **语言持久化机制**: 添加 localStorage 支持确保语言设置在静态环境中正常工作
-   **双重导入策略**: 提供开发环境和生产环境的不同导入方案
-   **状态管理优化**: 完善了 SSR 状态同步和客户端状态恢复机制
-   **构建验证流程**: 新增静态文件检查和验证步骤

这些更新确保了 Vite-SSG + Vue I18n 在真实生产环境中的稳定性和可靠性。

## 参考资源

-   [Vite-SSG 官方文档](https://github.com/antfu/vite-ssg)
-   [Vue I18n 官方文档](https://vue-i18n.intlify.dev/)
-   [@intlify/unplugin-vue-i18n 文档](https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n)
