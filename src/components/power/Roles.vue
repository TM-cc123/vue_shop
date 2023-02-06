<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-button type="primary">添加角色</el-button>
			<el-table :data="roleslist" border stripe>
				<!-- 展开行 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<!-- el-row:一行 -->
						<el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"
							:class="['bdbottom','vcenter',i1==0?'bdtop':'']">
							<!-- el-col:一列 -->
							<el-col :span="5">
								<el-tag closable @close="removeRolesById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<el-col :span="19">
								<el-row v-for="(item2,i2) in item1.children" :key="item2.id"
									:class="['vcenter',i2===item1.children.length-1?'':'bdbottom']">
									<el-col :span="6">
										<el-tag closable @close="removeRolesById(scope.row,item2.id)" type="success">{{ item2.authName }}
										</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="13">
										<el-tag closable @close="removeRolesById(scope.row,item3.id)" v-for="(item3,i3) in item2.children"
											:key="item3.id" type="warning">
											{{item3.authName}}
										</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope2">
						<el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
						<el-button type="danger" size="mini" icon="el-icon-delete">删除
						</el-button>
						<el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope2.row)">分配权限
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1"
				:page-sizes="[3,6,9,12]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="12">
			</el-pagination>
		</el-card>

		<!-- 分配权限的对话框 -->
		<el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
			<!-- 树形控件 -->
			<el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true"
				:default-checked-keys="defKeys" ref="treeRef"></el-tree>
			<span slot="footer" class="dialog-footer">
				<el-button @click="setRightDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="allotRights">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>
 
<script>
export default {
	created() {
		this.getRolesList()
	},
	data() {
		return {
			roleslist: [],
			setRightDialogVisible: false,
			rightslist: [],
			treeProps: {
				children: 'children',
				label: 'authName'
			},
			defKeys: [],			// 默认选中的节点ID值
			roleId: ''					// 即将分配权限的ju角色ID
		}
	},
	methods: {
		async getRolesList() {
			const { data: res } = await this.$http.get('roles')
			if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
			this.roleslist = res.data
			console.log('roles', res.data);

		},
		handleSizeChange() {

		},
		handleCurrentChange() {

		},
		async removeRolesById(role, rightId) {
			let confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(err => err);
			if (confirmResult !== 'confirm') {
				return this.$message.info('取消了操作')
			} else {
				const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
				if (res.meta.status !== 200) return this.$message.error('删除权限失败')
				role.children = res.data
			}
		},
		// 展示分配权限的对话框
		async showSetRightDialog(role) {
			this.roleId = role.id
			// 获取所有权限
			const { data: res } = await this.$http.get('rights/tree')
			if (res.meta.status !== 200) return this.$message.error('获取所有权限失败')
			this.rightslist = res.data
			console.log('rights', res.data);

			this.getLeafKeys(role, this.defKeys)
			this.setRightDialogVisible = true
		},
		getLeafKeys(node, arr) { // 如果node不包含children属性,则为三级节点
			if (!node.children) {
				return arr.push(node.id)
			} else {
				node.children.forEach(v => {
					this.getLeafKeys(v, arr)
				})
			}
		},
		// 退出Dialog框重置数组
		setRightDialogClosed() {
			this.defKeys = []
		},
		// 确认分配权限按钮
		async allotRights() {
			const keys = [
				...this.$refs.treeRef.getCheckedKeys(),
				...this.$refs.treeRef.getHalfCheckedKeys(),
			]
			console.log('数组', keys);
			const idStr = keys.join(',')
			const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
			if (res.meta.status !== 200) return this.$message.error('分配权限失败')

			this.$message.success('分配权限成功')
			this.getRolesList()
			this.setRightDialogVisible = false
		}
	}
}
</script>
 
<style scoped lang="less">
.vcenter {
	display: flex;
	align-items: center;
}
</style>