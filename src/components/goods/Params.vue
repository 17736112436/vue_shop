<template>
<div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 警告区 -->
            <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" :closable="false" type="warning">
            </el-alert>
            <!-- 选择商品分类区 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类:</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader
                      v-model="selectedcateKeys"
                      :props="cateProps"
                      expand-trigger="hover"
                      :options="catelist"
                      @change="handleChange" 
                      clearable change-on-select>
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- tag页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
              <!-- 添加动态参数面板 -->
              <el-tab-pane label="动态参数" name="many">
                  <el-button type="primary" :disabled="isDisabled" @click='addDialogVisible=true' size="mini">添加参数</el-button>
                  <!-- 动态参数表格 -->
                  <el-table :data="manyTabData" border stripe>
                      <!-- 展开行 -->
                      <el-table-column type="expand">
                          <template slot-scope="scope">
                              <!-- 循环渲染tag标签 -->
                              <el-tag @close="handleClose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" closable :key="i">{{item}}</el-tag>
                              <!-- 输入文本框 -->
                              <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                              >
                              </el-input>
                              <!-- 添加的按钮 -->
                              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                          </template>
                      </el-table-column>
                      <el-table-column type="index"></el-table-column>
                      <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                      <el-table-column label="操作" >
                          <template slot-scope="scope">
                            <el-button @click="showEditDialog(scope.row.attr_id)" size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
                            <el-button size="mini" @click="deleteParams(scope.row.attr_id)" icon="el-icon-delete" type="danger">删除</el-button>  
                          </template>
                      </el-table-column>
                  </el-table>
              </el-tab-pane>
              <!-- 添加静态属性面板 -->
              <el-tab-pane label="静态属性" name="only">
                  <el-button :disabled="isDisabled" @click='addDialogVisible=true' type="primary" size="mini">添加属性</el-button>
                  <!-- 静态属性表格 -->
                  <el-table :data="onlyTabData" border stripe>
                      <!-- 展开行 -->
                      <el-table-column type="expand">
                          <template slot-scope="scope">
                              <!-- 循环渲染tag标签 -->
                              <el-tag @close="handleClose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" closable :key="i">{{item}}</el-tag>
                              <!-- 输入文本框 -->
                              <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                              >
                              </el-input>
                              <!-- 添加的按钮 -->
                              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                          </template>
                      </el-table-column>
                      <el-table-column type="index"></el-table-column>
                      <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                      <el-table-column label="操作" >
                          <template slot-scope="scope">
                            <el-button @click="showEditDialog(scope.row.attr_id)" size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
                            <el-button size="mini" @click="deleteParams(scope.row.attr_id)" icon="el-icon-delete" type="danger">删除</el-button>  
                          </template>
                      </el-table-column>
                  </el-table>
              </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数的对话框 -->
        <el-dialog
          @close="addDialogClosed"
          :title="'添加'+this.titleText"
          :visible.sync="addDialogVisible"
          width="50%"
          >
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
            <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改参数对话框 -->
        <el-dialog
          @close="editDialogClosed"
          :title="'修改'+this.titleText"
          :visible.sync="editDialogVisible"
          width="50%"
          >
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
            <el-form-item :label="titleText" prop="attr_name">
              <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 商品分类
            catelist:[],
            // 级联选择框的配置属性
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //级联选择框v-model绑定的数组
            selectedcateKeys:[],
            // 被激活的页签名称
            activeName:'many',
            // 动态参数的数据
            manyTabData:[],
            // 静态参数的数据
            onlyTabData:[],
            // 控制添加对话框的显示与隐藏
            addDialogVisible:false,
            // 添加参数的表单数据对象
            addForm:{
                attr_name:''
            },
            // 添加表单验证规则对象
            addFormRules:{
                attr_name:[
                    { required: true, message: "请输入参数名称", trigger: "blur" }
                ]
            },
            editDialogVisible:false,
            editForm:{},
            editFormRules:{
                // 修改表单的验证规则对象
                attr_name:[
                    { required: true, message: "请输入参数名称", trigger: "blur" }
                ]
            },
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 获取所有商品分类
        async getCateList() {
            const { data: res } = await this.$http.get("categories")
            if (res.meta.status !== 200) {
                return this.$message.error("获取商品分类失败！")
            } 
            
            this.catelist = res.data
            // console.log(this.catelist)
        },//级联选择框选中项发生变化会触发的函数
        handleChange(){
            this.getparamsData()

        },//获取参数数据
        async getparamsData(){
            if(this.selectedcateKeys.length!==3){
                this.selectedcateKeys = []
                //当选中的不是三级分类的时候清空数组 
                this.manyTabData = []
                this.onlyTabData = []
                return
            }
            //证明选中的是三级分类
            // 根据id和当前面板获取参数
            const { data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                params:{sel:this.activeName}
            })
            if(res.meta.status!==200){
                return this.$message.error('获取参数列表失败！')
            }
            // 在赋值之前将所有项的attr_vals变成数组
            res.data.forEach(item=>{

                item.attr_vals = item.attr_vals?item.attr_vals.split(' '):[]//将字符串分割成数组
                // 给每个数据添加一个属性inputVisible
                item.inputVisible = false
                // 增加值
                item.inputValue = ''
            })
            if(this.activeName ==='many'){
                this.manyTabData = res.data
            }else{
                this.onlyTabData = res.data
            }
            // console.log(res.data)
        },
        //tab页签点击事件的函数
        handleTabClick(){
            this.getparamsData()
        },
        // 监听添加对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },//点击按钮添加参数
        addParams(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status!==201) return this.$message.error('添加参数失败！')
                this.$message.success('添加参数成功！')
                // 关闭对话框
                this.addDialogVisible=false
                // 重新获取参数数据
                this.getparamsData()
            })
        },
        // 展示修改对话框
        async showEditDialog(id){
            // 查询当前参数的信息
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{
                params:{attr_sel:this.activeName}
            })
            if(res.meta.status!==200) return this.$message.error('获取参数信息失败!')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },//点击按钮修改参数
        editParams(){
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid) return 
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                    attr_name:this.editForm.attr_name,attr_sel:this.activeName
                  }
                )
                if(res.meta.status!==200) return this.$message.error('修改参数失败！')
                this.$message.success('修改参数成功！')
                this.getparamsData()
                // 隐藏对话框
                this.editDialogVisible = false
            })
        },
        // 根据id删除对应的参数项
        async deleteParams(id){
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err)
          if(confirmResult!=="confirm"){
              return this.$message.info("已取消删除！")
          }
          //删除的业务逻辑
          const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
          if(res.meta.status!==200) {
              return this.$message.error('删除参数失败！')
          }
        this.$message.success("删除参数成功！")
        this.getparamsData()
        },
        // 文本框失去焦点或摁下enter都会触发
        handleInputConfirm(row){
            if(row.inputValue.trim().length===0){
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            // 如果没有return则证明输入的内容需要做后续处理
            // 向数组中添加v输入的值
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            this.saveAttrVals(row)
        },
        // 将对attr_vals的操作保存到数据库
        async saveAttrVals(row){
            // 需要发起请求保存这次操作
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
            })
            if(res.meta.status!==200){
                return this.$message.error('修改参数项失败！')
            }
            this.$message.success('修改参数项成功！')
        },
        showInput(row){
            row.inputVisible = true
            // 让文本框自动获取焦点
            // $nextTick方法的作用，就是当页面上的元素被重新渲染之后
            // 才会指定回调函数
                this.$nextTick(_=> {
                  this.$refs.saveTagInput.$refs.input.focus();
                })
        },
        // 删除对应参数可选项
        handleClose(i,row){
            row.attr_vals.splice(i,1)
            this.saveAttrVals(row)
        }
    },
    computed:{
        isDisabled(){
            if(this.selectedcateKeys.length!==3){
                return true
            }
            return false
        },
        // 当前选中的三级分类的ID
        cateId(){
            if(this.selectedcateKeys.length!==3){
                return null
            }
            return this.selectedcateKeys[2]
        },
        // 动态计算标题的文本
        titleText() {
            if(this.activeName==='many'){
                return '动态参数'
            }
            return'静态属性'
        }
    }
}
</script>
<style scoped>
.cat_opt{
    margin-top: 15px
}
.el-tag{
    margin: 10px
}
.input-new-tag{
    width: 150px;
}
</style>
