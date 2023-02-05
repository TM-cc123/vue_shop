import Vue from 'vue'
import { Form, FormItem } from 'element-ui'
import { Input, Button } from 'element-ui'
import { Message } from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.prototype.$message = Message
