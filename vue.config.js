const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false, //关闭eslint校验

    // 添加devServer配置
    devServer: {
        port: 8080, // 恢复前端开发服务器端口为 8080
        host: 'localhost',
        proxy: {
            '/api': {
                target: 'http://localhost:80', // 后端接口地址
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '' // 去掉 /api 前缀，请求将转发到 http://localhost:80/campus_entrustment/...
                }
            }
        }
    },

    // 添加 publicPath 配置以更改访问路径
    publicPath: '/campus_entrustment',

})

