var dbserver = require('../dao/dbserver');
//引入邮箱
var emailserver = require('../dao/emailserver');

var signup = require('../server/signup');

var signin = require('../server/signin');

var search = require('../server/search');

var user = require('../server/userdetial');

//好友服务
var friend = require('../server/friend');
//主页
var index = require('../server/index');
//聊天
var chat = require('../server/chat');
//群
var group = require('../server/group');


module.exports = function(app){
    app.get('/text',(req,res) => 
       res.send('这里是text页面'));


    app.post('/mail',(req,res)=>{
    let mail = req.body.mail;
    emailserver.emailSignUp(mail,res);
    //res.send(mail)
    //console.log(mail);
})

//注册页面
//注册
app.post('/signup/add',(req,res) =>{
    signup.signUp(req,res);
})

//用户或邮箱是否专用判断
app.post('/signup/judge',(req,res) =>{
    signup.judgeValue(req,res);
})




//登录页面
//登录
app.post('/signin/match',(req,res) =>{
    signin.signIn(req,res);
})

//搜索页面
//搜索用户
app.post('/search/user',(req,res) =>{
    search.searchUser(req,res);
})

//判断是否为好友
app.post('/search/isfriend',(req,res) =>{
    search.isFriend(req,res);
})

//搜索群
app.post('/search/group',(req,res) =>{
    search.searchGroup(req,res);
})


//判断是否在群内
app.post('/search/isingroup',(req,res) =>{
    search.isInGroup(req,res);
})

//用户详情
//详情
app.post('/user/detail',(req,res) =>{
    user.userDetail(req,res);
})


//用户信息修改
app.post('/user/update',(req,res) =>{
    user.userUpdate(req,res);
})

//好友昵称修改
app.post('/user/updatemarkname',(req,res) =>{
    user.updateMarkName(req,res);
})


//好友昵称获取
app.post('/user/getmarkname',(req,res) =>{
    user.getMarkName(req,res);
})

//好友操作
//申请好友
app.post('/friend/applyfriend',(req,res) => {
    friend.applyFriend(req,res);
})

//好友状态修改
app.post('/friend/updatefriendstate',(req,res) => {
    console.log(req.body)
    friend.updateFriendState(req,res);
})

//拒绝好友或删除好友
app.post('/friend/deletefriend',(req,res) => {
    friend.deleteFriend(req,res);
})

//主页
//获取好友
app.post('/index/getfriend',(req,res) => {
    //console.log(req,'index,router,getfriend')
    index.getFriend(req,res);
})


//获取最后一条消息
app.post('/index/getlastmsg', (req,res) => {
    //console.log(req.body,'index,router,getfriend')
index.getLastMsg(req, res);
})



//获取好友未读消息数
app.post('/index/unreadmsg',(req,res) => {
index.unreadMsg(req, res);
})

//好友消息标已读
app.post('/index/updatemsg',(req,res) => {
    index. updateMsg(req,res);
})

//获取群
app.post('/index/getgroup',(req,res) => {
    index.getGroup(req,res);
})   
    //获取最后一条群消息
    app.post('/index/getlastgroupmsg', (req,res) => {
    index.getLastGroupMsg(req,res);
})   
    //群消息标已读
    app.post('/index/updategroupmsg', (req, res) => {
    index. updateGroupMsg(req,res);
})

//聊天页面
app.post('/chat/msg',(req,res) => {
    chat.msg(req,res);
})

//建群页
//建群
app.post('/group/creategroup', (req, res) => {
    group.createGroup(req,res);
})


// //token测试
// app.post('/signin/test',(req,res) =>{
//     signin.test(req,res);
// })

}


