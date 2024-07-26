<template>
  <div>
    <!-- 表头分页查询条件， shadow="never" 指定 card 卡片组件没有阴影 -->
    <el-card shadow="never" class="mb-5">
      <!-- flex 布局，内容垂直居中 -->
      <div class="flex items-center">
        <el-text>分类名称</el-text>
        <div class="ml-3 w-52 mr-5">
          <el-input v-model="searchCategoryName" placeholder="请输入分类名称" clearable @clear="onClearForm"/>
        </div>

        <el-text>创建日期</el-text>
        <div class="ml-3 w-30 mr-5">
          <el-date-picker v-model="pickDate" type="daterange" range-separator="至" start-placeholder="开始时间"
                          end-placeholder="结束时间" :shortcuts="shortcuts" size="default" @change="datepickerChange"  @clear="onClearDate"/>
        </div>

        <el-button type="primary" class="ml-3" :icon="Search" @click="getTableData">
          查询
        </el-button>
        <el-button class="ml-3" :icon="RefreshRight" @click="reset">重置</el-button>
      </div>
    </el-card>

    <!-- 新增按钮 -->
    <div class="mb-5">
      <el-button type="primary" @click="addCategoryBtnClick">
        <el-icon class="mr-1">
          <Plus/>
        </el-icon>
        新增
      </el-button>
    </div>

    <!-- 分页列表 -->
    <el-table :data="tableData" border stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="name" label="分类名称"/>
      <el-table-column prop="createTime" label="创建时间"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editCategoryBtnClick(scope.row)">
            <el-icon class="mr-1">
              <Edit/>
            </el-icon>
            更新
          </el-button>
          <el-button type="danger" size="small" @click="deleteCategorySubmit(scope.row)">
            <el-icon class="mr-1">
              <Delete/>
            </el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5, 10, 20]"
                   :small="false" :background="true" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" @size-change="handleSizeChange" @current-change="getTableData"
                   style="margin-top: 20px;margin-left: 450px"/>

    <!-- 添加分类 -->
    <FormDialog ref="formDialogRef" destroyOnClose :title="dialogTitle" @submit="onSubmit">
      <el-form ref="formRef" :rules="rules" :model="form">
        <el-form-item label="分类名称" prop="name" label-width="80px" size="large">
          <el-input v-model="form.name" placeholder="请输入分类名称" maxlength="20" show-word-limit clearable/>
        </el-form-item>
      </el-form>
    </FormDialog>

  </div>
</template>

<script setup>
// 引入所需图标
import {Search, RefreshRight, Delete, Plus, Edit,} from '@element-plus/icons-vue'
import {ref, reactive,onMounted, onBeforeUnmount} from 'vue'
import moment from 'moment'
import {addCategory, deleteCategory, getCategoryPageList, updateCategory} from '@/api/admin/category'
import {showMessage, showModel} from "@/composables/util.js";
import FormDialog from "@/components/FormDialog.vue";

// 分页查询的分类名称
const searchCategoryName = ref('')
// 日期
const pickDate = ref('')

// 表格数据
const tableData = ref([])
// 当前页码，给了一个默认值 1
const pageNum = ref(1)
// 总数据量，给了个默认值 0
const total = ref(0)
// 每页显示的数据量，给了个默认值 10
const pageSize = ref(5)

// 表格加载 Loading
const tableLoading = ref(false)

// 查询条件：开始结束时间
const startDate = reactive({})
const endDate = reactive({})

// 监听日期组件改变事件，并将开始结束时间设置到变量中
const datepickerChange = (e) => {
  if (e && e.length === 2) {
    startDate.value = moment(e[0]).format('YYYY-MM-DD');
    endDate.value = moment(e[1]).format('YYYY-MM-DD');
  } else {
    startDate.value = '';
    endDate.value = '';
  }
}

// 引入shortcuts快捷选择日期
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]


// 清空日期选择器时调用查询方法
const onClearDate = ()=>{
  startDate.value = '';
  endDate.value = '';
  getTableData();
}

// 清空查询条件时调用查询方法
const onClearForm = ()=>{
  form.name = ''
  getTableData();
}

