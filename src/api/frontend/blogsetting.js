import axios from "@/axios";

// 获取博客设置详情
export function getBlogSettingDetail() {
    return axios.post("/blog/setting/detail")
}