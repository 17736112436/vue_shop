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
import TreeTable from 'vue-table-with-tree-grid'
// 导入编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入父文本编辑器对应的样式
import 'quill/dist/quill.core.css' 
import 'quill/dist/quill.snow.css' 
import 'quill/dist/quill.bubble.css' 
// 在挂载之前设置请求拦截器
axios.interceptors.request.use(config=>{
   config.headers.Authorization = window.sessionStorage.getItem('token');
  //  console.log(config);
   return config;
})
Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)
// 将父文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor);
// 注册全局过滤器
Vue.filter('dataFormat',function(originval){
  const dt = new Date(originval)
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')
  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router, // 将路由挂载到页面上
  render: h => h(App)// 将APP渲染到页面
}).$mount('#app')
