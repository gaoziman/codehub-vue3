// 消息提示
import {ElMessage} from "element-plus";
import 'element-plus/es/components/message/style/css'

export function showMessage(message = '提示内容', type = 'success', customClass = '') {
    return ElMessage({
        type: type,
        message,
        customClass,
    })
}