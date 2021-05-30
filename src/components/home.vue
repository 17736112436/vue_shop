<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },methods:{
        logout(){
            window.sessionStorage.clear();//清除token
            this.$router.push('/login')
        }
    }
}
// 退出功能实现原理，清除token，编程式导航跳转页面
</script>

<style  scoped>
    
</style>