<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert
              title="添加商品信息"
              type="info"
              center
              :closable="false"
              show-icon>
            </el-alert>
            <!-- 步骤条区域 -->
            <el-steps align-center :space="200" :active="parseInt(activeIndex)" finish-status="success">
              <el-step title="基本信息"></el-step>
              <el-step title="商品参数"></el-step>
              <el-step title="商品属性"></el-step>
              <el-step title="商品图片"></el-step>
              <el-step title="商品内容"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
            <!-- 公用同一个数据项，注意name是字符串 步骤条需要number类型 -->
            <!-- tab栏区域 tab-pane必须是tabs的子节点 -->
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-position="top" label-width="100px" >
                <el-tabs @tab-click="tabclicked" :before-leave="beforeTabLeave" v-model="activeIndex" :tab-position="'left'" >
                  <el-tab-pane name="0" label="基本信息">
                      <el-form-item label="商品名称" prop="goods_name">
                          <el-input v-model="addForm.goods_name"></el-input>
                      </el-form-item>
                      <el-form-item label="商品价格" prop="goods_price">
                          <el-input v-model="addForm.goods_price" type="number"></el-input>
                      </el-form-item>
                      <el-form-item label="商品重量" prop="goods_weight">
                          <el-input v-model="addForm.goods_weight" type="number"></el-input>
                      </el-form-item>
                      <el-form-item label="商品数量" prop="goods_number">
                          <el-input v-model="addForm.goods_number" type="number"></el-input>
                      </el-form-item>
                      <el-form-item label="商品分类" prop="">
                          <el-cascader
                            v-model="addForm.goods_cat"
                            :props="cateProps"
                            expand-trigger="hover"
                            :options="catelist"
                            @change="handleChange" 
                            clearable change-on-select>
                          </el-cascader>
                      </el-form-item>  
                  </el-tab-pane>
                  <el-tab-pane name="1" label="商品参数">
                      <!-- 渲染表单的item项 -->
                      <el-form-item :label="item.attr_name" v-for="item in manyTableData"
                      :key="item.attr_id">
                      <!-- 复选框组 -->
                        <el-checkbox-group v-model="item.attr_vals">
                          <el-checkbox border :label="item1" v-for="(item1,i) in item.attr_vals"
                          :key="i"></el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane name="2" label="商品属性">
                      <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
                          <el-input v-model="item.attr_vals"></el-input>
                      </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane name="3" label="商品图片">
                      <!-- 上传组件 action表示图片要上传到后台API地址 list-type="picture"展示图片效果 因为上传组件没有调用axios所以需要手动设置token值-->
                      <el-upload
                        class="upload-demo"
                        :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        list-type="picture"
                        :headers="headerObj"
                        :on-success="handleSuccess">
                        <el-button size="small" type="primary">点击上传</el-button>
                      </el-upload>
                  </el-tab-pane>
                  <el-tab-pane name="4" label="商品内容">
                      <!-- 富文本编辑器组件 -->
                       <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                       <!-- 添加商品按钮 -->
                       <el-button type="primary" @click="add" class="btnAdd">添加商品</el-button>
                  </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog
          title="图片预览"
          :visible.sync="previewVisible"
          width="50%">
          <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
    data(){
        return{
            activeIndex:"0",
            // 表单数据对象
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                // 商品所属的分类数组
                goods_cat:[],
                // 图片的数组
                pics:[],
                // 商品的详细描述
                goods_introduce:'',
                attrs:[]

            },
            addFormrules:{
                goods_name:[
                    { required: true, message: "请输入商品名称", trigger: "blur" }
                ],
                goods_price:[
                    { required: true, message: "请输入商品价格", trigger: "blur" }
                ],
                goods_weight:[
                    { required: true, message: "请输入商品重量", trigger: "blur" }
                ],
                goods_number:[
                    { required: true, message: "请输入商品数量", trigger: "blur" }
                ]
            },
            // 商品分类列表
            catelist:[],
            // 级联选择框配置对象
            cateProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            // 动态参数列表数据
            manyTableData:[],
            // 静态属性列表数据
            onlyTabData:[],
            // 上传图片的url地址
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            // 图片上传组件的headers请求头对象
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            previewPath:'',
            previewVisible:false
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.error('获取商品分类失败！')
            }
            this.catelist = res.data
        },
        // 级联选择器选中项变化时，触发的函数
        handleChange(){
            if(this.addForm.goods_cat.length!==3){
                this.addForm.goods_cat = []
            }
        },
        // 切换标签之前的钩子activeName,oldActiveName分别代表要进入的标签和要离开的标签
        beforeTabLeave(activeName,oldActiveName) {
            // console.log('即将离开的标签页是'+oldActiveName)
            // console.log('即将进入的标签页是'+activeName)
            if(oldActiveName==='0' && this.addForm.goods_cat.length!==3){
                this.$message.error("请输入选择商品分类!")
                return false 
            }
        },
        async tabclicked(){
            // console.log(this.activeIndex);
            // 证明是动态参数面板
            if(this.activeIndex === '1'){
                // const声明的为块级作用域只在当前块内有效
                const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
                // console.log(data)
                if(res.meta.status!==200) {
                    return this.$message.error('获取动态参数列表失败！')
                }
                // 在数组赋值之前
                res.data.forEach(item => {
                    // 三元表达式将字符串转成数组
                    item.attr_vals = item.attr_vals.length !==0?item.attr_vals.split(' '):[]
                })
                this.manyTableData = res.data
                console.log(this.manyTableData)
            }else if(this.activeIndex==='2'){
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
                if(res.meta.status!==200){
                    return this.$message.error('获取动态属性失败！')
                }
                this.onlyTabData = res.data
            }
        },
        // 处理图片预览效果
        handlePreview(file){
            // console.log(file)
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        // 处理移除图片效果
        handleRemove(file){
            // console.log(file);
            // 1获取要删除图片的临时路径
            const filePath = file.respone.data.tmp_path
            // 2从pics数组中，找到这个图片对应的索引值
            const i =this.addForm.pics.findIndex(iitem =>{
                item.pic === filePath
            })
            this.addForm.pics.splice(i,1)
        },
        // 监听图片上传成功的事件
        handleSuccess(respone){
            const picInfo ={
                pic:respone.data.tmp_path
            }
            this.addForm.pics.push(picInfo)
            console.log(this.addForm.pics)
        },
        // 添加商品
         add(){
            console.log(this.addForm);
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                    return this.$message.error("请填写必要的表单项！")
                }
                // 处理动态参数
                // 处理静态属性
                this.manyTableData.forEach(item=>{
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join()
                    }
                    this.addForm.attrs.push(newInfo)
                })
                this.onlyTabData.forEach(item=>{
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                // 因为级联选择器绑定了数组所以要深拷贝
                const form = _.cloneDeep(this.addForm)
                // 执行添加的业务逻辑
               form.goods_cat = 
                this.addForm.goods_cat.join(',')
                const {data:res} = await this.$http.post('goods',form)
                if(res.meta.status!==201) {
                    return this.$message.error('添加商品失败！')
                }
                this.$message.success('添加商品成功！')
                this.$router.push('/goods')
            })
        }
    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length===3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>
<style scoped>
.el-checkbox {
    margin: 0 10px 0 0 !important
}
.previewImg{
    width: 100%;
}
.btnAdd{
    margin-top: 15px;
}
</style>
