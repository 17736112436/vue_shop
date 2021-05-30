<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登陆表单区域 ref即为表单的实例对象-->
      <el-form
        ref="loginFormref"
        :model="loginForm"
        :rules="loginFormrules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 在表单item中用prop属性 -->
        <el-form-item prop="username">
          <!-- 通过属性的方式添加图标 prefix-icon添加前置小图标-->
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆 </el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 登陆表单数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //表单验证规则对象
      loginFormrules: {
        username: [
          { required: true, message: "请输入登陆名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登陆密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //点击重置按钮重置登陆表单
    resetForm() {
      // 获取表单对象
      console.log(this);
      //loginFormref为表单实例对象
      this.$refs.loginFormref.resetFields();
      // this.$ref.resetFields();
    },
    //表单的预验证
    login() {
      this.$refs.loginFormref.validate(async (valid) => {
        // console.log(valid);
        if (!valid) {
          return; //当验证错误的时候不发起请求
        }
        // 发请求
        // 利用对象的解构赋值 data为响应体数据
        const { data: res } = await this.$http.post("login", this.loginForm);
        // console.log(res);//result.data为响应体数据
        if (res.meta.status !== 200) return this.$message.error("登陆失败");
        this.$message.success("登陆成功");
        // 1将登陆成功之后的token，把服务器颁发的token信息保存到客户端的sessionStorage中
        // 1.1项目中除了登陆之外的其他API接口，必须在登陆之后才能访问
        //1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 2通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push("/home");
      });
    },
  },
};
</script>
<style  scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  padding: 10px;
  border: 1px #eee solid;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #ddd;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
