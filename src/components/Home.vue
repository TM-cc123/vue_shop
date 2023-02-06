<template>
	<el-container class="home_container">
		<el-header>
			<div>
				<img src="@/assets/images/heima.png" alt="">
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="logout">退出</el-button>
		</el-header>
		<el-container class="main_container">
			<el-aside :width="!collapse?'200px':'64px'">
				<div class="toggle-button" @click="toggleCollapse">|||</div>
				<el-menu background-color="#333744" text-color="#fff" :unique-opened="true" :collapse="collapse"
					:collapse-transition="false" router :default-active="activePath">
					<el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
						<template slot="title">
							<i class="el-icon-location"></i>
							<span>{{item.authName}}</span>
						</template>
						<!-- 二级路由 -->
						<el-menu-item :index="'/'+childItem.path" v-for="childItem in item.children" :key="childItem.id"
							@click="saveNavState('/'+childItem.path)">
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{ childItem.authName }}</span>
							</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>
 
<script>
export default {
	data() {
		return {
			menulist: [],
			collapse: false,
			activePath: ''
		}
	},
	created() {
		this.getMenuList()
		this.activePath = window.sessionStorage.getItem('activePath')
	},
	methods: {
		logout() {
			window.sessionStorage.removeItem('token')
			this.$router.push('/login')
		},
		// 获取所有菜单
		async getMenuList() {
			const { data: res } = await this.$http.get('menus')
			// console.log(res);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
			this.menulist = res.data
		},
		// 菜单折叠开关
		toggleCollapse() {
			this.collapse = !this.collapse
		},
		// 保存链接的激活状态
		saveNavState(activePath) {
			window.sessionStorage.setItem('activePath', activePath)
			this.activePath = activePath
		}
	}
}
</script>
 
<style scoped lang="less">
.home_container {
	width: 100%;
	height: 100%;
	.el-header {
		background-color: #373d41;
		display: flex;
		justify-content: space-between;
		padding-left: 0;
		align-items: center;
		color: #fff;
		font-size: 20px;
		> div {
			display: flex;
			align-items: center;
			span {
				margin-left: 15px;
			}
		}
	}
	.main_container {
		.toggle-button {
			background-color: #4a5064;
			color: #fff;
			font-size: 10px;
			line-height: 24px;
			text-align: center;
			cursor: pointer;
		}
		.el-aside {
			background-color: #333744;
		}
		.el-main {
			background-color: #fff;
		}
		.el-menu {
			border-right: none;
		}
	}
}
</style>