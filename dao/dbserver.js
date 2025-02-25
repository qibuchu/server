var dbmodel = require('../model/dbmodel');
var User = dbmodel.model('User');
var Friend = dbmodel.model('Friend');
var Group = dbmodel.model('Group');
var GroupUser = dbmodel.model('Groupuser');
var Message = dbmodel.model('Message');
//引入加密文件
const bcrypt = require('../dao/bcrypt');


//引入token
var jwt = require('../dao/jwt');

exports.findUser = function(res){
    User.find(a,b,function(err,val){
        if(err){
            console.log('用户数据查找失败！'+err);
        }else {
            res.send(val);
        }
    })
}


//新建用户
exports.buildUser = function(name,mail,pwd,res){
    //密码加密
        let password = bcrypt.encryption(pwd);
        
        let data = {
            name: name,
            email: mail,
            pwd: password,
            time: new Date(),
        }
    
        let user = new User(data);
    
        user.save()
            .then(result => {
                // 保存成功，返回200状态码和用户的ID
                //console.log(res)
                res.status(200).json({
                    status:200
                });
            })
            .catch(err => {
                // 发生错误时，返回500状态码和错误信息
                res.status(500).send('用户创建失败');
            });

    }
    
// 匹配用户表项目元素个数
exports.countUserValue = function(data,type,res){

    let wherestr = {};

    wherestr[type] = data;
    User.countDocuments(wherestr,function(err,result){
        if(err){
            res.status(500).send((result[0]?.id)?.toString());


        }else{
                res.status(200).json({
                status: 200,
                id: result[0]?.id?.toString(),
                result: result
});

        }
    })
}
//用户验证
exports.userMatch = async function(data, pwd, res) {
    try {
        let wherestr = {$or: [{'name': data}, {'email': data}]};
        let out = {'name': 1, 'pwd': 1, 'imgurl': 1}; // 确保输出中也包含 imgurl

        const result = await User.find(wherestr, out);


        if (result.length == 0) {
            return res.send({status: 400, message: 'User not found'});
        }

        for (let e of result) {
            console.log('User provided password:', pwd);
            console.log('Database stored password:', e.pwd);
            const pwdMatch = bcrypt.verification(pwd,e.pwd);
            if (pwdMatch) {
                let token=jwt.generateToken(e._id);
                //console.log('token:', token);
                let back = {
                    id: e._id,
                    name: e.name,
                    imgurl: e.imgurl,
                    token: token,
                };
                
                return res.send({status: 200, back}); // 发送响应并退出函数
            }
        }

        // 如果所有用户都不匹配，则发送密码错误
        res.send({status: 400, message: 'Invalid credentials'});
    } catch (err) {
        console.error(err);
        res.send({status: 500, message: 'Internal server error'});
    }
};


// //用户验证
// exports.userMatch = function(data,pwd,res){
//     let wherestr = {$or:[{'name':data},{'email':data}]};
//     let out = {'name': 1, 'imgurl': 1, 'psw': 1}

//     User.find(wherestr,out,function(err,result){
//         if(err){
//             res.send({status:500});
//         }else{
//             if(result == ''){
//                 res.send({status:400});
//             }
//             result.map(function(e){
//                 const pwdMatch = bcrypt.verification(pwd,e.psw);
//                 if(pwdMatch){
//                     let token=jwt.generateToken(e._id);
//                     let back = {
//                         id:e._id,
//                         name:e.name,
//                         imgurl: e.imgurl,
//                         token:token,
//                     }
//                     res.send({status:200,back});
//                 }else{
//                     res.send({status:400});
//                 }
//             })
//         }
//     })
// }

//搜索用户
exports.searchUser = function(data,res){
    let wherestr;
    if(data == 'yike'){
         wherestr = {};
    }else{
         wherestr =  {$or:[{'name':{$regex:data}},{'email':{$regex:data}}]};
    }

    let out = {
        'name':1,
        'email':1,
        'imgurl':1,
    }
    User.find(wherestr, out)
        .then(result => {
            res.send({ status: 200, result });
        })
        .catch(err => {
            res.send({ status: 500 });
        });
}

