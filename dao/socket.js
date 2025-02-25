let dbserver =  require('./dbserver');

module.exports = function(io){
     var users = {};
    io.on('connection', (socket) => { 

        //console.log('连接成功');
        socket.on('login',(id)=>{

          console.log(id,'id');
          //回复客户端
          socket.name = id;
          users[id] = socket.id;
          //console.log(users);
          socket.emit('login',socket.id);
        });

        socket.on('msg',(msg,fromid,toid)=>{
          console.log(fromid,toid,'17')
          console.log(msg.message,'18')
          dbserver.upFriendLastTime({uid:fromid,fid:toid});
          dbserver.insertMsg(fromid,toid,msg.message,msg.types);
          console.log(users,'大萨达1')
          console.log(toid,'大萨达2')
          console.log(users[toid],'大萨达3')
          //users[toid]=toid
          //发送给对方
          if(users[toid]){
            console.log('大萨达4')
            socket.to(users[toid]).emit('msg',msg,fromid,0);
          }
          //发送给自己
          socket.emit('msg',msg,toid,1);
      
        
        });

       // 加入群
      socket.on('group',function(data){
        socket.join(data)
      });
      //接收群消息
      socket.on('groupMsg',function(msg,fromid,gid,name,img){
        console.log(gid,'gid')
        socket.to(gid).emit('groupMsg',msg,fromid,gid,name,img);
           socket.emit('groupmsg',msg,fromid,name,img,1)
      })
      //告知离开当前聊天页面
      socket.on('leaveChatr',function(uid,fid){
        socket.emit('leavechatr',uid,fid)
      })


        //用户离开
        socket.on('disconnecting',() => {
          //console.log(users)
          if(users.hasOwnProperty(socket.name)){
            console.log(socket.name+'离开')
            delete users[socket.name];
          }
        })
      });
}