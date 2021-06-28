import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import cate from '../components/goods/cate.vue'
import params from '../components/goods/Params.vue'
import list from '../components/goods/list.vue'
import Add from '../components/goods/add.vue'
import order from '../components/order/order.vue'
import report from '../components/report/report.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path:'/home',component:home,redirect:'/welcome',children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:users},
      {path:'/rights',component:rights},
      {path:'/roles',component:roles},
      {path:'/categories',component:cate},
      {path:'/params',component:params},
      {path:'/goods',component:list},
      {path:'/goods/add',component:Add},
      {path:'/orders',component:order},
      {path:'/reports',component:report}
    ]}
  ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next) =>{
  //to 将要访问的路径
  // from代表从哪个路径跳转而来
  // next 是一个函数，表示放行 
  // next() 放行 next('/login') 强制跳转到login界面
  if(to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})
export default router
