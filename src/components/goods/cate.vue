<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="showAddCateDialog" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="treeTable"
        border
        :show-row-hover="false"
        show-index
        index-text="#"
        :expand-type="false"
        :selection-type="false"
        :data="catelist"
        :columns="columns"
      >
      <!-- 是否有效模板 -->
        <template slot="TF" slot-scope="scope">
            <!-- scope.row数组中的元素对象 -->
            <i class="el-icon-success" 
            v-if="scope.row.cat_deleted ===false"
            style="color:lightgreen"></i>
            <i class="el-icon-error" 
            v-else
            style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
            <el-button @click="showEditCateDialog(scope.row.cat_id)" size="mini" icon="el-icon-edit" type="primary">编辑</el-button>
            <el-button size="mini" @click="deleteCate(scope.row.cat_id)" icon="el-icon-delete" type="danger">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      @close="addCateDialogClosed"
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      >
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <!-- 当级联选择器的值发生变化时就会触发@change事件 -->
          <el-cascader
            v-model="selectedKeys"
            :props="cascaderProps"
            expand-trigger="hover"
            :options="parentCateList"
            @change="parentCateChanged" 
            clearable change-on-select>
          </el-cascader>
        </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%" @close="editCateDialogClosed"
      >
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px" >
         <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryinfo: {
        type: 3,
        pagenum: 1,
        // 当前页数量
        pagesize: 5,
      },
      // 商品分类数据
      catelist: [],
      total: 0,
      // 为table指定列的定义
      columns: [
        //每个对象代表一列
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示是否定义为模板列
          type: "template",
          // 表示当前这一列的插槽的名称
          template: "TF",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          // 表示是否定义为模板列
          type: "template",
          // 表示当前这一列的插槽的名称
          template: "opt",
        },
      ],
      // 对话框的显示与隐藏
      addCateDialogVisible:false,
      // 添加分类的表单数据
      addCateForm:{
        // 将要添加分类的名称
        cat_name:'',
        // 父级分类的id
        cat_pid:0,
        // 分类的等级，默认要添加的是1级分类
        cat_level:0
      },
      addCateFormRules:{
        cat_name:[
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      parentCateList:[],
      // 指定级联选择器的配置对象
      cascaderProps:{
        // 数据值
        value:'cat_id',
        // 数据显示的名称
        label:'cat_name',
        // 通过children属性设置父子嵌套的属性
        children:'children'
      },
      // 选中父级的id数组
      selectedKeys:[],
      editCateForm:{},
      editCateFormRules:{
        cat_name:[
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      editCateDialogVisible:false
    };
  },
  created () {
    this.getcatelist();
  },
  methods: {
    // 获取商品分类数据
    async getcatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryinfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败！");
      // 把数据列表，赋值给catelist
      this.catelist = res.data.result;
      // 把总数据条数保存起来
      this.total = res.data.total;
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      // 当前页面发生变化时重新发起请求
      this.getcatelist();
    }, //监听页面发生变化
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage;
      this.getcatelist();
    },
    showAddCateDialog(){
      // 打开页面之前先获取分类
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的结点
    async getParentCateList(){
    const {data:res} = await this.$http.get('categories',{params:{type:2}})
    if(res.meta.status!==200) return this.$message.error('获取父级分类用户失败！')
    this.parentCateList = res.data
    },
    // 选择项发生变化触发函数
    parentCateChanged(){
      // 如果selectedKey数组中的length大于0，证明选中的是父级分类
      // 反之则没有选中任何分类
      if(this.selectedKeys.length>0){
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length-1
        ]
        // 为当前等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      }else{
        // 父级分类的id
        this.addCateForm.cat_pid=0
        // 为当前等级赋值
        this.addCateForm.cat_level=0
      }
    },
    // 点击按钮添加新的分类
    addCate(){
      // 预校验
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return
        const {data:res} = await this.$http.post('categories',this.addCateForm)
        if(res.meta.status!==201) return this.$message.error('添加分类失败！')
        this.$message.success('添加用户成功！')
        // 重新获取数据
        this.getcatelist()
        // 关闭对话框
        this.addCateDialogVisible = false
      })
    },//监听对话框关闭事件重置表单
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },//编辑对话框关闭重置字段
    editCateDialogClosed(){
      this.$refs.editCateFormRef.resetFields()
    },
    // 展示对话框
    async showEditCateDialog(id){
      const {data:res} = await this.$http.get(`categories/${id}`)
      if(res.meta.status!==200) return this.$message.error('获取分类数据失败！')
      // 获取用户数据
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    // 校验表单并修改内容
    editCateInfo(){
      this.$refs.editCateFormRef.validate(async valid =>{
        if(!valid) return 
        const {data:res} = await this.$http.put(`categories/${this.editCateForm.cat_id}`,{cat_name:this.editCateForm.cat_name})
        if(res.meta.status!==200) return this.$message.error('更新分类失败！')
        // 重新加载数据
        this.getcatelist()
        this.$message.success('更新分类成功！')
        this.editCateDialogVisible = false
      })
    },
    // 点击删除按钮删除文件
    async deleteCate(id){
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      if(confirmResult!=="confirm"){
        return this.$message.info('已取消删除！')
      }
      const {data:res} = await this.$http.delete(`categories/${id}`)
        if(res.meta.status!==200) return this.$message.error("删除分类失败！") 
        //重新获取数据
        this.getcatelist()
        // 提示成功
        this.$message.success("删除分类成功！")
    }
  },
};
</script>
<style scoped>
.treeTable{
    margin-top: 15px;
}
</style>