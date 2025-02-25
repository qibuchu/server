//主页
var dbserver = require('../dao/dbserver');

//获取好友列表
exports.getFriend = function(req, res){
let data = req.body;

//dbserver.getUsers(data, res);
//console.log(data,'index.js')
if(data.state == 0){
    dbserver.getUsers(data, res);
}else if(data.state == 1){
    dbserver.getUsers1(data, res);}
}

//获取最后一条消息
exports.getLastMsg = function(req,res){
    let data = req.body;
    dbserver.getOneMsg(data)
    .then(result => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).send('No message found');
        }
    })
    .catch(error => {
       // console.error('Error getting last message:', error);
    });
}



//获取好友未读消息数
exports.unreadMsg = function(req,res){
let data = req.body;
dbserver.unReadMsg(data, res)
.then(result => {
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).send('No message found');
    }
})
.catch(error => {
    //console.error('Error getting last message:', error);
});
}

//好友消息标已读
exports.updateMsg = function(req,res){
    let data = req.body;
    dbserver.updateMsg(data,res);
}

//获取群列表
exports.getGroup = function(req, res){
    let uid = req.body.uid;
    dbserver.getGroup(uid,res);
}   
//获取最后一条群消息
exports.getLastGroupMsg = function(req,res){
let gid = req.body.gid;
dbserver.getOneGroupMsg(gid,res);
}   
//群消息标已读
exports.updateGroupMsg = function(req,res){
let data = req.body;
dbserver. updateGroupMsg(data, res);

}