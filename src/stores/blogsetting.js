import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getBlogSettingDetail} from '@/api/frontend/blogsetting'

export const useBlogSettingStore = defineStore('blogsettings', () => {
    // 博客设置信息
    const blogSetting = ref({})

    // 获取博客设置信息
    function getBlogSetting() {
        // 调用后台获取博客设置信息接口
        getBlogSettingDetail().then(res => {
            if (res.status) {
                blogSetting.value = res.data
            }
        })
    }

    return { blogSetting, getBlogSetting }
})