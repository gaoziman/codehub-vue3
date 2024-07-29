import axios from "@/axios";

// 获取博客设置详情
export function getBlogSettingsDetail() {
    return axios.post("/admin/blog/setting/detail")
}

// 更新博客设置
export function updateBlogSetting(data) {
    return axios.post("/admin/blog/setting/update", data)
}