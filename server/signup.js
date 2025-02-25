var dbserver = require('../dao/dbserver');

var email = require('../dao/emailserver');

//用户注册
exports.signUp = async function(req,res){
   
    // let name = req.body.name;
    // let mail = req.body.mail;
    // let pwd = req.body.pwd;
    const {name,mail,pwd} = req.body;
    //发送邮件
   await email.emailSignUp(mail);

    dbserver.buildUser(name,mail,pwd,res);
}

//用户或邮箱是否占用判断
exports.judgeValue = function(req,res){
    const {data,type} = req.body;
    dbserver.countUserValue(data,type,res)
}