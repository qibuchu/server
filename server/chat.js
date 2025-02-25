//聊天
var dbserver = require('../dao/dbserver');

//获取一对一聊天数据
exports.msg = function(req,res){
    let data = req.body;
    dbserver.msg(data,res);
}

//获取群聊天数据
exports.gmsg = function(req,res){
    let data = req.body;
    dbserver.gmsg(data,res);
}
