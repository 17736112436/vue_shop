<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            @clear="getUserList()"
            clearable
            v-model="queryInfo.query"
          >
            <!-- 点击按钮重新调用获取数据 -->
            <el-button
              @click="getUserList()"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table stripe border :data="userlist">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 指定了作用域插槽，就不用写prop属性 -->
          <template slot-scope="scope">
            <!-- scope.row 直接取到该单元格对象，就是数组里的元素对象 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="mini" @click="showEditDialog(scope.row.id)"
              icon="el-icon-edit"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete" @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="分配角色"
              placement="top-start"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
        <!-- layout用来显示条上都显示哪些内容 -->
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close='addDialogClosed'>
       <el-form :model="addForm" :rules="addRules" ref="addFormref" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed"
      >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
        <el-form-item label="用户名" >
          <!-- 通过disabled设置输入框不可用 -->
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" >
          <el-input v-model="editForm.mobile" prop="mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
      >
      <div>
        <p>当前用户:{{userinfo.username}}</p>
        <p>当前角色:{{userinfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    const checkemail = (rule,value,cb)=>{
      // 验证邮箱的正则表达式
      const regEmail =/^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        // 验证通过直接调用callback函数 一点要写函数调用形式不然预验证的时候会出错
        cb()
      }
      // 失败时传入一个Error实例
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    const checkmobile = (rule,value,cb)=>{
      // 验证手机号的正则表达式
      const regMobile = /^1[3|4|5|7|8][0-9]{9}$/
      if(regMobile.test(value)){
        cb()
      }
      cb(new Error("请输入合法手机号"))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        //   获取参数
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      // 保存获取数据
      userlist: [],
      total: 0,
      //   控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      // 添加表单验证对象
      addRules:{
        username:[
          { required: true, message: "请输入用户名", trigger: "blur" },
          {min: 3,max: 10,message: "长度在 3 到 10 个字符",trigger: "blur"}
        ],
        password:[
          { required: true, message: "请输入密码", trigger: "blur" },
          {min: 6,max: 15,message: "长度在 3 到 10 个字符",trigger: "blur"}
        ],
        email:[
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {validator:checkemail,trigger:'blur'}
        ],
        mobile:[
          { required: true, message: "请输入手机号", trigger: "blur" },
          {validator:checkmobile,trigger:'blur'}
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible:false,
      editForm:{},
      editFormRules:{
        email:[
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {validator:checkemail,trigger:'blur'}
        ],
        mobile:[
          { required: true, message: "请输入手机号", trigger: "blur" },
          {validator:checkmobile,trigger:'blur'}
        ]
      },
      // 控制分配角色的显示与隐藏
      setRoleDialogVisible:false,
      // 需要被分配角色的用户信息
      userinfo:{},
      // 所有角色的数据列表
      rolelist:[],
      // 已选中的角色Id值
      selectedRoleId:''
    }
  },
  created() {
    // 获取数据
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.userlist = res.data.users;
      this.total = res.data.total;
      // console.log(this.userlist);
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
      // console.log(this.userlist);
    },
    //监听页码值改变事件 newPage为改变后页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async userStatusChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      return this.$message.success(`更新用户状态成功`);
    },
    // 监听对话框关闭事件
    addDialogClosed(){
      // 关闭之后重置表单字段
      this.$refs.addFormref.resetFields()
    },//添加用户预验证
    adduser(){
      this.$refs.addFormref.validate(async (valid)=>{
        // console.log(valid)
        if(!valid) {
          return;
          }
        // 发起网络请求添加一个新用户
        const {data:res} = await this.$http.post('users',this.addForm) 
        if(res.meta.status!=201){
          this.$message.error("用户创建失败！")
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        // 重新获取用户数据
        this.getUserList()
      })
      
    },
    async showEditDialog(id){
      const {data:res} = await this.$http.get(`users/${id}`)
      if(res.meta.status!=200) return this.$message.error("查询用户失败！")
      // 把获取到的对象保存到editForm中
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed(){
      // 关闭之后重置表单
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo(){
       this.$refs.editFormRef.validate(async (valid)=>{
         if(!valid) {
          return
          }//发起网络请求
          const {data:res} = await this.$http.put(`users/${this.editForm.id}`,{
            email:this.editForm.email,
            mobile:this.editForm.mobile
          })
          console.log(res)
          if(res.meta.status!=200) return this.$message.error("更新用户信息失败!")
          // 关闭对话框
          this.editDialogVisible=false
          // 重新获取数据
          this.getUserList()
          // 提示修改成功
          this.$message.success('更新用户信息成功！')
       })
    },
    async removeUserById(id){
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // 如果用户确认了删除，则返回字符串confirm
        // 如果用户用户否认了删除，则返回字符串cancel
        if(confirmResult!=="confirm"){
          return this.$message.info('已取消删除！')
        }
        const {data:res} = await this.$http.delete(`users/${id}`)
        if(res.meta.status!==200) return this.$message.error("删除用户信息失败!")
        //提示删除成功
        this.$message.success('删除用户信息成功！')
        // 重新获取数据
        this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole(userinfo){
      this.userinfo = userinfo
      // 在展示对话框之前获取所有角色的列表
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status!==200){
        return this.$message.error('获取角色列表失败！')
      }
      this.rolelist = res.data
      this.setRoleDialogVisible =true
    },
    // 点击按钮分配角色
    async saveRoleInfo(){
      if(!this.selectedRoleId) return this.$message.error("请选择要分配的角色!")
      const {data:res} = await this.$http.put(`users/${this.userinfo.id}/role`,{rid:this.selectedRoleId})
      if(res.meta.status!==200) return this.$message.error("分配角色失败!")
      this.$message.success('更新角色成功！')
      //重新获取数据
      this.getUserList()
      // 关闭对话框
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed(){
      this.selectedRoleId=''
      this.userinfo ={}
    }
  },
};
</script>
<style scoped>
</style>