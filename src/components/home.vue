<template>
    <el-container class="container">
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="错误的信息">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="toggle">|||</div>
                <!-- router为true为开启路由 路由的地址就是index -->
                <!-- 侧边栏菜单区域 （导航菜单的基本使用）需要加冒号不加冒号为字符串，加了冒号为布尔值 -->
                <el-menu  router :unique-opened="true" :collapse="isCollapse" background-color="#333744" text-color="#fff" 
                active-text-color="#409eff" :collapse-transition="false" :default-active="activePath">
                    <!-- 一级菜单 通过拼接空字符串的方式将number装换为字符串类型-->
                    <el-submenu :key="item.id"  v-for="item in MenuList" :index="item.id+''">
                        <!-- 一级菜单模板区域 -->
                      <template slot="title">
                          <!-- 图标 -->
                        <i :class="iconObj[item.id]"></i>
                        <!-- 文本 -->
                        <span>{{item.authName}}</span>
                      </template>
                      <!-- 二级菜单循环，循环当前item项的childern属性 -->
                      <el-menu-item @click="saveNavState('/'+subitem.path)" :index="'/'+subitem.path" :key="subitem.id" v-for="subitem in item.children">
                        <template slot="title">
                            <!-- 通过item.id的独有性，创建一个对象里面有图标类 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subitem.authName}}</span>
                        </template>
                      </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
        <el-main>
            <!-- 子路由占位符 -->
            <router-view></router-view>
        </el-main>
        </el-container>
   </el-container>
</template>
<script>
export default {
    data(){
        return{
            MenuList:[],
            iconObj:{
                125:'iconfont icon-user',
                103:'iconfont icon-tijikongjian',
                101:'iconfont icon-shangpin',
                102:'iconfont icon-danju',
                145:'iconfont icon-baobiao'
            },
            // 是否折叠
            isCollapse:false,
            activePath:''
        }
    },methods:{
        logout(){
            window.sessionStorage.clear();//清除token
            this.$router.push('/login');
        },
        async getMenuList(){
            const {data:res} = await this.$http('menus');
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.MenuList = res.data
            console.log(res);
        },
        // 点击按钮切换菜单的折叠与展开
        toggle(){
            this.isCollapse =!this.isCollapse;
        },
        // 保存链接的激活状态 
        saveNavState(path){
            window.sessionStorage.setItem('active',path)
            this.activePath=window.sessionStorage.getItem('active')
        }
    },
    // 定义生命周期函数，在页面加载完之后就要获取数据
    created(){
        this.getMenuList()
        this.activePath=window.sessionStorage.getItem('active')
    }
}
// 退出功能实现原理，清除token，编程式导航跳转页面
</script>

<style  scoped>
    .el-header {
        padding-left: 0;
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 20px;
    }
    .el-header div{
        display: flex;
        align-items: center;
    }
    .el-header span {
        margin-left: 15px;
    }
    .el-aside {
        background-color: #333744;
    }
     .el-aside .el-menu{
         border-right: none;
     }
    .container {
        height: 100%;
    }
    .iconfont{
        margin-right: 10px;
    }
    .toggle-button{
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #ffff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>