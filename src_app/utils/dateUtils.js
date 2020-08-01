/* 
包含n个日期时间处理的工具函数模块
*/

/* 
格式化日期
*/

export function formateDate(time) { // 参数是 时间戳
    if(!time) return ''  // 如果 time为空
    let date = new Date(time);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
     + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}