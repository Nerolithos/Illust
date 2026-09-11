# LITHOS 插画作品集

React / Vinext 静态作品集，包含 24 幅本地插画、响应式画廊与可键盘操作的大图浏览。

## 运行

需要 Node.js >= 22.13。

```sh
npm install
npm run dev
npm run build
```

静态导出位于 `dist/client`。

## 图片

仅保留 `public/images` 中的 WebP：24 幅作品各有 480、960、1600 像素长边版本，以及头像和图标，共 74 个文件，4,404,564 字节。原始 JPG/PNG 已按要求删除。浏览器图标单独使用 `public/favicon.ico`。

页面使用响应式 srcset / sizes、首图高优先级、延迟加载、异步解码、固定尺寸和离屏渲染优化，大图按需挂载。

## Cloudflare Pages

- 框架：React 19 + Vinext（Vite），静态导出；框架预设选 None。
- 构建命令：`npm run build`
- 输出目录：`dist/client`
- Node 环境变量：`NODE_VERSION=24`
- 根目录：留空（项目现位于 Illust 仓库根目录）。
- 本地开发：`npm run dev`
- 本地预览构建结果：先 `npm run build`，再 `npm start`，访问 http://localhost:3000。
- Pages 静态托管无需配置生产运行命令。

作品标题和简介是可编辑的初始展示文案，画师名暂用 Lithos。编辑 `app/page.tsx` 可修改文案、排序，编辑 `app/globals.css` 可修改样式。

## Cloudflare Workers（有 Deploy command 的部署页面）

- 构建命令：`npm run build`
- 部署命令：`npm run deploy`
- 根目录：留空。
- 环境变量：`NODE_VERSION=24`
- `deploy/wrangler.jsonc` 的 `name` 必须与 Cloudflare 中的 Worker 名称一致，当前为 `illust`。
- 使用提交的 `package-lock.json` 和锁定的 Wrangler 4.92.0。不要在部署步骤安装 `wrangler@latest`。
- 配置显式指定静态资源 `dist/client`，避免触发框架自动配置和依赖升级。
- 本地验证部署配置：`npm run deploy -- --dry-run`（不会发布）。

部署配置单独位于 `deploy/`，由 `npm run deploy` 显式加载。不要将它移回根目录：当前 Vinext 版本会把根目录 Wrangler 配置识别为服务端 Workers 构建，要求 Cloudflare Vite 插件；本项目使用静态导出。
