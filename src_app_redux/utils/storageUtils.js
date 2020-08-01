/* 
进行local数据存储管理的工具模块
*/
import store from 'store';
const USER_KEY = 'user_key'

export default {
    /* 
    保存user
    */
   saveUser(user) {
    //   setItem(key: string, value: string) 
    // 因为user 是一个对象 如果 对象存储为字符串 ==》 '[object Object]' 这个文本没有用
    // 所以必须转换成 json格式对象 stringify 转换为json 格式 parse是解析json格式
    // localStorage.setItem(USER_KEY, JSON.stringify(user));
    store.set(USER_KEY, user)
   },
   /* 
    读取user
    */
   getUser() {
    //    parse 没有数据时 会 解析成 null
    //  所以 若localStorage.getItem('user_key') 有值 解析它  没有值 解析json字符串 空对象
    // parse 解析的是 json格式的 字符串
    // 获取user_key 的 json 格式的 字符串对象
    //    return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
    return store.get(USER_KEY) || {}
   },
   /* 
    删除user
    */
   removeUser() {
    // localStorage.removeItem(USER_KEY);
    store.remove(USER_KEY);
   }
}