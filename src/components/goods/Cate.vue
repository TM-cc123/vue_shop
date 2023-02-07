<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<!-- 添加按钮 -->
			<el-row>
				<el-col>
					<el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
				</el-col>
			</el-row>
			<!-- 表格 -->
			<tree-table :data=" catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index
				index-text="#" border>
				<template slot-scope="scope" slot="isok">
					<i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:lightgreen"></i>
					<i class="el-icon-error" v-else style="color:red"></i>
				</template>
				<template slot-scope="scope" slot="level">
					<el-tag v-if="scope.row.cat_level==0">一级</el-tag>
					<el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
					<el-tag type="warning" v-else>三级</el-tag>
				</template>
				<template slot-scope="scope" slot="opt">
					<el-button type="primary" icon="el-icon-edit">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete">删除</el-button>
				</template>
			</tree-table>
			<!-- 分页 -->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[5,8,12,15]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>

		<!-- 添加分类的Dialog -->
		<el-dialog title="添加分类" :visible.sync="showAddCateDialogVisible" width="50%" @close="addDialogClosed">
			<el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="100px">
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="addCateForm.cat_name"></el-input>
				</el-form-item>
				<el-form-item label="父级分类">
					<el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
						@change="parentCateChange" clearable ref="cascaderHandle">
					</el-cascader>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showAddCateDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCate">确 定</el-button>
			</span>
		</el-dialog>

	</div>

</template>
 
<script>
export default {
	created() {
		this.getCateList();
	},
	data() {
		return {
			// 查询条件
			queryInfo: {
				type: 3,
				pagenum: 1,
				pagesize: 5
			},
			catelist: [],
			total: 0,
			columns: [
				{
					lable: '分类名称',
					prop: 'cat_name'
				}, {
					lable: '是否有效',
					prop: 'cat_deleted',
					minWidth: '200px',
					type: 'template',
					template: 'isok'
				}, {
					lable: '等级',
					prop: 'cat_level',
					minWidth: '200px',
					type: 'template',
					template: 'level'
				}, {
					lable: '操作',
					minWidth: '200px',
					type: 'template',
					template: 'opt'
				}
			],
			showAddCateDialogVisible: false,
			addCateForm: {
				cat_level: 0,
				cat_name: '',
				cat_pid: 0
			},
			addCateFormRules: {
				cat_name: [
					{ required: true, message: '请输入分类名称', trigger: 'blur' }
				],
			},
			parentCateList: [],
			selectedKeys: [],
			cascaderProps: {
				expandTrigger: 'hover',
				label: 'cat_name',
				children: 'children',
				value: 'cat_id',
				checkStrictly: true
			}
		}
	},
	methods: {
		// 获取商品分类数据
		async getCateList() {
			const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
			if (res.meta.status !== 200) return this.$message.error('查询商品分类失败');
			this.catelist = res.data.result
			this.total = res.data.total
		},
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize
			this.getCateList()
		},
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage
			this.getCateList()
		},
		addDialogClosed() {

		},
		// 获取父级分类列表
		async getParentCateList() {
			const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
			if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败');
			this.parentCateList = res.data
			// console.log('父级分类列表', res.data);
		},
		showAddCateDialog() {
			this.getParentCateList()
			this.showAddCateDialogVisible = true
		},
		parentCateChange() {
			// console.log('级联选择的', this.selectedKeys);
			this.$refs.cascaderHandle.dropDownVisible = false;
			if (this.selectedKeys.length > 0) {
				this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
				this.addCateForm.cat_level = this.selectedKeys.length
				return
			} else {
				this.addCateForm.cat_pid = 0
				this.addCateForm.cat_level = 0
			}
		},
		addCate() {
			this.$refs.addCateFormRef.validate(async visible => {
				if (!visible) return
				const { data: res } = await this.$http.post('categories', this.addCateForm)
				if (res.meta.status !== 201) return this.$message.error('添加分类失败')

				this.getCateList()
				this.$message.success('添加分类成功')
				this.showAddCateDialogVisible = false
			})
		},
		addDialogClosed() {
			this.$refs.addCateFormRef.resetFields()
			this.addCateForm.cat_level = 0
			this.addCateForm.cat_pid = 0
			this.selectedKeys = []
		}
	},
}
</script>
 
<style scoped>
</style>