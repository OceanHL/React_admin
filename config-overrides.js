const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override( 
    // 针对antd实现按需打包：根据Import来打包（使用babel-plugin-import）
    // 因为babel-plugin- 前缀都一样 所以只需要写 import
    fixBabelImports('import', { 
    // 针对antds实现按需打包：根据import来打包
        libraryName: 'antd',
        libraryDirectory: 'es', 
        style: true, //  ===》 自动打包相关的样式 true 使用编译后的css
    }), 

    // 使用Less-loader 对源码中的Less的变量进行重新指定
    // 配置主题颜色
    addLessLoader({ 
        lessOptions: {
            javascriptEnabled: true, 
            modifyVars: {'@primary-color': '#1DA57A'}, // 控件主题颜色
        }
    }),
);

