import axios from "axios";
import {getToken} from "@/composables/auth.js";
import {showMessage} from "@/composables/util.js";

// 创建 Axios 实例
const instance = axios.create({
    baseURL: "/api", // 你的 API 基础 URL
    timeout: 7000, // 请求超时时间
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = getToken()
    // 当 token 不为空时
    if (token) {
        // 添加请求头, key 为 Authorization，value 值的前缀为 'Bearer '
        config.headers['Authorization'] = 'Bearer ' + token
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 简化统一响应信息
    return response.data
}, function (error) {
    console.log(JSON.stringify(error));
    // 若后台有错误提示就用提示文字，默认提示为 '请求失败'
    let errorMsg = error.response.data.message || '请求失败'
    // 弹错误提示
    showMessage(errorMsg, 'error')
    return Promise.reject(error)
})


// 暴露出去
export default instance;