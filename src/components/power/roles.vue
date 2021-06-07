<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- 卡片视图 -->
        <el-card>
            <!-- layout布局 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="rolelist" border stripe>
                <!-- 展开列 -->
                <el-table-column type='expand'>
                    <!-- 利用作用域插槽获取单元格元素对象 -->
                    <template slot-scope="scope">
                        <!-- scope.row.children一级权限 -->
                        <el-row :class="['bdbottom',index1==0?'bdtop':'','vcenter']" v-for ="(item1, index1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级权限和三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[index2===0?'':'bdtop','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag @close="removeRightById(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag @close="removeRightById(scope.row,item3.id)" closable type="warning" v-for="item3 in item2.children" :key="item3.id">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>

                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type='index'></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="角色操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" @click ="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" @click ="removeRoleById(scope.row.id)" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" @click="showSetRightDialog(scope.row)" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色 -->
        <el-dialog
          title="添加角色"
          :visible.sync="addDialogVisible"
          width="50%"
          @close='addDialogClosed'>
           <el-form :model="addForm" :rules="addRules" ref="addFormref" label-width="100px">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述">
                <el-input v-model="addForm.roleDesc"></el-input>
              </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addroles"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <!-- 编辑角色 -->
        <el-dialog
          title="修改用户"
          :visible.sync="editDialogVisible"
          width="50%" @close="editDialogClosed"
          >
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
             <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述">
                <el-input v-model="editForm.roleDesc"></el-input>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRolesInfo">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 分配权限 -->
        <el-dialog
          title="分配权限"
          :visible.sync="setRightDialog"
          width="50%"
          @close="setRightDialogClosed"
          >
          <!-- 树形控件  :props="treeProps"绑定字段 node-key绑定每个树节点用来作为唯一标识的属性-->
          <el-tree :data="rightsList" ref="treeRef" :props="treeProps" :default-checked-keys="defKeys" default-expand-all node-key="id" show-checkbox ></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialog = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //所有角色列表数据
            rolelist:[],
            addForm:{
                roleName:'',
                roleDesc:''
            },
            addRules:{
                roleName:[
                    { required: true, message: "请输入角色名称", trigger: "blur" }
                ]
            },
            addDialogVisible:false,
            editDialogVisible:false,
            editForm:{},
            editFormRules:{
                roleName:[
                    { required: true, message: "请输入角色名称", trigger: "blur" }
                ]
            },
            // 控制分配权限显示与关闭
            setRightDialog:false,
            // 所有权限数据
            rightsList:[],
            treeProps:{
                children:'children',
                label:'authName'
            },
            // 默认选中的结点id值数组
            defKeys:[],
            roleId:''
        }
    },
    created(){
        this.getrolelist()
    },
    methods:{
        async getrolelist(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status!==200){
                return this.$message.error('获取角色列表失败！')
            }
            this.rolelist = res.data
        },
        // 关闭对话框重置字段
        addDialogClosed(){
            this.$refs.addFormref.resetFields()
        },
        // 添加角色
        addroles(){
            // 预验证
            this.$refs.addFormref.validate(async (valid)=>{
                if(!valid){
                    return
                }
                const {data:res} = await this.$http.post('roles',this.addForm)
                if(res.meta.status!==201) return this.$message.error('添加用户失败！')
                // 重新获取数据
                this.getrolelist()
                // 关闭对话框
                this.addDialogVisible = false
                // 提示添加成功
                this.$message.success('添加角色成功！')
            })
        },
        async showEditDialog(id){
            const {data:res} = await this.$http.get(`roles/${id}`)
            if(res.meta.status!==200) this.$message.error("查询用户失败！")
            // 把获取到的对象保存到editForm中
            this.editForm = res.data
            console.log(this.editForm)
            this.editDialogVisible = true
        },
        editDialogClosed(){
            // 重置字段
            this.$refs.editFormRef.resetFields()
        },
        editRolesInfo(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return 
                const {data:res} = await this.$http.put(`roles/${this.editForm.roleId}`,{
                    roleName:this.editForm.roleName,
                    roleDesc:this.editForm.roleDesc
                })
                if(res.meta.status!==200) return this.$message.error("更新用户信息失败！")
                // 关闭对话框
                this.editDialogVisible = false
                this.getrolelist()
                // 提示成功
                this.$message.success("更新用户信息成功！")
            })   
        },
        // 删除角色
        async removeRoleById(id){
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
            const {data:res} = await this.$http.delete(`roles/${id}`)
            if(res.meta.status!==200) return this.$message.error("删除用户信息失败！") 
            //重新获取数据
            this.getrolelist()
            // 提示成功
            this.$message.success("删除用户信息成功！")
        },
        // 根据id删除对应的权限
        async removeRightById(role,rightId){
            // 弹框提示用户是否要删除
            const confirmResult =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err => err)
            if(confirmResult!=='confirm'){
                return this.$message.info('取消了删除！')
            }
            const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status!==200) return this.$message.error("删除权限失败！")
            // this.getrolelist() 不建议重新获取列表数据 重新获取列表数据会重新渲染页面
            role.children = res.data
            this.$message.success("删除用户权限成功！")
        },
        //展示分配权限对话框
        async showSetRightDialog(role){
            // 在打开对话框时保存角色id
            this.roleId = role.id
            // 获取所有权限数据
            const {data:res} = await this.$http.get(`rights/tree`)
            if(res.meta.status!==200) return this.$message.error("获取权限数据失败！")
            // 把获取到的数据保存到data中
            this.rightsList = res.data
            // console.log(this.rightsList)
            this.getLeafKey(role,this.defKeys)
            this.setRightDialog = true
        },
        // 通过递归的形式获取所有三级权限的id并保存到defkeys中
        getLeafKey(node,arr){
            // 如果不包含children属性说明为三级结点
            if(!node.children){
              return arr.push(node.id)
            }
            // 递归遍历数组中的每一项
            node.children.forEach(item => this.getLeafKey(item,arr))
        },
        // 关闭对话框清空数组
        setRightDialogClosed(){
            this.defKeys = []
        },
        // 点击为角色分配权限
        async allotRights(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            console.log(keys)
            const idStr = keys.join()
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{ rids:idStr })
            if(res.meta.status!==200) return this.$message.error("分配权限失败！")
            this.$message.success("分配权限成功！")
            // 重新获取角色列表
            this.getrolelist()
            // 关闭对话框
            this.setRightDialog = false
        }

    }
}
</script>
<style scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>
