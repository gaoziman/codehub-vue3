import { createApp } from 'vue'
import 'animate.css';
import '@/assets/main.css'
import 'nprogress/nprogress.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from '@/App.vue'

// 引入全局状态管理 Pinia
import pinia from '@/stores'


import router from '@/router'
// 导入全局路由守卫
import '@/permission'

const  app = createApp(App)

// 引入图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(pinia)
app.mount('#app')
