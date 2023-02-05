<template>
	<div class="login_container">
		<div class="login_box">
			<div class="avater_box">
				<img src="@/assets/logo.png" alt="">
			</div>
			<el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="form_box">
				<el-form-item>
					<div style="width:100%;text-align: center;font-size: 20px;">TM</div>
				</el-form-item>
				<el-form-item prop="username">
					<el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input prefix-icon="el-icon-lollipop" v-model="loginForm.password"></el-input>
				</el-form-item>
				<el-form-item class="btns">
					<el-button type="primary" @click="login">登录</el-button>
					<el-button type="info" @click="resstLoginForm">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
 
<script>

export default {
	data() {
		return {
			loginForm: {
				username: 'admin',
				password: '123456'
			},
			loginFormRules: {
				username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, message: '长度在3以上', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码', }, { min: 6, message: '长度在6以上', trigger: 'blur' }]
			}
		}
	},
	methods: {
		// 重置表单
		resstLoginForm() {
			this.$refs.loginFormRef.resetFields()
		},
		//登录
		login() {
			this.$refs.loginFormRef.validate(async value => {
				if (!value) return
				const { data: res } = await this.$http.post('login', this.loginForm);
				if (res.meta.status !== 200) {
					this.$message.error('登录失败')
				} else {
					// console.log(res)
					this.$message.success('登录成功');
					window.sessionStorage.setItem('token', res.data.token);
					this.$router.push('/home');
				}
			})
		}

	}
}
</script>
 
<style scoped lang="less">
.login_container {
	width: 100vw;
	height: 100vh;
	background-color: #2b4b6b;
	.login_box {
		width: 450px;
		height: 300px;
		background-color: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 3px;
	}
	.avater_box {
		box-shadow: 0 0 10px #ddd;
		height: 130px;
		width: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		box-sizing: border-box;
		padding: 10px;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.form_box {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 0 10px;
		box-sizing: border-box;
		.btns {
			display: flex;
			justify-content: flex-end;
		}
	}
}
</style>