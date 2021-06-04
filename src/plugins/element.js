import Vue from 'vue'
import {
    Button,
    Message,
    Form,
    FormItem,
    Input,
    Main,
    Container,
    Aside,
    Header,
    Menu,
    MenuItem,
    Submenu,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox
} from 'element-ui'
Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
// 构造函数上添加方法，所有的实例都能用
Vue.prototype.$message = Message;
Vue.use(Main);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Header);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.prototype.$confirm = MessageBox.confirm;