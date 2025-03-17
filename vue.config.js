const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false, //关闭eslint校验

    // 添加devServer配置
    devServer: {
        port: 8080, // 修改端口为3000
        host: 'localhost', // 修改主机为特定IP地址
    },

    // 添加 publicPath 配置以更改访问路径
    publicPath: '/campus_entrustment',

})