//判断是否为好友
exports.isFriend = function(uid,fid,res){
    let wherestr = {'userID': uid, 'friendID': fid, 'state': 0};
    Friend.findOne(wherestr,function(err,result){
        if(err){
            res.send({status:500});
        }else{
            if(result){
                res.send({status:200})
            }else{
                res.send({status:400});
            }
        }
    })
}
// //判断是否为好友
// exports.isFriend =  function(uid, fid, res) {
//     let wherestr = {'userID': uid, 'friendID': fid, 'state': 0};
//     let out = {}
//     try {
//         const result =  Friend.findOne(wherestr);
//         console.log(result);
//         if (result) {
//             // 是好友
//             res.status(200).send({ status: 200 });
//         } else {
//             // 不是好友
//             res.status(400).send({ status: 400 });
//         }
//     } catch (err) {
//         // 发生错误
//         res.status(500).send({ status: 500, error: err.message });
//     }
// };

//搜索群
exports.searchGroup = function(data,res){
    let wherestr
    if(data == 'yike'){
         wherestr = {};
    }else{
         wherestr =  {'name':{$regex:data}};
    }

    let out = {
        'name':1,
        'imgurl':1,
    }
    Group.find(wherestr,out,function(err,result){
        if(err){
            res.send({status:500});
        }else{
            res.send({status:200,result})
        }
    }) 
}


//判断是否在群内
exports.ifGroup = function(uid,gid,res){

    let wherestr = {'userID':uid,'groupID':gid}
    GroupUser.findOne(wherestr,function(err,result)
{
    if(err){
        res.send({status:500});
    }else{
        if(result){
            //在群内
            res.send({status:200})
        }else{
            //不在群内
            res.send({status:400});
        }
    }
})
}

//用户详情
exports.userDetail = function(id,res){
    let wherestr = {'_id':id};
    let out = {'pwd':0}
    User.findOne(wherestr,out,function(err,result){
        if(err){
            res.send({status:500});
        }else{
            console.log(result)
            res.send({status:200,result});
        }
    })
}

function update(data,update,res){
    User.findByIdAndUpdate(data,update,function(err,result){
        if(err){
            //修改失败
            res.send({status:500});
        }else{
            res.send({status:200});
        }
    })

}

//用户信息修改
exports.userUpdate = function(data,res){
    let updatestr = {}

    //判断是否有密码
    if(typeof(data.pwd)!='undefined'){
        //有密码进行匹配
        User.find({'_id':data.id},{'pwd':1},function(err,result){
            if(err){
                res.send({status:500});
            }else{
                if(result == ''){
                    res.send({status:400});
                }
                result.map(function(e){
                    console.log(data.pwd,e.pwd,'两个密码')
                    const pwdMatch = bcrypt.verification(data.pwd,e.pwd);
                    console.log( pwdMatch)
                    if(pwdMatch){
                        //密码验证成功
                        //如果为修改密码先加密
                        console.log(data.type)
                        if(data.type == 'pwd'){
                            //密码加密
                            console.log(data.data,'改密码')
                            let password = bcrypt.encryption(data.data);
                            console.log(password,'新密码加密')
                            updatestr[data.type] = password;
                            console.log(updatestr,'新密码加密')
                            update(data.id,updatestr,res);
                        }else{
                            //邮箱匹配

                            updatestr[data.type] = data.data;
                            User.countDocuments(updatestr,function(err,result){
                                if(err){
                                    res.send({status:500});
                        
                        
                                }else{
                                    //没有匹配项，可以修改
                                   if(result == 0){
                                    update(data.id,updatestr,res);
                                   }else{
                                    //已存在
                                    res.send({status:300});
                                   }
                        
                                }
                            })
                        }
                        
                        
                        
                    }else{
                        //密码匹配失败
                        res.send({status:400});
                    }
                })
            }
        })
    }else if(data.type == 'name'){
        //如果是用户名先进行匹配
        updatestr[data.type] = data.data;
                            User.countDocuments(updatestr,function(err,result){
                                if(err){
                                    res.status(500).send((results[0].id).toString());
                        
                        
                                }else{
                                    //没有匹配项，可以修改
                                   if(result == 0){
                                    update(data.id,updatestr,res);
                                   }else{
                                    //已存在
                                    res.status(300).send((results[0].id).toString());
                                   }
                        
                                }
                            })

    } else{
        //一般项目修改
        updatestr[data.type] = data.data;
        update(data.id,updatestr,res);

    }

}

//获取好友昵称
exports.getMarkName =  function(data,res){
    let wherestr = {'userID':data.uid,'friendID':data.fid};
    let out = {'markname':1};
    User.findOne(wherestr,out,function(err,result){
        if(err){
            res.send({status:500});
        }else{
            //console.log(result)
            res.send({status:200,result});
        }
    })
}



