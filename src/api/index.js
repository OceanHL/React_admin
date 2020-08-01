/* 
要求： 能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值 都是 promise

基本要求：能根据接口文档定义接口请求函数
 */
import jsonp from 'jsonp';
import {message} from 'antd';
import ajax from './ajax';
// const BASE = 'http://localhost:5000';
const BASE = '/api';
//  登录login
/* export function reqLogin(username, password) {
   return ajax('/login', {username, password}, 'POST');
} */
// ajax 返回的是一个对象
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

// 获取一级、二级分类的列表
// 默认get请求
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})
// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')
// 更新分类名称
export const reqUpdateCategorys = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')


// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

// 获取商品分页列表   参数： 第几页  每页几条数据
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize});

// 更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST');

/* 
搜索商品分页列表 （根据商品名称/ 商品描述）         地址前头的 / 千万 千万 别丢掉
searchType: 搜索的类型， productName/productDesc
*/
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
   pageNum, 
   pageSize,
   [searchType]: searchName, // 加[] 说明取searchType的值 作为 对象名
})

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST');

// 添加/更新商品  因为好多参数 直接 传递一个 对象就行了
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')


//   获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list');

//  添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST');

// 更该角色权限
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST');


/* 获取所有用户的列表 */
export const reqUsers = () => ajax(BASE + '/manage/user/list');

/* 删除指定用户 */
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST');

/* 添加 / 更新用户 */
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST');
/* 
json请求的接口请求函数
// 接口都要返回 promise对象
*/
export const reqWeather = (city) => {

   return new Promise((resolve, reject) => {
      const url = `http://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz&city=${city}`;
      jsonp(url, {}, (err, data) => {
         console.log('jsonp()', err, data);
         // 如果成功 err 没有值 false
         if(!err && data.data) { // err 没有值  data.data 有值
            // 取想要的数据
            const weather_date = data.data[0].date; // 日期
            const weather_wea = data.data[0].wea_day; // 多云
            const weather_air_level = data.data[0].air_leve; // 空气质量
            // 利用Promise 返回 获得 数据
            resolve({weather_date,weather_wea,weather_air_level})
         }else {
            // 如果失败
            message.error('获取天气信息失败！')
         }

      })
   })

   
}

reqWeather('宝鸡')