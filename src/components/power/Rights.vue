<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-table :data="rightslist" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="权限名称" prop="authName"></el-table-column>
				<el-table-column label="路劲" prop="path"></el-table-column>
				<el-table-column label="权限等级" prop="level">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.level==0">一级</el-tag>
						<el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
						<el-tag v-else type="warning">三级</el-tag>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1"
				:page-sizes="[3,6,9,12]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="12">
			</el-pagination>
		</el-card>
	</div>
</template>
 
<script>
export default {
	created() {
		this.getRightList()
	},
	data() {
		return {
			rightslist: []
		}
	},
	methods: {
		async getRightList() {
			const { data: res } = await this.$http.get('rights/list')
			if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
			this.rightslist = res.data
			console.log(res.data);
		},
		handleSizeChange() { },
		handleCurrentChange() { },

	}
}
</script>
 
<style scoped>
</style>