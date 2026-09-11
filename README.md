# LITHOS 插画作品集

React / Vinext 静态作品集，包含 21 幅本地插画、响应式画廊与可键盘操作的大图浏览。

## 运行

需要 Node.js >= 22.13。

```sh
npm install
npm run dev
npm run build
```

静态导出位于 `dist/client`。

## 图片

原图保存在上一级 `assets` 和 `icon` 文件夹，网页只使用 `public/images` 中的 WebP。

使用 Pillow 执行上一级 `scripts/optimize-images.py` 可重新生成图片和 `artworks.json`。脚本自动处理 EXIF 方向，保留透明通道，生成长边 480、960、1600 像素三个尺寸（头像和图标 256 像素），质量 82，并清除源文件元数据。原图不被覆盖。

原始素材 38,331,248 字节；全部 WebP 变体 3,935,860 字节，合计减少 89.7%。页面使用正确的实际宽度 srcset 描述符、响应式 sizes、首图高优先级、延迟加载、异步解码、固定尺寸和离屏渲染优化。大图只在打开时挂载。

作品展示标题和简介属于可编辑的初始文案，不代表源文件已有的官方标题；画师名暂用 Lithos。编辑 `app/page.tsx` 可修改文案、排序；编辑 `app/globals.css` 可修改视觉样式。
