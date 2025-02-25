var mongoose = require('mongoose');
var db = require('../config/db');
var Schema = mongoose.Schema;

//用户表
var UserSchema = new Schema({
    name: {type: String},            //用户名
    pwd: {type: String},            //密码
    email: {type: String},            //邮箱
    sex: {type: String,default:'asexual'},            //性别
    birth: {type: Date},            //生日
    phone: {type: Number},            //电话
    explain: {type: String},            //介绍
    imgurl: {type: String,default:'/user/user.png'},            //用户头像
    time: {type: Date},            //注册时间
});


//好友表
var FriendSchema = new Schema({
    userID: {type: Schema.Types.ObjectId,ref:'User'},               //用户ID
    friendID: {type: Schema.Types.ObjectId,ref:'User'},             //好友ID
    state: {type: String},                                          //通过状态（0,1,2）
    time: {type: Date},                                             //生成时间
    markname:{type:String},                                          //昵称  
    lastTime:{type: Date},                                          //最后通信时间
});

//一对一消息表
var MessageSchema = new Schema({
    userID: {type: Schema.Types.ObjectId,ref:'User'},               //用户ID
    friendID: {type: Schema.Types.ObjectId,ref:'User'},             //好友ID
    message: {type: String},                                        //内容
    types: {type: String},                                          //类型                                            
    time: {type: Date},                                             //发送时间
    state:{type:Number},                                            //消息状态（0未读，1已读）
});

//群表
var GroupSchema = new Schema({
    userID: {type: Schema.Types.ObjectId,ref:'User'},                //用户ID
    name: {type: String},                                            //群名
    imgurl: {type: String,default:'/group/group.png'},                      //群头像                                        
    notice: {type: String},                                           //群公告                                            
    time: {type: Date},                                             //创建时间
});

//群成员表
var GroupUserSchema = new Schema({
    groupID: {type: Schema.Types.ObjectId,ref:'Group'},                //群ID
    userID: {type: Schema.Types.ObjectId,ref:'Group'},  
    name: {type: String},                                                //群名
    tip: {type: Number,default:0},                                     //未读消息数                                                                                  
    time: {type: Date},                                              //创建时间
    lastTime:{type: Date},                                             //最后通信时间
    shield:{type:Number},                                            //是否屏蔽
});


//群消息表
var GroupMessageSchema = new Schema({
    groupID: {type: Schema.Types.ObjectId,ref:'User'},               //用户ID
    userID: {type: Schema.Types.ObjectId,ref:'User'},             //好友ID
    message: {type: String},                                        //内容
    types: {type: String},                                          //类型                                            
    state:{type:Number},                                            //消息状态（0未读，1已读）
});

module.exports = db.model('User',UserSchema);
module.exports = db.model('Friend',FriendSchema);
module.exports = db.model('Message',MessageSchema);
module.exports = db.model('Group',GroupSchema);
module.exports = db.model('Groupuser',GroupUserSchema);
module.exports = db.model('GroupMsg',GroupMessageSchema);