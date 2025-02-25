//应用发送邮件插件
var nodemailer = require('nodemailer');

//引入证书文件
var credentials = require('../config/credentials');

//创建传输方式
var transporter = nodemailer.createTransport({
    service:'qq',
    auth:{
        user:credentials.qq.user,
        pass:credentials.qq.pass,

    }
});

//注册发送邮件给用户
exports.emailSignUp = function(email) {
    return new Promise((resolve, reject) => {
        let options = {
            from: '3082537830@qq.com',
            to: email,
            subject: '感谢您在yike注册',
            html: '<span>欢迎您的加入</span><a href="http://localhost:8080/">点击</a>'
        };

        transporter.sendMail(options, function(err, info) {
            if (err) {
                reject('邮件发送失败: ' + err.message);
            } else {
                resolve(info);
            }
        });
    });
};