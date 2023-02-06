<template>
	<div>
		<!-- 面包屑 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<!-- 搜索区 -->
			<el-row :gutter="25">
				<el-col :span="12">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
				</el-col>
			</el-row>
			<!-- 用户列表区 -->
			<el-table :data="userlist" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="姓名" prop="username"></el-table-column>
				<el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="电话" prop="mobile"></el-table-column>
				<el-table-column label="角色" prop="role_name"></el-table-column>
				<el-table-column label="状态" prop="mg_state" width="180">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row.mg_state)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="300">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
						<el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserById(scope.row.id)">
						</el-button>
						<el-tooltip effect="dark" content="角色分配" placement="top" :enterable="false">
							<el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[3,6,9,12]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</el-card>
		<!-- 添加Dialog -->
		<el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
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
				<el-button type="primary" @click="addUser">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 修改Dialog -->
		<el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
				<el-form-item label="用户名">
					<el-input v-model="editForm.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="editForm.mobile"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editUser">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
 
<script>
export default {
	created() {
		this.getUserList()
	},
	data() {
		var checkEmail = (rule, value, cb) => {
			let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
			if (reg.test(value)) {
				return cb()
			} else {
				return cb(new Error('请输入合法的邮箱'))
			}
		}

		var checkMobile = (rule, value, cb) => {
			let reg = /^([0|86|17951])?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
			if (reg.test(value)) {
				return cb()
			} else {
				return cb(new Error('请输入合法的手机号'))
			}
		}


		return {
			userlist: [],
			total: 0,
			// 获取洪湖列表的才参数对象
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 3
			},
			addDialogVisible: false,
			editDialogVisible: false,
			addForm: {
				username: '',
				password: '',
				email: '',
				mobile: ''
			},
			editForm: {
				username: '',
				email: '',
				mobile: ''
			},
			addFormRules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
					{ min: 3, max: 10, message: '用户名长度3~10', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 3, max: 10, message: '密码长度6~15', trigger: 'blur' }
				],
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ validator: checkEmail, trigger: 'blur' }
				],
				mobile: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ validator: checkMobile, trigger: 'blur' }
				]
			},
			editFormRules: {
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ validator: checkEmail, trigger: 'blur' }
				],
				mobile: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ validator: checkMobile, trigger: 'blur' }
				]
			},
		}
	},
	methods: {
		async getUserList() {
			const { data: res } = await this.$http.get('users', { params: this.queryInfo })
			// console.log(res);
			if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
			this.userlist = res.data.users
			this.total = res.data.total
		},
		// 监听pageSize改变事件
		handleSizeChange(newSize) {
			// console.log(newSize)
			this.queryInfo.pagesize = newSize
			this.getUserList()
		},
		// 监听页面值变化
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage
			this.getUserList()
		},
		// 用户状态修改开关
		async userStateChange(userInfo) {
			const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
			if (res.meta.status !== 200) {
				userInfo.mg_state = !userInfo.mg_state
				return this.$message.error('更新用户状态失败')
			}
			this.$message.success('更新用户状态成功')
		},
		// 关闭Dialog重置表单
		addDialogClosed() {
			this.$refs.addFormRef.resetFields()
		},
		// 点击按钮,添加用户
		addUser() {
			this.$refs.addFormRef.validate(async valid => {
				if (!valid) return
				const { data: res } = await this.$http.post('users', this.addForm)
				if (res.meta.status !== 201) {
					this.$message.error('添加用户失败')
				} else {
					this.$message.success('添加用户成功')
					this.addDialogVisible = false
					this.getUserList()
				}
			})
		},
		async showEditDialog(id) {
			// console.log('123');
			const { data: res } = await this.$http.get(`users/${id}`)
			if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
			this.editForm = res.data
			this.editDialogVisible = true
		},
		// 关闭修改对话框重置表单
		editDialogClosed() {
			this.$refs.editFormRef.resetFields()
		},
		// 点击按钮确认修改
		editUser() {
			this.$refs.editFormRef.validate(async valid => {
				if (!valid) return
				const { data: res } = await this.$http.put(`users/${this.editForm.id}`, { email: this.editForm.email, mobile: this.editForm.mobile })
				if (res.meta.status !== 200) {
					this.$message.error('修改用户失败')
				} else {
					this.$message.success('修改用户成功')
					this.editDialogVisible = false
					this.getUserList()
				}
			})
		},
		// 删除用户按钮
		async removeUserById(id) {
			const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err)
			// console.log(confirmResult);
			if (confirmResult == 'confirm') {
				const { data: res } = await this.$http.delete(`users/${id}`)
				if (res.meta.status !== 200) return this.$message.error('删除用户失败')
				this.getUserList()
				this.$message.success('删除用户成功')
			} else {
				this.$message.info('操作已取消')
			}
		},
	}
}
</script>
 
<style scoped>
</style>