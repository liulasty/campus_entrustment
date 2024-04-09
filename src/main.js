import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';
import './api/mock';




//用来关闭 Vue 在启动时的生产提示
Vue.config.productionTip = false
//全局注册 ElementUI 组件库
Vue.use(ElementUI);

// to: 即将要进入的目标 用一种标准化的方式
// from: 当前导航正要离开的路由 用一种标准化的方式
// 添加全局前置导航守卫
// router.beforeEach((to, from, next) => {
//   try {

//     const token = localStorage.getItem('jwtToken');;
//     console.log("JWT", token);

//     // 使用常量管理重定向路径
//     const LOGIN_PATH = '/login';
//     const REGISTER_PATH = '/register';
//     const HOME_PATH = '/home';
//     const PUBLIC_PATHS = [LOGIN_PATH, REGISTER_PATH, '/'];

//     if (token) { // token存在
//       if (!PUBLIC_PATHS.includes(to.path)) {
//         next();
//       } else {
//         // 如果token存在但是用户尝试访问登录或注册页面，重定向到主页
//         next(HOME_PATH);
//       }
//     } else { // token不存在
//       if (!PUBLIC_PATHS.includes(to.path)) {
//         // 如果用户未登录但是尝试访问非公开页面，重定向到登录页
//         next(LOGIN_PATH);
//       } else {
//         next(); // 允许访问公开页面
//       }
//     }
//   } catch (error) {
//     console.error('导航守卫错误:', error);
//     // 根据实际情况处理异常，例如重定向到错误页面或显示错误信息
//     next('/error');
//   }
// })

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});