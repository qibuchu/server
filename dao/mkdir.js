const fs = require('fs');
const path = require('path');

// 导出一个函数，用于递归创建目录
exports.mkdirs = function (pathname, callback) {
    // 判断是否是绝对路径，如果不是，则转换为绝对路径
    pathname = path.isAbsolute(pathname) ? pathname : path.join(__dirname, pathname);
    
    // 获取相对路径
    pathname = path.relative(__dirname, pathname);
    
    // 将路径分割成目录数组，使用path.sep来兼容不同操作系统的路径分隔符
    let folders = pathname.split(path.sep);
    
    // 初始化前置路径
    let pre = "";
    
    // 遍历目录数组，逐个创建目录
    folders.forEach(floder => {
        try {
            // 尝试获取目录的状态，如果目录存在，则抛出异常
            let stat = fs.statSync(path.join(__dirname, pre, floder));
            let hasMkdir = stat && stat.isDirectory();
            if (hasMkdir) {
                // 如果目录已存在，则调用回调函数
                callback && callback(`目录${floder}已经存在，不能重复创建，请重新创建`);
            }
        } catch (error) {
            // 如果目录不存在，则创建目录
            try {
                // 同步创建目录
                fs.mkdirSync(path.join(__dirname, pre, floder));
                // 创建成功后，调用回调函数
                callback && callback(null);
            } catch (error) {
                // 如果创建目录时发生错误，则调用回调函数并传递错误信息
                callback && callback(error);
            }
        }
        // 更新前置路径
        pre = path.join(pre, floder);
    });
};