// 获取分页数据
const getTableData = () => {
  // 显示表格 loading
  tableLoading.value = true
  getCategoryPageList(
      {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        startDate: startDate.value,
        endDate: endDate.value,
        name: searchCategoryName.value
      }).then(res => {
    if (res.status === true) {
      tableData.value = res.data
      pageNum.value = res.pageNum
      pageSize.value = res.pageSize
      total.value = res.total
    }
  }).finally(() => tableLoading.value = false) // 隐藏表格 loading
}

// 重置
const reset = () => {
  searchCategoryName.value = ''
  pickDate.value = ''
  startDate.value = ''
  endDate.value = ''
  getTableData()
}

// 每页展示数量变更事件
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  getTableData()
}


// 对话框是否显示
// const dialogVisible = ref(false)
const formDialogRef = ref(null)

const formRef = ref(null)

// 动态标题
const dialogTitle = ref('添加文章分类')

// 新增分类按钮点击事件
const addCategoryBtnClick = () => {
  dialogTitle.value = '添加文章分类'
  form.name = '';  // 清空分类名称
  formDialogRef.value.open()
}

// 分类表单对象
const form = reactive({
  name: '',
})

// 规则校验
const rules = {
  name: [
    {
      required: true,
      message: '分类名称不能为空',
      trigger: 'blur'
    },
    {min: 1, max: 20, message: '分类名称字数要求大于 1 个字符，小于 20 个字符', trigger: 'blur'},
  ]
}

// 更新分类按钮点击事件
const editCategoryBtnClick = (row) => {
  dialogTitle.value = '更新文章分类';
  Object.assign(form, row); // 将选中行数据填充到表单
  formDialogRef.value.open();
};


// 提交事件
const onSubmit = () => {
  // 先验证form 表单字段
  formRef.value.validate((valid) => {
    if (!valid) {
      return false
    }
    // 显示提交按钮 loading
    formDialogRef.value.showBtnLoading()

    if (dialogTitle.value === '添加文章分类') {
      // 请求添加分类接口
      addCategory(form).then((res) => {
        if (res.status === true) {
          showMessage('添加成功')
          // 将表单中分类名称置空
          form.name = ''
          // 隐藏对话框
          formDialogRef.value.close()
          // 重新请求分页接口，渲染数据
          getTableData()
        } else {
          // 获取服务端返回的错误消息
          let message = res.message
          // 提示错误消息
          showMessage(message, 'error')
        }
      }).finally(() => formDialogRef.value.closeBtnLoading()) // 隐藏提交按钮 loading
    } else if (dialogTitle.value === '更新文章分类') {
      // 请求更新分类接口
      updateCategory(form).then((res) => {
        if (res.status === true) {
          showMessage('更新成功')
          // 将表单中分类名称置空
          form.name = ''
          // 隐藏对话框
          formDialogRef.value.close()
          // 重新请求分页接口，渲染数据
          getTableData()
        } else {
          // 获取服务端返回的错误消息
          let message = res.message
          // 提示错误消息
          showMessage(message, 'error')
        }
      }).finally(() => formDialogRef.value.closeBtnLoading()) // 隐藏提交按钮 loading
    }
  })
}

// 删除方法
const deleteCategorySubmit = (row) => {
  deleteCategory({
    id: row.id
  }).then(res => {
    showModel('是否确定要删除该分类？').then(() => {
      if (res.status === true) {
        showMessage('删除成功')
        // 重新请求分页接口，渲染数据
        getTableData()
      } else {
        // 获取服务端返回的错误消息
        let message = res.message
        // 提示错误消息
        showMessage(message, 'error')
      }
    }).catch(() => {
    })
  })
}

getTableData()



// 按回车键后，执行查询
function onKeyUp(e) {
  console.log(e)
  if (e.key == 'Enter') {
    getTableData()
  }
}

// 添加键盘监听
onMounted(() => {
  document.addEventListener('keyup', onKeyUp)
})

// 移除键盘监听
onBeforeUnmount(() => {
  document.removeEventListener('keyup', onKeyUp)
})

</script>