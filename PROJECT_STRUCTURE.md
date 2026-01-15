# 项目结构说明文档

## 1. 项目概况
**项目名称**: campus_entrustment (校园委托平台)
**项目描述**: 基于 Vue 2.x 开发的校园委托服务平台，提供用户发布、接受委托及后台管理功能。

## 2. 技术栈
- **核心框架**: Vue.js 2.6.14
- **UI 组件库**: Element UI 2.15.14, Layui 2.9.7
- **状态管理**: Vuex 3.6.2
- **路由管理**: Vue Router 3.6.5
- **HTTP 请求**: Axios 1.8.3
- **模拟数据**: Mock.js 1.1.0
- **图表库**: ECharts 5.1.2
- **其他工具**:
  - `ali-oss`: 阿里云 OSS 上传
  - `moment`: 时间处理
  - `js-cookie`: Cookie 操作

## 3. 目录结构说明

```
campus_entrustment/
├── public/                     # 静态资源目录
│   ├── index.html              # HTML 模板文件
│   └── ...                     # 其他静态图片及图标
├── src/                        # 源代码目录
│   ├── api/                    # API 接口管理
│   │   ├── mockServeData/      # Mock 模拟数据处理逻辑
│   │   ├── index.js            # API 统一导出
│   │   └── ...                 # 各模块 API 定义
│   ├── assets/                 # 项目静态资源 (图片、CSS 等)
│   ├── components/             # 公共组件
│   │   ├── CommonAside.vue     # 通用侧边栏
│   │   ├── CommonHeader.vue    # 通用头部
│   │   ├── CommonTag.vue       # 通用标签页导航
│   │   └── ...                 # 其他业务组件
│   ├── css/                    # 全局样式文件
│   ├── layui/                  # Layui 集成配置
│   ├── router/                 # 路由配置
│   │   └── index.js            # 路由定义及拦截器
│   ├── store/                  # Vuex 状态管理
│   │   ├── tab.js              # 菜单及标签页状态
│   │   ├── userInfo.js         # 用户信息状态
│   │   └── ...                 # 其他状态模块
│   ├── utils/                  # 工具函数
│   │   ├── request.js          # Axios 封装
│   │   ├── ailiyun.js          # 阿里云 OSS 工具
│   │   └── ...                 # 其他通用工具
│   ├── views/                  # 页面组件
│   │   ├── admin/              # 管理员相关页面 (审核、通知、用户管理等)
│   │   ├── user/               # 用户相关页面 (发布委托、我的委托等)
│   │   ├── login.vue           # 登录页
│   │   ├── Main.vue            # 主布局组件
│   │   ├── Home.vue            # 首页
│   │   └── ...                 # 其他页面
│   ├── App.vue                 # 根组件
│   └── main.js                 # 入口文件
├── .gitignore                  # Git 忽略配置
├── babel.config.js             # Babel 配置
├── package.json                # 项目依赖及脚本配置
├── vue.config.js               # Vue CLI 项目配置
└── README.md                   # 项目说明
```

## 4. 核心模块说明

### 4.1 视图层 (Views)
页面主要分为前台用户功能和后台管理功能：
- **Login**: `views/login.vue` 处理用户登录。
- **Layout**: `views/Main.vue` 是主要布局容器，包含侧边栏 (`CommonAside`) 和头部 (`CommonHeader`)。
- **Admin**: `views/admin/` 目录下包含管理员功能，如审核列表 (`AuditList`)、通知管理 (`Notifications`)、用户管理 (`UserList`) 等。
- **User**: `views/user/` 目录下包含用户功能，如创建委托 (`CreateDelegation`)、查看进行中委托 (`ViewOnGoingList`) 等。

### 4.2 状态管理 (Store)
使用 Vuex 管理全局状态，主要模块包括：
- `tab`: 管理侧边栏菜单折叠状态及面包屑导航。
- `userInfo`: 管理登录用户信息及权限。

### 4.3 网络请求 (API & Utils)
- `utils/request.js`: 封装了 Axios 实例，包含请求拦截器和响应拦截器。
- `api/`: 定义了各个模块的接口请求方法。
- `mock`: 项目集成了 Mock.js，用于在无后端接口时模拟数据响应。

## 5. 常用命令

- **启动开发服务器**:
  ```bash
  npm run serve
  ```
- **构建生产环境**:
  ```bash
  npm run build
  ```
- **代码格式检查**:
  ```bash
  npm run lint
  ```
