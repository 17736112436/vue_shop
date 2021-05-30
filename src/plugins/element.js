import Vue from 'vue'
import { Button,Message,Form,FormItem,Input } from 'element-ui'
Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
// 构造函数上添加方法，所有的实例都能用
Vue.prototype.$message = Message;
