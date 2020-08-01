import React from 'react';
import './index.less';
/* 
外形像链接的按钮
*/
export default function LinkButton(props) {
    // 不知道传什么参数 用... 把对象的所有参数 进行拆分  分别使用
    return <button {...props} className="link-button"></button>
}