//修改好友昵称
exports.updateMarkName = function(data,res){
    let wherestr = {'userID':data.uid,'friendID':data.fid};
    let updatestr = {'markname':data.name};
    Friend.updateOne(wherestr,updatestr,function(err,result){
        if(err){
            res.send({status:500});
        }else{
            res.send({status:200});
        }
    })
}

//好友操作
//添加好友表
exports.buildFriend =function(uid,fid,state){
    let data = {
        userID: uid,
        friendID: fid,
        state: state,
        time: new Date(),
        lastTime: new Date(),
    }

    let friend = new Friend(data);
  console.log(111)
    friend.save(function(err){
        if(err){
            console.log('好友申请出错');
            //res.send({status:500});

        }else{
            console.log('好友申请成功');
            //res.send({status:200});
        }
    }) 

}

//最后通讯时间
exports.upFriendLastTime = function(data)
{
    let wherestr = {$or:[{'userID':data.uid,'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]};
    let updatestr = {'lastTime':new Date()};

    Friend.updateMany(wherestr,updatestr,function(err,result){
        if(err){
           // res.status(500).send((results[0].id).toString());
           console.log('更新好友最后通讯时间出错');
          // res.send({status:500});
        }else{
            //res.status(200).send((results[0].id).toString());
            //res.send({status:200});
        }
    })
}


//添加一对一消息
exports.insertMsg = function(uid,fid,msg,type,res){
    let data = {
        userID: uid,
        friendID: fid,
        message: msg,
        types:type,
        time: new Date(),
        state: 1,
    }
    console.log(data)

    let message = new Message(data);
    console.log(message,'message')

    message.save(function(err,result){
        if(err){
           if(res){
            res.send({status:500})
           }
           console.log(err)
            //res.send({status:500});

        }else{
            if(res){
                res.send({status:200,result})
               }
            //res.send({status:200});
            console.log('message保存成功')
        }
    }) 
}
//好友申请
exports.applyFriend = function(data,res){
    //判断是否为初次申请
    let wherestr = {'userID':data.uid,'friendID':data.fid};
    Friend.countDocuments(wherestr,(err,result) => {
        if(err){
            res.send({status:500});
        }else{
            //如果result = 0 为初次申请
            if(result==0){
                console.log('初次申请')
                this.buildFriend(data.uid,data.fid,2);
                this.buildFriend(data.fid,data.uid,1);
            }else{
                //已经申请过好友
                console.log('二次申请')
                this.upFriendLastTime(data.uid,data.fid);
                this.upFriendLastTime(data.fid,data.uid);
                
            }
            //添加消息
            this.insertMsg(data.uid,data.fid,data.msg,0,res);
        }
    })

}

//更新好友状态
exports.updateFriendState = function(data, res){
    //修改项
    let wherestr = {$or: [{'userID':data. uid, 'friendID' :data. fid}, {'userID' : data. fid, 'friendID' : data. uid}]};
    Friend. updateMany(wherestr, {'state':0}, function(err, result){
    if(err){
    res.send({status:500});
    }else{
    res.send({status:200});    
    }
    })
}

//拒绝好友或删除好友
exports.deleteFriend = function(data, res){
    //修改项
    let wherestr = {$or: [{'userID': data. uid, 'friendID' : data. fid}, {'userID' : data. fid, 'friendID' : data.uid}]};
    Friend.deleteMany(wherestr, function(err,result){
    if(err){
    res.send({status:500});
    }else{
    res. send({status:200});
    }
    })
}

//按要求获取用户列表,解决异步问题
exports.getUsers1 = async function(data,res){
    const value = await new Promise(function (resolve, reject) {
        let query = Friend.find();
        //查询条件
        query.where({ 'userID': data.uid, 'state': data.state });
        //console.log(data.state, 100);
        //查找frindeID 关联的user对象
        query.populate('friendID');
        //排序方式 最有通讯时间倒序排列
        query.sort({ 'lastTime': -1 });
        //查询结果
        query.exec().then(function (e) {
            let result = e.map(function (ver) {
                return {
                    id: ver.friendID._id,
                    name: ver.friendID.name,
                    markname: ver.markname,
                    imgurl: ver.friendID.imgurl,
                    lastTime: ver.lastTime,
                    type: 0,
                };
            });
            //console.log(result)
            resolve({ status: 200, result });
        }).catch(function (err) {
            console.log(7)
            reject({ status: 500 });
        });
    });
    res.send(value);
}


//按要求获取用户列表,解决异步问题
function getUser(data){
    return new Promise(function(resolve, reject){
    let query = Friend. find();
    //查询条件
    query.where({'userID':data.uid,'state':data.state});
    console.log(data.state)
    //查找frindeID 关联的user对象
    query. populate('friendID');
    //排序方式 最有通讯时间倒序排列
    query.sort({'lastTime':-1});
    //查询结果
    query.exec().then(function(e){
    let result = e.map(function(ver){
    return {
    id : ver.friendID ._id,
    name : ver. friendID.name,
    markname : ver.markname,
    imgurl : ver. friendID. imgurl,
    lastTime : ver. lastTime,
    type : 0,
    }
    })
    resolve( result);
        }).catch(function(err){
            console.log(6)
            reject({status:500})
        })
    })
}

//按要求获取一条一对一消息
function getoneMsg(uid,fid){
    return new Promise(function(resolve,reject){
        var query = Message.findOne();
        //console.log(query)
//查询条件
query.where({$or: [{'userID':uid,'friendID' :fid}, {'userID':fid, 'friendID' :uid}]});
//排序方式 最有通讯时间倒序排列
query.sort({'time' :-1});
//查询结果
query.exec().then(function(ver){
    
    let result = {
        message: ver.message,
        time:ver.time,
        types: ver.types,
        }
        //console.log(result,'消息2')
    resolve(result);
    }).catch(function(err){
            console.log(3)
            reject({status:500});
    })
    })

}


//汇总一对一消息未读数
exports.unReadMsg = async function(uid, fid) {
    try {
        const count = await Message.countDocuments({
            'userID': uid,
            'friendID': fid,
            'state': 1,
        });
        return count;
    } catch (err) {
       // console.log(4)
        throw { status: 500, message: '服务器内部错误' };
    }
}


//按要求获取一条一对一消息
 exports.getOneMsg = function(uid,fid){
    return new Promise(function(resolve,reject){
        var query = Message.findOne();
        //console.log(query)
//查询条件
query.where({$or: [{'userID':uid,'friendID' :fid}, {'userID':fid, 'friendID' :uid}]});
//排序方式 最有通讯时间倒序排列
query.sort({'time' :-1});
//查询结果
query.exec().then(function(ver){
    
    let result = {
        message: ver.message,
        time:ver.time,
        types: ver.types,
        }
        console.log(result,'消息2')
    resolve(result);
    }).catch(function(err){
            //console(3)
            reject({status:500});
    })
    })

}


//汇总一对一消息未读数
async function unreadMsg(uid, fid) {
    try {
        const count = await Message.countDocuments({
            'userID': fid,
            'friendID': uid,
            'state': 1,
        });
        return count;
    } catch (err) {
        console(4)
        throw { status: 500, message: '服务器内部错误' };
    }
}



// 定义一个异步函数，用于处理好友查询、最后一条消息以及未读消息数的获取
async function doIt(data, res) {
    try{
    let result,bb,cc,err;
    //console(data)
        // 获取用户数据
        [err,result] = await getUser(data).then(data =>[null,data]).catch(err=>[err,null])
        
        // 遍历结果数组，为每个好友获取最后一条消息和未读消息数
        for (var i = 0; i < result.length; i++) {
            [err,bb] = await getoneMsg(data.uid, result[i].id).then(data =>[null,data]).catch(err=>[err,null])
            // 根据消息类型设置消息内容
            if(bb.types == 0){
                //文字
            }else if(bb.types == 1){
                bb.message = '[图片]';
            }else if(bb.types == 2){
                bb.message = '[音频]';
            }else if(bb.types == 3){
                bb.message = '[位置]';
            }
            result[i].msg = bb.message;
            [err,cc] = await unreadMsg(data.uid, result[i].id).then(data =>[null,data]).catch(err=>[err,null])
            result[i].tip =cc;
        }
        if(err){
            res.send(err);
        }else{
            res.send({status:200,result});
        } 
    }catch(err){
        console.error(err)
    }
}

// 导出一个函数，用于处理HTTP请求
exports.getUsers = function(data, res) {
    doIt(data, res);
};



//一对一消息状态修改
exports.updateMsg = function(data, res){
//修改项条件
let wherestr = {'userID':data.uid, 'friendID' : data.fid, 'state':1};
    //修改内容
    let updatestr = {'state': 0}

        Message.updateMany(wherestr,updatestr, (err,result) => {
        if(err){
        res.send({status:500});
        }else{
        res.send({status:200});

        }
    })
}


//新建群
exports.createGroup = function(data,res){
    let groupData = {
        userID:data.uid,
        name:data.name,
        imgurl:data.imgurl,
        time:new Date(),
    }
    console.log('群头像')
    var group = new Group(groupData);
    group.save(function(err,result){
        if(err){
            res.send({status:500});
        }else{
            Group.find({'userID':data.uid,'name':data.name},{'_id':1},function(err,rest){
                if(err){
                    res.send({status:500});
                }else{
                    //添加群成员到群
                    rest.map(function(gid){
                        //添加群主
                        let udata = {
                            groupID:gid._id,
                            userID:data.uid,
                            time:new Date(),
                            lastTime:new Date(),
                        }
                        //加入
                        insertGroupUser(udata);
                        //添加好友入群
                        data.user.map(function(uid){
                            let fdata = {
                                groupID:gid._id,
                                userID:uid,
                                time:new Date(),
                                lastTime:new Date(),
                            }
                            //加入
                            insertGroupUser(fdata);
                        })
                    })
                    //创建成功
                    res.send({status:200});
                }
            })
        }
    })
}


//添加群成员
function insertGroupUser(data){
    var groupuser = new GroupUser(data);

    groupuser.save(function(err,res){
        if(err){
            res.send({status:500});
        }else{
            console.log('添加群成员成功');
        }
    })
}

//添加群成员
exports.insertGroupUser1 =function(data){
    var groupuser = new GroupUser(data);

    groupuser.save(function(err,res){
        if(err){
            res.send({status:500});
        }else{
            console.log('添加群成员成功');
        }
    })
}

//按要求获取群列表
exports.getGroup = function(id,res){
    console.log(id,'获取群列表')
    //id 为用户,所在的群
    let query = GroupUser.find () ;
        //查询条件
        query.where({'userID':id});
        //查找frindeID 关联的user对象
        query.populate('groupID');
        //排序方式 最有通讯时间倒序排列
        query. sort({'lastTime':- 1});
        //查询结果
        query.exec().then(function(e){
        let result = e.map(function(ver){
            return {
                id:ver.groupID._id,
                name: ver.groupID.name,
                markname: ver.name,
                imgurl:ver.groupID. imgurl,
                lastTime:ver. lastTime,
                tip:ver.tip,
                type:1,
            }
        
    })
    console.log(result,'群列表')
        res.send({status:200,result});
    }).catch(function(err){
        console.log(err)
    res.send({status:500});
    })
}

//按要求获取群消息
exports.getOneGroupMsg = function(gid,res){
    var query = GroupMsg. findOne({}) ;
    //查询条件
    query.where({'groupID':gid});
    //关联的user对象
    query. populate('userID');
    //排序方式 最有通讯时间倒序排列
    query. sort({'time' :- 1});
    //查询结果
    query.exec().then(function(ver){
    let result = {
    message : ver.message,
    time : ver.time,
    types : ver. types,
    name:ver.userID.name,
    }
    res.send({status:200, result});
    }).catch(function(err){
    res. send({status:500});
    
    })
}

//群消息状态修改
exports.updateGroupMsg = function(data, res){
    //修改项条件
    let wherestr = {'userID' :data.uid, 'groupID' :data. fid};
    //修改内容
    let updatestr = {'tip':0}
    
    Message.updateOne(wherestr, updatestr, (err,result) => {
    if(err){
    res.send({status:500});
    }else{
    res.send({status:200});
    
    }
    
    })
} 

//消息操作
//分页获取数据一对一聊天数据
exports.msg = function(data,res){
    var skipNum = data.nowPage*data.pageSize;//跳过的条数

    //
    let query = Message.find ({}) ;
        //查询条件
    query.where({$or: [{'userID':data.uid,'friendID' :data. fid}, {'userID': data. fid, 'friendID' : data.uid}]});

    //排序方式 最有通讯时间倒序排列
    query.sort({'time' :- 1});

        //查找frindeID 关联的user对象
        query.populate('userID');
        //跳过条数
        query.skip(skipNum);
        //一页条数
        query.limit(data.pageSize);
        //查询结果
        query.exec().then(function(e){
            let result = e.map(function(ver){
                //console.log(ver.time)
                return {
                    id:ver._id,
                    message: ver.message,
                    types:ver.types,
                    time:ver.time,
                    fromId:ver.userID._id,
                    imgurl:ver.userID.imgurl,
                    }
        
                })
                //console.log(res)
                res.send({status:200,result});
                //console.log(result[2].time,'时间')
            }).catch(function(err){
        //res.send({status:500});
    })
}

