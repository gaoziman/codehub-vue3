<template>
  <el-dialog v-model="dialogVisible" :title="title"  width="40%" :draggable="true" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <!-- 插槽 -->
    <slot></slot>
    <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit" :loading="btnLoading">
                    {{ confirmText }}
                </el-button>
            </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, watch} from 'vue'

const dialogVisible = ref(false)

// 打开
const open = () => dialogVisible.value = true
// 关闭
const close = () => dialogVisible.value = false

// 确认按钮加载 loading
const btnLoading = ref(false)

// 显示 loading
const showBtnLoading = () => btnLoading.value = true
// 隐藏 loading
const closeBtnLoading = () => btnLoading.value = false

// 对外暴露属性
const props = defineProps({
  title: String, // 字段类型
  width: {
    type: String,
    default: '40%' // 默认值
  },
  destroyOnClose:  {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: '提交'
  },
  form: Object,
  data: Object
})


// 监听 data 属性变化，填充 form 数据
watch(() => props.data, (newVal) => {
  if (newVal) {
    Object.assign(props.form, newVal)
  }
}, { immediate: true })

// 暴露给父组件
defineExpose({
  open,
  close,
  showBtnLoading,
  closeBtnLoading
})

// 对外暴露一个 submit 方法
const emit  = defineEmits(['submit'])
const submit = () => emit('submit')

</script>