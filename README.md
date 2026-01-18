# 校园委托平台（前端）

简介
本仓库是校园委托平台的前端实现，基于 Vue 构建，负责 UI 与与后端交互的页面逻辑。

主要特性
- 任务委托与接单功能
- 用户登录、注册与权限控制（前端路由守卫）
- 与后端 Spring Boot API 通信
- 响应式布局，适配移动端与桌面端

技术栈
- Vue (版本请参见 package.json)
- Vue Router
- Vuex / Pinia（如有）
- Axios（用于 HTTP 请求）
- CSS / Sass

本地运行
1. 安装依赖
```bash
npm install
# 或者
yarn
```
2. 启动开发服务器
```bash
npm run serve
# 或
yarn serve
```
3. 打包构建
```bash
npm run build
# 或
yarn build
```

配置
- 请在 `.env` 或 `config` 中配置后端 API 地址，例如：
```
VUE_APP_API_BASE_URL=https://api.example.com
```

贡献
欢迎提交 issue 和 PR。请在提交前描述清楚你希望实现的功能或修复的问题，并遵循代码风格与分支规范。

许可证
根据仓库需要添加许可证（例如 MIT）。如果需要我可以一并添加 LICENSE 文件.
