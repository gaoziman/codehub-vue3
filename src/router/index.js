import Index from '@/pages/frontend/index.vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import AdminIndex from '@/pages/admin/index.vue'
import Login from "@/pages/admin/login.vue";
import Admin from "@/layouts/admin/admin.vue";

// 统一在这里声明所有路由
const routes = [
    {
        path: '/', // 路由地址
        component: Index, // 对应组件
        meta: { // meta 信息
            title: 'LeoCodeHub 首页' // 页面标题
        }
    },
    {
        path: '/login', // 登录页
        component: Login,
        meta: {
            title: 'LeoCodeHub 登录页'
        }
    },
    {
        path: "/admin", // 后台首页
        component: Admin, // 对应 admin.vue 布局文件
        // 使用到 admin.vue 布局的，都需要放置在其子路由下面
        children: [
            {
                path: "/admin/index",
                component: AdminIndex, // 主内容区域，具体需要渲染的页面
                meta: {
                    title: 'Admin 后台首页'
                }
            }
        ]

    }
]

// 创建路由
const router = createRouter({
    // 指定路由的历史管理方式，hash 模式指的是 URL 的路径是通过 hash 符号（#）进行标识
    history: createWebHashHistory(),
    // routes: routes 的缩写
    routes,
})

// ES6 模块导出语句，它用于将 router 对象导出，以便其他文件可以导入和使用这个对象
export default router