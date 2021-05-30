import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL=`http://127.0.0.1:8888/api/private/v1/`
Vue.prototype.$http = axios;//给vue的原型对象上添加方法，所有的vue实例都能访问
// 导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false

new Vue({
  router, // 将路由挂载到页面上
  render: h => h(App)// 将APP渲染到页面
}).$mount('#app')
